import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const docsRoot = path.join(process.cwd(), 'content', 'docs');
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

async function collectFiles(dir, predicate, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, predicate, files);
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function pageSlug(filePath) {
  const relative = path.relative(docsRoot, filePath);
  const parsed = path.parse(relative);
  const withoutExt = path.join(parsed.dir, parsed.name).split(path.sep);
  const slugParts = withoutExt.at(-1) === 'index' ? withoutExt.slice(0, -1) : withoutExt;
  return `/docs/${slugParts.filter(Boolean).join('/')}`.replace(/\/$/, '') || '/docs';
}

function normalizeDocsTarget(fromFile, href) {
  const [withoutHash] = href.split('#');
  if (!withoutHash || /^(https?:|mailto:|#)/.test(href)) return null;

  if (withoutHash.startsWith('/')) {
    return withoutHash.replace(/\/$/, '') || '/';
  }

  const target = path.resolve(path.dirname(fromFile), withoutHash);
  const relative = path.relative(docsRoot, target);
  if (relative.startsWith('..')) return null;

  const parsed = path.parse(relative);
  const withoutExt = path.join(parsed.dir, parsed.name).split(path.sep);
  const slugParts = withoutExt.at(-1) === 'index' ? withoutExt.slice(0, -1) : withoutExt;
  return `/docs/${slugParts.filter(Boolean).join('/')}`.replace(/\/$/, '') || '/docs';
}

async function metaEntryExists(metaFile, entry) {
  const directory = path.dirname(metaFile);
  if (entry === 'index') return pages.has(pageSlug(path.join(directory, 'index.mdx')));

  if (pages.has(pageSlug(path.join(directory, `${entry}.mdx`)))) return true;

  try {
    return (await stat(path.join(directory, entry, 'meta.json'))).isFile();
  } catch {
    return false;
  }
}

const mdxFiles = await collectFiles(docsRoot, (file) => file.endsWith('.mdx'));
const metaFiles = await collectFiles(docsRoot, (file) => file.endsWith('meta.json'));
const pages = new Set(mdxFiles.map(pageSlug));
const failures = [];

for (const file of mdxFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(markdownLinkPattern)) {
    const target = normalizeDocsTarget(file, match[1].trim());
    if (target?.startsWith('/docs') && !pages.has(target)) {
      failures.push(`${path.relative(process.cwd(), file)} links to missing page ${match[1]}`);
    }
  }
}

for (const file of metaFiles) {
  const source = JSON.parse(await readFile(file, 'utf8'));
  for (const entry of source.pages ?? []) {
    if (!(await metaEntryExists(file, entry))) {
      failures.push(`${path.relative(process.cwd(), file)} references missing sidebar page ${entry}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} broken docs link(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Docs link check passed for ${pages.size} pages and ${metaFiles.length} sidebar files.`);
