import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** Docs live in the parent repo's docs/ folder (monorepo). */
const DOCS_DIR = path.join(process.cwd(), "..", "docs");
const IGNORE = new Set([".vitepress", ".gitignore", "public", "assets", "_site"]);

function getMdPaths(dir: string, relative = ""): string[] {
  const full = path.join(dir, relative);
  if (!fs.existsSync(full) || !fs.statSync(full).isDirectory()) return [];
  const entries = fs.readdirSync(full, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const rel = relative ? `${relative}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (IGNORE.has(e.name)) continue;
      out.push(...getMdPaths(dir, rel));
    } else if (e.name.endsWith(".md")) {
      out.push(rel);
    }
  }
  return out;
}

function pathToSlug(filePath: string): string[] {
  let normalized = filePath.replace(/\.md$/, "");
  normalized = normalized.replace(/\/index$/, ""); // e.g. product/index -> product
  if (normalized === "index" || normalized === "") return []; // root index.md -> []
  return normalized.split("/");
}

export function getDocSlugs(): string[][] {
  const paths = getMdPaths(DOCS_DIR);
  const slugs = paths.map(pathToSlug);
  const seen = new Set<string>();
  const unique: string[][] = [];
  for (const s of slugs) {
    const key = s.join("/");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(s);
  }
  return unique;
}

export interface DocMeta {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface DocContent {
  content: string;
  meta: DocMeta;
}

export function getDocBySlug(slug: string[]): DocContent | null {
  let filePath: string;
  if (slug.length === 0) {
    filePath = path.join(DOCS_DIR, "index.md");
  } else {
    const withIndex = [...slug, "index.md"];
    const direct = [...slug.slice(0, -1), `${slug[slug.length - 1]}.md`];
    const tryIndex = path.join(DOCS_DIR, ...withIndex);
    const tryDirect = path.join(DOCS_DIR, ...direct);
    if (fs.existsSync(tryIndex)) filePath = tryIndex;
    else if (fs.existsSync(tryDirect)) filePath = tryDirect;
    else return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const clean = stripVitePressContainers(content);
  return { content: clean, meta: data as DocMeta };
}

function stripVitePressContainers(md: string): string {
  return md.replace(/:::(\w+)\n([\s\S]*?):::/g, (_match, type, body) => {
    const trimmed = body.trim();
    if (type === "tip" || type === "warning" || type === "info") {
      return trimmed
        .split("\n")
        .map((line: string) => `> ${line}`)
        .join("\n\n");
    }
    return trimmed;
  });
}

export function getDocNav(): { slug: string[]; title: string }[] {
  const slugs = getDocSlugs();
  const nav: { slug: string[]; title: string }[] = [];
  for (const s of slugs) {
    const doc = getDocBySlug(s);
    const title =
      (doc?.meta?.title as string) ||
      (s.length ? s[s.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Home");
    nav.push({ slug: s, title });
  }
  nav.sort((a, b) => {
    const aKey = a.slug.join("/") || " ";
    const bKey = b.slug.join("/") || " ";
    return aKey.localeCompare(bKey);
  });
  return nav;
}

export interface NavSection {
  title: string;
  items: { slug: string[]; title: string }[];
}

export function getDocNavSections(): NavSection[] {
  const nav = getDocNav();
  
  // Group docs into sections
  const sections: NavSection[] = [
    {
      title: "Introduction",
      items: nav.filter(
        (item) =>
          item.slug.length === 0 ||
          item.slug[0] === "getting-started" ||
          item.slug[0] === "soul-doc"
      ),
    },
    {
      title: "API Reference",
      items: nav.filter((item) => item.slug[0] === "api"),
    },
    {
      title: "Guides",
      items: nav.filter(
        (item) =>
          item.slug.length > 0 &&
          !["api", "product"].includes(item.slug[0]) &&
          item.slug[0] !== "getting-started" &&
          item.slug[0] !== "soul-doc"
      ),
    },
  ];

  return sections.filter((section) => section.items.length > 0);
}

export interface SearchIndexEntry {
  slug: string[];
  title: string;
  excerpt: string;
}

/** Plain text excerpt from markdown (strip code blocks, links, etc.) for search. */
function toPlainExcerpt(md: string, maxLen: number): string {
  const stripped = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, maxLen) + (stripped.length > maxLen ? "…" : "");
}

export function getSearchIndex(): SearchIndexEntry[] {
  const slugs = getDocSlugs();
  const entries: SearchIndexEntry[] = [];
  for (const slug of slugs) {
    const doc = getDocBySlug(slug);
    const title =
      (doc?.meta?.title as string) ||
      (slug.length ? slug[slug.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Home");
    const excerpt = doc?.content ? toPlainExcerpt(doc.content, 200) : "";
    entries.push({ slug, title, excerpt });
  }
  return entries;
}
