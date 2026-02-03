"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

export function RulesSkillsWorkersPanel() {
  const { toast } = useToast();
  const { preferences, plan, isLoading, updatePreferences } = useUserSettings();
  const paid = isPaidPlan(plan);
  const [saving, setSaving] = useState(false);

  const includeThirdParty = (preferences.includeThirdPartyConfig as boolean) ?? true;

  const updateIncludeThirdParty = async (value: boolean) => {
    setSaving(true);
    const result = await updatePreferences({ includeThirdPartyConfig: value });
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({ title: "Error", description: result.error ?? "Failed to save", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection
        title="Context"
        titleBadge={!paid ? <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge> : undefined}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm">Include third-party skills, workers, and other configs</Label>
            <p className="text-xs text-muted-foreground">
              Automatically apply agent configs from other tools
            </p>
          </div>
          <Switch
            checked={includeThirdParty}
            onCheckedChange={updateIncludeThirdParty}
            disabled={saving || !paid}
            aria-label="Include third-party configs"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Rules"
        titleBadge={!paid ? <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge> : undefined}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Use Rules to guide agent behavior, like enforcing best practices or coding standards. Rules can be applied always, by file path, or manually.
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>.cursorrules</li>
          <li>soul-doc</li>
          <li>typescript-standards (**/*.ts)</li>
          <li>react-next (**/*.tsx)</li>
          <li>api-routes (app/api/**/*.ts)</li>
        </ul>
      </SettingsSection>

      <SettingsSection
        title="Skills"
        titleBadge={!paid ? <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge> : undefined}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Skills are specialized capabilities that help the agent accomplish specific tasks. Skills will be invoked by the agent when relevant or can be triggered manually with / in chat.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Skills Yet</p>
          <p className="text-xs text-muted-foreground">Skills help the agent accomplish specific tasks</p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Workers"
        titleBadge={!paid ? <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge> : undefined}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Create specialized agents for complex tasks. Workers can be invoked by the agent to handle focused work in parallel.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Workers Yet</p>
          <p className="text-xs text-muted-foreground">Create specialized agents to handle focused tasks</p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Commands"
        titleBadge={!paid ? <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge> : undefined}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Create reusable workflows triggered with / prefix in chat. Use commands to standardize processes and make common tasks more efficient.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Commands Yet</p>
          <p className="text-xs text-muted-foreground">Create commands to build reusable workflows</p>
        </div>
      </SettingsSection>
    </div>
  );
}
