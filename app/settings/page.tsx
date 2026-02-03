"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  SettingsLayout,
  SettingsPageTitle,
  DEFAULT_SECTION,
  getSectionById,
  GeneralSettingsPanel,
  RulesPanel,
  SkillsPanel,
  WorkersPanel,
  HooksPanel,
  TabSettingsPanel,
  ModelsSettingsPanel,
  AgentsSettingsPanel,
  CloudAgentsPanel,
  ToolsMcpPanel,
  IndexingDocsPanel,
  NetworkPanel,
  BetaPanel,
  PlaceholderPanel,
} from "@/components/settings";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);

  useEffect(() => {
    const id = sectionParam ?? DEFAULT_SECTION;
    const section = getSectionById(id);
    if (section && !section.external) {
      setActiveSection(id);
    }
  }, [sectionParam]);

  const handleSetSection = useCallback(
    (id: string) => {
      setActiveSection(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", id);
      router.replace(`/settings?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case "general":
        return <GeneralSettingsPanel />;
      case "rules":
        return <RulesPanel />;
      case "skills":
        return <SkillsPanel />;
      case "workers":
        return <WorkersPanel />;
      case "hooks":
        return <HooksPanel />;
      case "tab":
        return <TabSettingsPanel />;
      case "models":
        return <ModelsSettingsPanel />;
      case "agents":
        return <AgentsSettingsPanel />;
      case "cloud-agents":
        return <CloudAgentsPanel />;
      case "tools-mcp":
        return <ToolsMcpPanel />;
      case "indexing-docs":
        return <IndexingDocsPanel />;
      case "network":
        return <NetworkPanel />;
      case "beta":
        return <BetaPanel />;
      default: {
        const section = getSectionById(activeSection);
        return (
          <PlaceholderPanel
            sectionLabel={section?.label ?? activeSection}
          />
        );
      }
    }
  }, [activeSection]);

  return (
    <SettingsLayout
      activeSection={activeSection}
      setActiveSection={handleSetSection}
      basePath="/settings"
    >
      <SettingsPageTitle sectionId={activeSection} />
      {renderContent()}
    </SettingsLayout>
  );
}

function SettingsPageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading settings…</p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Suspense fallback={<SettingsPageFallback />}>
        <SettingsPageContent />
      </Suspense>
    </div>
  );
}
