import { DocsHeader } from "@/components/docs/header";
import { DocsLayoutGrid } from "@/components/docs/docs-layout-grid";
import { SidebarProvider } from "@/components/docs/sidebar-context";
import { getDocNavSections, getSearchIndex } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocNavSections();
  const searchIndex = getSearchIndex();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <DocsHeader searchIndex={searchIndex} />
        <DocsLayoutGrid sections={sections}>{children}</DocsLayoutGrid>
      </div>
    </SidebarProvider>
  );
}
