> **Customize this file**: Tailor this template to your project by noting specific contribution types you're looking for, adding a Code of Conduct, or adjusting the writing guidelines to match your style.

# Contribute to the documentation

Thank you for your interest in contributing to our documentation! This guide will help you get started.

## How to contribute

### Option 1: Edit directly on GitHub

1. Navigate to the page you want to edit
2. Click the "Edit this file" button (the pencil icon)
3. Make your changes and submit a pull request

### Option 2: Local development

1. Fork and clone this repository
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Make changes
5. Navigate to the docs directory and run `mint dev`
6. Preview your changes at `http://localhost:3000`
7. Commit your changes and submit a pull request

## Automated checks

Every push and pull request runs `npm run check:docs`, which verifies that each
`.mdx` file compiles, that internal links and deep-link anchors resolve, that no
page is published without appearing in `docs.json`, and that images carry real
alt text. Run it locally before pushing:

```bash
npm install
npm run check:docs
```

Pre-existing issues are recorded in `scripts/docs-check-baseline.json`, so the
check only fails on newly introduced ones. After fixing something on that list,
lock the improvement in with:

```bash
npm run check:docs -- --update-baseline
```

## Writing guidelines

- **Use active voice**: "Run the command" not "The command should be run"
- **Address the reader directly**: Use "you" instead of "the user"
- **Keep sentences concise**: Aim for one idea per sentence
- **Lead with the goal**: Start instructions with what the user wants to accomplish
- **Use consistent terminology**: Don't alternate between synonyms for the same concept
- **Include examples**: Show, don't just tell
