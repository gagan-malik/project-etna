"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import "highlight.js/styles/github-dark.css";

const prose =
  "prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:scroll-m-20 prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h2:mt-10 prose-h2:scroll-m-20 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:first:mt-0 prose-h3:mt-8 prose-h3:scroll-m-20 prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-p:leading-7 prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-li:my-0 prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic";

export function DocMarkdown({ content }: { content: string }) {
  return (
    <div className={prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRewriteDocsLinks]}
        components={{
          a({ href, children, ...props }) {
            const isInternal =
              href?.startsWith("/") && !href.startsWith("//") && !href.startsWith("/docs");
            const target = isInternal && href ? `/docs${href === "/" ? "" : href}` : href;
            if (target?.startsWith("/")) {
              return (
                <Link href={target} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            if (isInline) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} block`} {...props}>
                {children}
              </code>
            );
          },
          pre({ children, ...props }) {
            return (
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4" {...props}>
                {children}
              </pre>
            );
          },
          h2({ children, ...props }) {
            const text = String(children).replace(/\n/g, " ");
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const text = String(children).replace(/\n/g, " ");
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function rehypeRewriteDocsLinks() {
  return (tree: import("hast").Root) => {
    const visit = (node: import("hast").Element) => {
      if (node.tagName === "a" && node.properties?.href) {
        const href = String(node.properties.href);
        if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/docs")) {
          node.properties.href = `/docs${href === "/" ? "" : href}`;
        }
      }
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "element") visit(child);
        }
      }
    };
    for (const child of tree.children) {
      if (child.type === "element") visit(child);
    }
  };
}
