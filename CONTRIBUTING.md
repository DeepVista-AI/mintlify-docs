# Contribute to DeepVista docs

Thank you for helping improve the DeepVista documentation.

## How to contribute

### Option 1: Edit on GitHub

1. Open the page you want to change
2. Click **Edit this file** (pencil icon)
3. Make your edits and open a pull request

### Option 2: Local development

1. Fork and clone this repository
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Edit MDX pages or `docs.json`
5. From the repo root, run `mint dev`
6. Preview at `http://localhost:3000`
7. Run `mint broken-links` before opening a PR
8. Commit your changes and open a pull request

## Writing guidelines

- Use active voice: "Run the command" not "The command should be run"
- Address the reader directly with "you"
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold UI labels: Click **Settings**
- Lead with the goal, then the steps
- Use consistent DeepVista terminology from [`AGENTS.md`](./AGENTS.md)
- Include screenshots or GIFs for UI steps when the flow isn't obvious from text alone

## Tutorial shape

Prefer this structure for how-to pages:

1. Short overview (what you get by the end)
2. Prerequisites
3. Step-by-step guide
4. Next steps (optional)

## Before you submit

- Confirm links resolve with `mint broken-links`
- Keep Mintlify starter-kit pages out of public navigation
- Point support, dashboard, and social links at DeepVista — not Mintlify demos
