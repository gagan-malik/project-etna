"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      matches.push({ id, text, level });
    }

    setHeadings(matches);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <aside className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 xl:block">
      <div className="h-full overflow-y-auto py-6 pl-6">
        <div className="space-y-2">
          <h4 className="mb-4 text-sm font-medium">On this page</h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <Link
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-sm transition-colors hover:text-foreground ${
                  heading.level === 2
                    ? "text-foreground/80"
                    : "text-foreground/60 pl-4"
                }`}
              >
                {heading.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
