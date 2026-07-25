# Documentation project instructions

## About this project

- This is the [DeepVista](https://deepvista.ai) documentation site, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

For Mintlify product knowledge (components, configuration, writing standards),
install the Mintlify skill: `npx skills add https://mintlify.com/docs`

## Terminology

| Prefer | Avoid / notes |
| --- | --- |
| VistaBook | playbook (ok as plain-language gloss), "AI playbook" |
| VistaBase™ | knowledge base (ok as gloss), "memory store" alone |
| context card | card, knowledge record (ok as gloss) |
| workflow / Recipe | Use **workflow** in product UI docs; **Recipe** when referring to CLI `deepvista recipe` commands |
| Light Workflow | workflows that need no local machine |
| Deep Workflow | workflows that need Claude Code + a connected machine |
| connected machine / runner | local agent, local server (ok as gloss) |
| Claude Code | "Claude CLI" alone when you mean the Anthropic tooling |

Product URLs:

- App: `https://app.deepvista.ai`
- Marketing site: `https://deepvista.ai`
- Discord: `https://go.deepvista.ai/discord`
- Support: `support@deepvista.ai`

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Lead tutorials with a short Overview, then Prerequisites, then a step-by-step guide
- End tutorials with concrete Next steps cards when a natural follow-on exists
- Prefer root-relative links (`/cli`) over absolute docs URLs

## Content boundaries

- Document product features that customers and early-access users can use today
- Don't document internal admin tools, unpublished experiments, or Mintlify starter-kit leftovers
- Keep API Plant Store / essentials / agent-ready starter pages out of public navigation
- Release notes belong under **Release notes**, newest first
