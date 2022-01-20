# YaleSites Tokens

The tokens in this repository are direct exports from Figma. Style Dictionary runs on PRs to automatically generate the platform-specific implementation files. e.g., `tokens.scss` for web projects.

## Releases

Any time something is changed in the `tokens` directory and pushed to the main branch on GitHub, a [GitHub Action](.github/workflows/generate-tokens-on-input.yml) is run to build the Style Dictionary assets and cut a new release.

This is an entirely automated process, so however tokens get updated, whether by Figma, or manually, the release process will be run.
