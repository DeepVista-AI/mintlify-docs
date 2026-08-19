#!/usr/bin/env node
// Documentation quality checks. Run with `npm run check:docs`.
//
// Every check produces stable violation keys. Keys already listed in
// scripts/docs-check-baseline.json are pre-existing debt and do not fail the
// build; anything new does. To accept the current state as the new baseline:
//
//   npm run check:docs -- --update-baseline
//
// The intent is to block regressions on push without demanding the existing
// backlog be cleared first.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@mdx-js/mdx'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE = path.join(ROOT, 'scripts', 'docs-check-baseline.json')
const UPDATE = process.argv.includes('--update-baseline')

const SKIP_DIRS = new Set(['node_modules', '.git', '.github', 'images', 'videos', 'logo'])
const ASSET_DIRS = ['images', 'videos', 'logo']
// snippets/ holds reusable fragments; Mintlify does not serve them as pages.
const NON_PAGE_DIRS = new Set(['snippets'])
const ALLOWED_HOSTS = [/(^|\.)deepvista\.ai$/, /(^|\.)mintlify\.com$/ /* $schema only, narrowed below */]

const violations = []
const add = (check, key, detail) => violations.push({ check, key: `${check}:${key}`, detail })

/* ---------------------------------------------------------------- helpers */

function walk(dir, test, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, test, out)
    } else if (test(e.name)) out.push(p)
  }
  return out
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/')
const mdxFiles = () => walk(ROOT, (n) => n.endsWith('.mdx')).sort()
const stripFrontmatter = (s) => s.replace(/^---\n[\s\S]*?\n---\n/, '')

function slugify(text) {
  return text
    .replace(/`|\*\*|\*|_/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const docsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs.json'), 'utf8'))

function navPages(node, out = new Set()) {
  if (typeof node === 'string') out.add(node.replace(/^\//, ''))
  else if (Array.isArray(node)) node.forEach((n) => navPages(n, out))
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (['pages', 'groups', 'tabs', 'navigation', 'anchors'].includes(k)) navPages(v, out)
    }
  }
  return out
}
const PAGES = navPages(docsJson.navigation ?? {})
const REDIRECTS = new Set((docsJson.redirects ?? []).map((r) => String(r.source ?? '').replace(/^\//, '')))

/* ----------------------------------------------------------------- checks */

// 1. Every .mdx must actually compile. This is the check that catches a
//    malformed JSX attribute reaching main, e.g. title={Bare prose "here"}.
async function checkMdxCompiles() {
  for (const f of mdxFiles()) {
    try {
      await compile(stripFrontmatter(fs.readFileSync(f, 'utf8')))
    } catch (err) {
      add('mdx-compile', rel(f), String(err.message).split('\n')[0])
    }
  }
}

// 2. Internal links must resolve to a page, a redirect, or a real asset.
//    Renames are the recurring failure mode here.
function checkInternalLinks() {
  const assetExists = (p) => fs.existsSync(path.join(ROOT, p.replace(/^\//, '')))
  for (const f of mdxFiles()) {
    const src = fs.readFileSync(f, 'utf8')
    const links = new Set()
    for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) links.add(m[1])
    // markdown links, dropping any optional "title" suffix
    for (const m of src.matchAll(/\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g)) links.add(m[1])

    for (const raw of links) {
      if (/^(https?:|mailto:|#|tel:)/.test(raw)) continue
      const [target] = raw.split('#')
      if (!target) continue
      if (!target.startsWith('/')) {
        add('internal-link', `${rel(f)} -> ${raw}`, 'relative link; resolves against the page URL, not the site root')
        continue
      }
      const clean = target.replace(/^\//, '').replace(/\/$/, '')
      if (/\.\w{2,5}$/.test(clean)) {
        if (!assetExists(clean)) add('internal-link', `${rel(f)} -> ${raw}`, 'asset file does not exist')
      } else if (!PAGES.has(clean) && !REDIRECTS.has(clean)) {
        add('internal-link', `${rel(f)} -> ${raw}`, 'no such page in docs.json and no redirect')
      }
    }
  }
}

// 3. Deep-link anchors must exist on the target page.
function checkAnchors() {
  const anchors = new Map()
  for (const f of mdxFiles()) {
    const src = fs.readFileSync(f, 'utf8')
    const set = new Set()
    for (const m of src.matchAll(/^#{1,6}\s+(.+)$/gm)) set.add(slugify(m[1]))
    for (const m of src.matchAll(/<Step\s+title=['"]?(?:\{)?(.*?)(?:\})?['"]?>/g)) set.add(slugify(m[1]))
    anchors.set('/' + rel(f).replace(/\.mdx$/, ''), set)
  }
  for (const f of mdxFiles()) {
    const src = fs.readFileSync(f, 'utf8')
    for (const m of src.matchAll(/(?:href="|\]\()(\/[^)"\s]*#[^)"\s]+)/g)) {
      const [page, anchor] = m[1].split('#')
      const set = anchors.get(page.replace(/\/$/, ''))
      if (!set) add('anchor', `${rel(f)} -> ${m[1]}`, 'target page not found')
      else if (!set.has(anchor)) add('anchor', `${rel(f)} -> ${m[1]}`, 'no heading on that page slugifies to this anchor')
    }
  }
}

// 4. Mintlify serves any .mdx in the repo, whether docs.json references it or
//    not. An unreferenced file is a page published with no way to reach it.
function checkOrphanPages() {
  for (const f of mdxFiles()) {
    const p = rel(f).replace(/\.mdx$/, '')
    if (NON_PAGE_DIRS.has(p.split('/')[0])) continue
    if (!PAGES.has(p)) add('orphan-page', p, 'file is served but absent from docs.json navigation')
  }
}

// 5. Assets nothing references are dead weight in the clone.
function checkUnreferencedAssets() {
  let corpus = ''
  for (const f of walk(ROOT, (n) => /\.(mdx|md|json)$/.test(n))) {
    // the baseline records asset paths by name; reading it back in would make
    // every already-known orphan look referenced
    if (path.resolve(f) === BASELINE) continue
    corpus += fs.readFileSync(f, 'utf8')
  }
  for (const dir of ASSET_DIRS) {
    const abs = path.join(ROOT, dir)
    if (!fs.existsSync(abs)) continue
    for (const f of walk(abs, () => true)) {
      const name = path.basename(f)
      if (!corpus.includes(name)) add('unreferenced-asset', rel(f), `${(fs.statSync(f).size / 1e6).toFixed(2)} MB, referenced nowhere`)
    }
  }
}

// 6. Images need real alt text for screen readers and for search.
function checkAltText() {
  for (const f of mdxFiles()) {
    const src = fs.readFileSync(f, 'utf8')
    let n = 0
    for (const m of src.matchAll(/!\[([^\]]*)\]\(/g)) {
      const alt = m[1].trim()
      if (alt === '' || /^(image|screenshot|img)$/i.test(alt)) {
        n += 1
        add('alt-text', `${rel(f)}#${n}`, alt === '' ? 'empty alt text' : `placeholder alt text "${alt}"`)
      }
    }
    for (const m of src.matchAll(/<img\b[^>]*\balt=""/g)) {
      n += 1
      add('alt-text', `${rel(f)}#img${n}`, 'empty alt text')
    }
  }
}

// 7. docs.json drives site chrome; a stray external host there ships someone
//    else's branding, or a personal file-share link, on every page.
function checkDocsJsonHosts() {
  const raw = fs.readFileSync(path.join(ROOT, 'docs.json'), 'utf8')
  for (const m of raw.matchAll(/https?:\/\/([^"/]+)/g)) {
    const host = m[1].toLowerCase()
    if (/(^|\.)deepvista\.ai$/.test(host)) continue
    if (host === 'mintlify.com' && raw.includes('"$schema"')) {
      // the $schema URL is legitimate; anything else on that host is not
      const isSchema = raw.slice(Math.max(0, m.index - 60), m.index).includes('$schema')
      if (isSchema) continue
    }
    add('docs-json-host', host, 'external host referenced from docs.json chrome')
  }
}

// 8. Text files should end with a newline (keeps diffs and appends clean).
function checkEofNewline() {
  for (const f of walk(ROOT, (n) => /\.(mdx|md|json)$/.test(n))) {
    const b = fs.readFileSync(f)
    if (b.length && b[b.length - 1] !== 0x0a) add('eof-newline', rel(f), 'file does not end with a newline')
  }
}

/* ------------------------------------------------------------------- main */

await checkMdxCompiles()
checkInternalLinks()
checkAnchors()
checkOrphanPages()
checkUnreferencedAssets()
checkAltText()
checkDocsJsonHosts()
checkEofNewline()

const seen = violations.map((v) => v.key).sort()

if (UPDATE) {
  fs.writeFileSync(BASELINE, JSON.stringify({ accepted: seen }, null, 2) + '\n')
  console.log(`baseline updated: ${seen.length} accepted violations`)
  process.exit(0)
}

const accepted = new Set(
  fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')).accepted ?? [] : []
)
const fresh = violations.filter((v) => !accepted.has(v.key))
const fixed = [...accepted].filter((k) => !seen.includes(k))

const byCheck = new Map()
for (const v of fresh) byCheck.set(v.check, [...(byCheck.get(v.check) ?? []), v])

if (fresh.length) {
  console.log(`\n${fresh.length} new documentation issue(s):\n`)
  for (const [check, list] of [...byCheck].sort()) {
    console.log(`  ${check}`)
    for (const v of list) console.log(`    ${v.key.slice(check.length + 1)}\n      ${v.detail}`)
    console.log('')
  }
}
if (fixed.length) {
  console.log(`${fixed.length} baselined issue(s) no longer present — run \`npm run check:docs -- --update-baseline\` to lock the improvement in:`)
  for (const k of fixed) console.log(`    ${k}`)
  console.log('')
}
if (!fresh.length) {
  console.log(`docs checks passed — ${seen.length} known issue(s) baselined, 0 new.`)
}
process.exit(fresh.length ? 1 : 0)
