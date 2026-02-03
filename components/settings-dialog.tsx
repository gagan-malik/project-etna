"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[976px] h-[90vh] p-0 flex flex-col overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 flex-row">
          <SettingsLayout
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            basePath="/settings"
          >
            <SettingsPageTitle sectionId={activeSection} />
            {renderContent()}
          </SettingsLayout>
        </div>
      </DialogContent>
    </Dialog>
  );
}
