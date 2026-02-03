"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";

export function RulesSkillsWorkersPanel() {
  const { toast } = useToast();
  const { preferences, isLoading, updatePreferences } = useUserSettings();
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
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Context">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
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
            disabled={saving}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Rules">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
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

      <SettingsSection title="Skills">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Skills are specialized capabilities that help the agent accomplish specific tasks. Skills will be invoked by the agent when relevant or can be triggered manually with / in chat.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Skills Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Skills help the agent accomplish specific tasks</p>
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>

      <SettingsSection title="Workers">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create specialized agents for complex tasks. Workers can be invoked by the agent to handle focused work in parallel.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Workers Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Create specialized agents to handle focused tasks</p>
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>

      <SettingsSection title="Commands">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create reusable workflows triggered with / prefix in chat. Use commands to standardize processes and make common tasks more efficient.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Commands Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Create commands to build reusable workflows</p>
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>
    </div>
  );
}
