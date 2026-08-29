# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links
- Run `npm run check:docs` to run the repository's own quality checks (see below)

For Mintlify product knowledge (components, configuration, writing standards),
install the Mintlify skill: `npx skills add https://mintlify.com/docs`

## Rules enforced by CI

`scripts/check-docs.mjs` runs on every push and pull request and fails the build on
findings not present in `scripts/docs-check-baseline.json`. Treat these as hard rules —
they are checked mechanically, so there is no judgement call to make.

| Rule | What it means |
|---|---|
| `absolute-internal-url` | Never link to `https://docs.deepvista.ai/...` from inside the docs. Use a site-root relative path (`/tutorials/foo`). An absolute URL escapes Mintlify preview deployments and breaks `mint dev`, while still returning 200 in production — so nothing else catches it. |
| `internal-link` | Internal links start with `/` and resolve against the site root. A bare `foo` resolves against the current page URL, which is almost never what you meant. The target page or asset must exist. |
| `anchor` | A `#fragment` must match a heading on the target page that slugifies to it. |
| `orphan-page` | Mintlify serves **any** `.mdx` file in the repo, whether or not `docs.json` references it. A file that is served but absent from `docs.json` navigation is a page you published by accident. `"hidden": true` removes a page from the nav but does **not** unpublish it. |
| `docs-json-host` | `docs.json` chrome (nav, footer, CTA) must not point at external hosts left over from the starter kit. |
| `alt-text` | Every image needs real alt text. Empty (`![](...)`) and placeholder (`alt="Image"`, or the filename) both fail. |
| `eof-newline` | Every file ends with a newline. |
| `unreferenced-asset` | Files under `images/` and `videos/` that nothing links to. Delete them rather than letting the directory grow. |
| `mdx-compile` | Every page must actually compile as MDX. |

## Release / version pages

One page per release at `version/<major>-<minor>-<patch>.mdx`, added to the `version/*`
list in `docs.json`. Match the shape already on `main` — `0-7-1.mdx` is the reference:

- Frontmatter is `title: "Version X.Y.Z"` and a one-sentence `description` summarising the release.
- Body is a flat numbered list of changes, each opening `#### **N. Short sentence**.`
- One to three short sentences per item. One idea per sentence.
- No date line, no "Highlights" block, no `CardGroup`, no `<h1>` — the `title` frontmatter renders the page heading.
- Screenshots and GIFs go in `images/` and are referenced with a site-root path and real alt text.

Length follows the release. A nine-item release is a longer page than a five-item one;
that is not a problem. Deviating from the *structure* above is.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## Terminology

> **Unresolved — needs a human decision.** Both vocabularies are live in the docs today.

The product vocabulary changed and the docs were never fully migrated, so pages
disagree with each other. Until someone settles this, **match the page you are editing
rather than introducing a third variant**, and do not do a site-wide rename as a
drive-by.

Known unsettled pairs:

- **"Workflow" vs "Recipe"** — `cli.mdx` is the only page still carrying Recipe-era
  prose, alongside a stale built-in-skills table.
- **"Light Workflow" vs "Playbook"** — the `docs.json` nav group is `Playbooks`, but
  `index.mdx:52` still reads "A light Workflow" (also mis-capitalised mid-phrase).

Released version pages are the exception: `version/0-6-7.mdx` and `version/0-6-9.mdx`
say "light workflow" because that is what the feature was called at the time. Release
notes are a historical record — **do not rename terminology in them.**

## Content boundaries

- Do not commit drafts. Mintlify publishes any `.mdx` file in the repo the moment it
  syncs, so a half-finished page on `main` is a live page. Use a branch.
- Do not put internal-only material — internal email addresses, prompts written for the
  team, scratch notes — in a page. It ships publicly.
- Renaming a page slug breaks external bookmarks. Add a `redirects` entry in `docs.json`
  when you rename.
