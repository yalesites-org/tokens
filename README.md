# YaleSites Tokens

The tokens in this repository are direct exports from Figma. Style Dictionary runs on PRs to automatically generate the platform-specific implementation files. e.g., `tokens.scss` for web projects.

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
- In your terminal initiate the authentication process by typing `npm login --scope=@yalesites-org --registry=https://npm.pkg.github.com`
- Provide in your credentials
  - Username is your GitHub username (all lower case)
  - Password is the token you just created
  - Email is your public email address
- Done!

</details>

### Installing the package

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
4. Click "Add new credentials"
5. In the "Name" field, enter "YaleSites UI Kit"
6. For Repository, enter `yalesites-org/tokens`
7. For Default Branch, enter `figma`
8. For File Path, use `tokens/tokens.json`
9. Leave "baseURL" blank.
10. Click Save

</details>
