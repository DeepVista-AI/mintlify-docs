# DeepVista docs

Documentation for [DeepVista](https://deepvista.ai) — the shared brain for founders and their agents.

Built with [Mintlify](https://mintlify.com). Live site configuration is in `docs.json`.

## AI-assisted writing

Set up your AI coding tool to work with Mintlify:

```bash
npx skills add https://mintlify.com/docs
```

This installs Mintlify's documentation skill (components, writing standards, workflow guidance) for Cursor, Claude Code, Windsurf, and other supported tools.

Also read [`AGENTS.md`](./AGENTS.md) for DeepVista-specific terminology and style rules.

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm i -g mint
```

From the repository root (where `docs.json` lives):

```bash
mint dev
```

Preview at `http://localhost:3000`.

Check for broken links:

```bash
mint broken-links
```

## Publishing

Changes on the default branch deploy automatically after the Mintlify GitHub app is installed for the org. Configure the app from the [Mintlify dashboard](https://dashboard.mintlify.com/settings/organization/github-app).

## Need help?

- Writing guidelines: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Product terminology: [`AGENTS.md`](./AGENTS.md)
- Mintlify docs: [mintlify.com/docs](https://mintlify.com/docs)
- Support: [support@deepvista.ai](mailto:support@deepvista.ai)
