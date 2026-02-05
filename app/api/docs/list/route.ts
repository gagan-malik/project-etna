import { NextResponse } from "next/server";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const DOCS_DIR = "docs";

/**
 * GET /api/docs/list - List markdown docs under docs/ for @-mention and reference.
 * No auth required so chat can show doc list before sign-in (read-only public docs).
 */
export async function GET() {
  try {
    const baseDir = join(process.cwd(), DOCS_DIR);
    const docs: { path: string; title: string }[] = [];

    function walk(dir: string, prefix: string) {
      let names: string[];
      try {
        names = readdirSync(dir);
      } catch {
        return;
      }
      for (const name of names) {
        if (name.startsWith(".")) continue;
        const fullPath = join(dir, name);
        const rel = prefix ? `${prefix}/${name}` : name;
        try {
          const st = statSync(fullPath);
          if (st.isDirectory()) {
            walk(fullPath, rel);
          } else if (st.isFile() && (name.endsWith(".md") || name.endsWith(".mdx"))) {
            const title = name.replace(/\.(md|mdx)$/, "").replace(/[-_]/g, " ");
            docs.push({ path: rel, title });
          }
        } catch {
          // skip
        }
      }
    }

    walk(baseDir, "");
    docs.sort((a, b) => a.path.localeCompare(b.path));

    return NextResponse.json({ docs });
  } catch (error) {
    console.error("Error listing docs:", error);
    return NextResponse.json(
      { error: "Failed to list docs" },
      { status: 500 }
    );
  }
}
