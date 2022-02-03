# YaleSites Tokens

The tokens in this repository are direct exports from Figma. Style Dictionary runs on PRs to automatically generate the platform-specific implementation files. e.g., `tokens.scss` for web projects.

## Developing on the tokens within the component library

There may be times when you need to create "hand-crafted" tokens, or pull in updates from Figma before they are actually published as a released package. You can use `npm link` to develop the tokens, and use them in the component library repo.

- Clone the tokens repo to your local machine and move into it `git clone git@github.com:yalesites-org/tokens.git && cd tokens`
- Run `npm link` to create a global link to this folder on your local machine.
- In the component library repo on your local machine, run `npm link @yalesites-org/tokens`. This will tell the component library to use your locally cloned version of the `tokens` repo, instead of downloading the package via npm.
- Now, you can make changes in the `tokens` repo locally, and run the build script to generate the build directory. Any time you do that, your local copy of the component library will use those locally built tokens. This makes it really easy to verify the new tokens are being generated as expected before they are actually published.
- Once the new tokens are "finalized" they should be pushed up to a new PR against the `tokens` repo, and merged into `main` to publish them as a new version.
- After that is complete (usually takes a couple minutes), you should run `npm update @yalesites-org/tokens` in the component library to update the lock file to reference the new release of the tokens. If you skip this step, you'll continue to pull the previous tokens package, without the new tokens.

NOTE: Any time you run `npm install` the linked package will be replaced with one actually downloaded via npm. This means if you want to work on the tokens locally again, you'll need to re-run `npm link @yalesites-org/tokens`

## Releases

Any time something is changed in the `tokens` directory and pushed to the main branch on GitHub, a [GitHub Action](.github/workflows/generate-tokens-on-input.yml) is run to build the Style Dictionary assets and cut a new release.

This is an entirely automated process, so however tokens get updated, whether by Figma, or manually, the release process will be run.

## Installation

<details><summary>Prerequisites</summary>

Each environment that needs to pull @yalesites-org packages from GitHub needs to be authenticated using a "Personal Access Token". This only needs to be done once per-environment.

- Go to `https://github.com/settings/tokens/new`
  - In the "Note" field add something like "YaleSites GitHub Packages"
  - Choose an expiration value
  - Check the box for "write:packages" (this will automatically check all of the "repo" boxes as well)
  - Click "Generate token"
- On your local machine, create an environment variable. This process varies depending on the shell and operating system you use. It will be something similar to this though: `export KEY=value`.
  - The `key` for YaleSites projects needs to be `YALESITES_BUILD_TOKEN`
  - The `value` is the token you created above
- Done!

</details>

### Installing this package in another project

There must be a `.npmrc` file in the project root that tells npm to get `@yalesites-org` packages from GitHub rather than npm.

- Create a `.npmrc` file in your project root (or modify an existing one) and add the following:

```bash
@yalesites-org:registry=https://npm.pkg.github.com
```

Then you can install the package like any other npm dependency.

```bash
npm install @yalesites-org/tokens
```

## Connecting Figma

<details><summary>How get a Github Personal Access Token</summary>

1. Go to the [Personal Access Tokens section](https://github.com/settings/tokens) or click on your avatar in the top right, go to Settings > scroll down to Developer Settings > Personal Access Tokens
2. Click "Generate new Token"
3. In the "Note" section, type "YaleSites Deploy Token"
4. Select "repo" for the scope (the very first checkbox)
5. Select a token expiration date (or "No expiration")
6. Scroll down and click Generate token.
7. Copy the token. You will only see this once!

</details>

<details><summary>How to set up the Figma Token plugin</summary>

1. Install the [Figma Tokens](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens) plugin.
2. Navigate to the Figma UI Kit and launch the Figma Tokens plugin.
3. Go to Sync and under Token Storage, select GitHub.
4. Click "Add new credentials" and enter the following:
   - Name: `YaleSites UI Kit`
   - Personal Access Token: (Paste the access token you created above)
   - Repository: `yalesites-org/tokens`
   - Default Branch: `figma`
   - File Path: `tokens/figma-export/tokens.json`
   - baseURL: (leave blank)
   - Click Save

</details>
