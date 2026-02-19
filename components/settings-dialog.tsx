"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  SettingsLayout,
  SettingsPageTitle,
  getSectionById,
  GeneralSettingsPanel,
  AccountSettingsPanel,
  RulesPanel,
  SkillsPanel,
  WorkersPanel,
  ModelsSettingsPanel,
  AgentsSettingsPanel,
  UsagePanel,
  BillingInvoicesPanel,
  ToolsMcpPanel,
  IndexingDocsPanel,
  BetaPanel,
  ContactUsPanel,
  PlaceholderPanel,
} from "@/components/settings";
import { useSettingsModal } from "@/components/settings-modal-context";
import type { SessionStatus } from "@/components/settings/settings-layout";

export interface SettingsSession {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; plan?: string };
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass session from parent (e.g. AppSidebar) so portaled dialog content shows correct auth state */
  session?: SettingsSession | null;
  status?: SessionStatus;
}

export function SettingsDialog({ open, onOpenChange, session, status }: SettingsDialogProps) {
  const { activeSection, setActiveSection } = useSettingsModal();

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case "general":
        return <GeneralSettingsPanel />;
      case "account":
        return <AccountSettingsPanel />;
      case "rules":
        return <RulesPanel />;
      case "skills":
        return <SkillsPanel />;
      case "workers":
        return <WorkersPanel />;
      case "models":
        return <ModelsSettingsPanel />;
      case "agents":
        return <AgentsSettingsPanel />;
      case "usage":
        return <UsagePanel />;
      case "billing-invoices":
        return <BillingInvoicesPanel />;
      case "tools-mcp":
        return <ToolsMcpPanel />;
      case "indexing-docs":
        return <IndexingDocsPanel />;
      case "beta":
        return <BetaPanel />;
      case "contact":
        return <ContactUsPanel />;
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
            sessionOverride={session}
            statusOverride={status}
          >
            <SettingsPageTitle sectionId={activeSection} />
            {renderContent()}
          </SettingsLayout>
        </div>
      </DialogContent>
    </Dialog>
  );
}
