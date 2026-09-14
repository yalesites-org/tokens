#!/usr/bin/env node
/**
 * Post-build assertion: the component-theme slot tokens keep the shape consumers read.
 *
 * Why this exists (YaleSites-Internal#1628). `component-themes.four` and `.five` were authored
 * with an extra `colors:` level that `one`, `two` and `three` do not have. Style Dictionary
 * builds the path it is given, so the emitted property became
 * `--component-themes-four-colors-slot-one` while every consumer reads
 * `--component-themes-four-slot-one`. A `var()` naming a property that does not exist renders
 * as nothing and logs nothing, so two whole component themes silently ignored their palette
 * across 146 reads in 19 component-library-twig stylesheets, and nothing anywhere went red.
 *
 * That is the failure mode worth guarding: not a wrong colour, but a colour that is absent
 * while every stage of the build stays green. The shape is what the consumers depend on, so
 * the shape is what gets asserted -- in both outputs, because they can disagree:
 *
 *   1. build/json/tokens.json -- every component theme exposes slot-one..slot-eight at the
 *      same depth, with nothing nested in between.
 *   2. build/css/tokens.css  -- the flat `--component-themes-<theme>-<slot>` property is
 *      emitted for every theme; that is the name consumers actually read.
 *
 * Presence of the flat name is the whole check, deliberately. Re-nesting a theme makes the
 * flat property disappear, so presence already catches the regression this exists for -- and
 * an absence check for a `-colors-` variant would be wrong as well as redundant, since
 * `global-themes` legitimately has a `colors` level and emits 63 such properties of its own.
 *
 * Runs as part of `npm run build`, so it covers the release workflow (which runs
 * `npm run build` before `semantic-release`) as well as local builds and `npm run develop`.
 * This repo has no test framework and pins Node 16.13, so this is plain CommonJS with no
 * dependencies rather than a `node:test` suite -- and a post-build check is the right shape
 * anyway, since half of what it asserts only exists after the build.
 */
const fs = require("fs");
const path = require("path");

const SLOTS = [
  "slot-one",
  "slot-two",
  "slot-three",
  "slot-four",
  "slot-five",
  "slot-six",
  "slot-seven",
  "slot-eight",
];

const JSON_OUT = path.join(__dirname, "..", "build", "json", "tokens.json");
const CSS_OUT = path.join(__dirname, "..", "build", "css", "tokens.css");

/** Collected rather than thrown one at a time, so one run reports every theme that is wrong. */
const problems = [];

/** How many component themes were checked; reported on success. */
let themeCount = 0;

function read(file) {
  if (!fs.existsSync(file)) {
    problems.push(
      `${path.relative(
        process.cwd(),
        file
      )} does not exist -- the build did not produce it, ` +
        "so this check would otherwise pass by not looking at anything"
    );
    return null;
  }
  return fs.readFileSync(file, "utf8");
}

const jsonSource = read(JSON_OUT);
const cssSource = read(CSS_OUT);

if (jsonSource && cssSource) {
  const tokens = JSON.parse(jsonSource);
  const themes = tokens["component-themes"] || {};
  const names = Object.keys(themes);
  themeCount = names.length;

  // Guards the guard: an empty or renamed group means every loop below iterates nothing and
  // the check passes while asserting nothing at all.
  if (names.length === 0) {
    problems.push(
      "build/json/tokens.json has no `component-themes` group -- it was renamed or removed, " +
        "and this check is now looking at nothing"
    );
  }

  names.forEach((name) => {
    const theme = themes[name];

    // `json/nested` emits resolved values as plain strings, so a present slot is a non-empty
    // string at the top level of the theme -- not an object with a `value` key.
    const missing = SLOTS.filter(
      (slot) => typeof theme[slot] !== "string" || !theme[slot]
    );
    if (missing.length > 0) {
      // Name the likely cause when the slots exist but one level down, because that is the
      // mistake this guard was written for and the fix is then obvious.
      const nested = Object.keys(theme).filter(
        (key) =>
          theme[key] &&
          typeof theme[key] === "object" &&
          SLOTS.some((slot) => typeof theme[key][slot] === "string")
      );
      problems.push(
        `component-themes.${name} is missing ${missing.join(
          ", "
        )} as direct children` +
          (nested.length > 0
            ? ` -- they are nested under \`${nested.join(
                "`, `"
              )}\`. Lift them one level so ` +
              `this theme matches the others; the extra level changes the emitted property ` +
              `name and every consumer's var() silently resolves to nothing.`
            : ". Every component theme must expose all eight slots at the same depth.")
      );
    }
  });

  // The CSS is what consumers actually read, and it is generated from the JSON by a separate
  // platform config -- so assert it directly rather than inferring it from the JSON above.
  names.forEach((name) => {
    SLOTS.forEach((slot) => {
      const wanted = `--component-themes-${name}-${slot}:`;
      if (!cssSource.includes(wanted)) {
        problems.push(
          `build/css/tokens.css never declares \`${wanted.slice(
            0,
            -1
          )}\`, which is the ` +
            "property component-library-twig reads. Consumers will resolve it to nothing."
        );
      }
    });
  });
}

if (problems.length > 0) {
  process.stderr.write(
    "Token shape check failed (YaleSites-Internal#1628).\n\n" +
      problems.map((problem) => `  - ${problem}\n`).join("") +
      "\nThese properties are read with bare `var()` calls in component-library-twig, so a\n" +
      "missing one produces no error anywhere -- just a component quietly ignoring its\n" +
      "palette. Fix the shape in tokens/base/color.yml rather than relaxing this check.\n"
  );
  process.exit(1);
}

process.stdout.write(
  `Token shape OK: ${SLOTS.length} slots x ${themeCount} component themes, flat in both ` +
    "JSON and CSS.\n"
);
