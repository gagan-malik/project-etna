"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSidebarVariant } from "./sidebar-context";

interface NavItem {
  slug: string[];
  title: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DocsSidebarProps {
  sections: NavSection[];
}

interface NavSectionComponentProps {
  section: NavSection;
  pathname: string;
  isIconMode: boolean;
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname();
  const { variant } = useSidebarVariant();
  const isIcon = variant === "icon";

  return (
    <aside
      className={`fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto py-6 pr-6 md:sticky md:block ${
        isIcon ? "md:w-14 lg:w-14" : "md:w-[220px] lg:w-[240px]"
      }`}
    >
      <nav className="space-y-6">
        {sections.map((section) => (
          <NavSectionComponent
            key={section.title}
            section={section}
            pathname={pathname}
            isIconMode={isIcon}
          />
        ))}
      </nav>
    </aside>
  );
}

function NavSectionComponent({ section, pathname, isIconMode }: NavSectionComponentProps) {
  const [open, setOpen] = useState(true);

  if (isIconMode) {
    return (
      <div title={section.title} className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium text-foreground/80">
          {section.title.charAt(0)}
        </span>
        {open && (
          <div className="mt-1 flex flex-col gap-0.5">
            {section.items.slice(0, 5).map((item) => {
              const href = item.slug.length === 0 ? "/docs" : `/docs/${item.slug.join("/")}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  title={item.title}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.title.charAt(0)}
                </Link>
              );
            })}
            {section.items.length > 5 && (
              <span className="px-1 text-[10px] text-muted-foreground">+{section.items.length - 5}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium text-foreground hover:text-foreground"
      >
        {section.title}
        <ChevronRight
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 pl-4">
          {section.items.map((item) => {
            const href = item.slug.length === 0 ? "/docs" : `/docs/${item.slug.join("/")}`;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
