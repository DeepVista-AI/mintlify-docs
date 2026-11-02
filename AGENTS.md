> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Terminology

{/* Add product-specific terms and preferred usage */}
{/* Example: Use "workspace" not "project", "member" not "user" */}

## Style preferences

{/* Add any project-specific style rules below */}

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## Content boundaries

{/* Define what should and shouldn't be documented */}
{/* Example: Don't document internal admin features */}

## Cursor Cloud specific instructions

- This is a static Mintlify docs site (MDX + `docs.json`); there is no `package.json`, backend, or build step. The only tool is the global `mint` CLI.
- The startup update script installs/updates `mint` into a user-writable npm prefix (`~/.npm-global`), which is on `PATH` via `~/.bashrc`. If `mint` is ever not found, run `export PATH="$HOME/.npm-global/bin:$PATH"`.
- Run the dev preview with `mint dev` from the repo root (serves `http://localhost:3000`). Edits to `.mdx` files and `docs.json` hot-reload automatically — no restart needed.
- Lint/validate links with `mint broken-links`. There is no test suite.
- If the dev server behaves oddly after a CLI update, run `mint update` then restart `mint dev`.
