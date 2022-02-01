const yaml = require("yaml");

module.exports = {
  parsers: [
    {
      // A custom parser will only run against filenames that match the pattern
      // This pattern will match any file with the .yaml extension.
      // This allows you to mix different types of files in your token source
      pattern: /\.yml$/,
      // the parse function takes a single argument, which is an object with
      // 2 attributes: contents which is a string of the file contents, and
      // filePath which is the path of the file.
      // The function is expected to return a plain object.
      parse: ({ contents, filePath }) => yaml.parse(contents),
    },
  ],
  source: ["tokens/!(figma-export)/**/*.{json,yml}", "tokens/*.{json,yml}"],
  platforms: {
    scss: {
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "time/seconds",
        "content/icon",
        "size/rem",
        "color/hsl",
      ],
      buildPath: "build/scss/",
      files: [
        {
          destination: "tokens.scss",
          format: "scss/variables",
        },
      ],
    },
    css: {
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "time/seconds",
        "content/icon",
        "size/rem",
        "color/hsl",
      ],
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
        },
      ],
      options: {
        outputReferences: true,
      },
    },
    json: {
      transforms: [
        "attribute/cti",
        "name/cti/pascal",
        "time/seconds",
        "content/icon",
        "size/rem",
        "color/hsl",
      ],
      buildPath: "build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/nested",
        },
      ],
    },
  },
};
