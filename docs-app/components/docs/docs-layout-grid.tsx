"use client";

import { useSidebarVariant } from "./sidebar-context";
import { DocsSidebar } from "./sidebar";
import type { NavSection } from "@/lib/docs";

export function DocsLayoutGrid({
  sections,
  children,
}: {
  sections: NavSection[];
  children: React.ReactNode;
}) {
  const { variant } = useSidebarVariant();
  const isIcon = variant === "icon";

  return (
    <div
      className={`container flex-1 items-start md:grid md:gap-6 lg:gap-10 ${
        isIcon
          ? "md:grid-cols-[3.5rem_minmax(0,1fr)] lg:grid-cols-[3.5rem_minmax(0,1fr)]"
          : "md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]"
      }`}
    >
      <DocsSidebar sections={sections} />
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px] xl:gap-10">
        {children}
      </main>
    </div>
  );
}
