"use client";

import Link from "next/link";
import { Moon, Sun, Search, Share } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import type { SearchIndexEntry } from "@/lib/docs";
import { Tooltip } from "./tooltip";

interface DocsHeaderProps {
  searchIndex: SearchIndexEntry[];
}

export function DocsHeader({ searchIndex }: DocsHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const results =
    normalizedQuery.length < 2
      ? []
      : searchIndex.filter((entry) => {
          const titleMatch = entry.title.toLowerCase().includes(normalizedQuery);
          const excerptMatch = entry.excerpt.toLowerCase().includes(normalizedQuery);
          const slugMatch = entry.slug.some((s) => s.toLowerCase().includes(normalizedQuery));
          return titleMatch || excerptMatch || slugMatch;
        });

  const showResults = open && normalizedQuery.length >= 2;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    function onKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, theme, setTheme]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setFocusedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!showResults || focusedIndex < 0 || focusedIndex >= results.length) return;
    listRef.current?.children[focusedIndex]?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, showResults, results.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        inputRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!showResults) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[focusedIndex]) {
        e.preventDefault();
        const href =
          results[focusedIndex].slug.length === 0
            ? "/docs"
            : `/docs/${results[focusedIndex].slug.join("/")}`;
        window.location.href = href;
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showResults, results, focusedIndex]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/docs" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Project Etna</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Site-wide search */}
        <div className="relative flex flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search documentation..."
            className="h-8 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Search documentation"
            aria-expanded={showResults}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              showResults && results[focusedIndex]
                ? `search-result-${focusedIndex}`
                : undefined
            }
          />
          {showResults && (
            <div
              id="search-results"
              ref={listRef}
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(400px,70vh)] overflow-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-lg"
            >
              {results.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results for &quot;{query}&quot;
                </div>
              ) : (
                results.slice(0, 12).map((entry, i) => {
                  const href =
                    entry.slug.length === 0 ? "/docs" : `/docs/${entry.slug.join("/")}`;
                  const isActive = i === focusedIndex;
                  return (
                    <Link
                      key={href + i}
                      id={`search-result-${i}`}
                      href={href}
                      role="option"
                      aria-selected={isActive ? "true" : "false"}
                      onMouseEnter={() => setFocusedIndex(i)}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`block px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <span className="font-medium">{entry.title}</span>
                      {entry.excerpt && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {entry.excerpt}
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center justify-end gap-2 md:justify-end">
          {/* Theme toggle with tooltip */}
          {mounted && (
            <Tooltip label="Toggle Mode" shortcut="D">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 dark:hover:bg-accent/50"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            </Tooltip>
          )}

          {/* Share */}
          <Tooltip label={shareCopied ? "Copied!" : "Share"}>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              aria-label="Share"
            >
              <Share className="size-4" />
              Share
            </button>
          </Tooltip>

          {/* Create Project */}
          <Link
            href="/docs/getting-started"
            className="hidden items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex h-[31px] pl-2 [&_svg]:px-2.5"
          >
            Create Project
          </Link>
        </div>
      </div>
    </header>
  );
}
