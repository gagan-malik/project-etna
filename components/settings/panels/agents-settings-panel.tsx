"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";

/** Silicon-focused subset: where agent opens, context (hardware docs), and safety for RTL/repos. */
type AgentPrefs = {
  agentDefaultLocation?: string;
  agentWebSearchTool?: boolean;
  agentMcpToolsProtection?: boolean;
  agentFileDeletionProtection?: boolean;
};

export function AgentsSettingsPanel() {
  const { toast } = useToast();
  const { preferences, isLoading, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);

  const prefs: AgentPrefs = {
    agentDefaultLocation: (preferences.agentDefaultLocation as string) ?? "pane",
    agentWebSearchTool: (preferences.agentWebSearchTool as boolean) ?? true,
    agentMcpToolsProtection: (preferences.agentMcpToolsProtection as boolean) ?? false,
    agentFileDeletionProtection: (preferences.agentFileDeletionProtection as boolean) ?? true,
  };

  const update = async (updates: AgentPrefs) => {
    setSaving(true);
    const result = await updatePreferences(updates);
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({ title: "Error", description: result.error ?? "Failed to save", variant: "destructive" });
    }
  };

  const row = (
    label: string,
    desc: string,
    key: keyof AgentPrefs,
    type: "switch" | "select",
    value: boolean | string,
    options?: { value: string; label: string }[]
  ) => (
    <div key={key} className="flex items-center justify-between gap-4 py-3">
      <div>
        <Label className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {type === "switch" && (
        <Switch
          checked={!!value}
          onCheckedChange={(v) => update({ [key]: v })}
          disabled={saving}
        />
      )}
      {type === "select" && options && (
        <Select
          value={String(value ?? "")}
          onValueChange={(v) => update({ [key]: v })}
          disabled={saving}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="px-6 py-8"><p className="text-sm text-muted-foreground">Loading…</p></div>;
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Agent layout">
        <div className="space-y-1">
          {row(
            "Default location",
            "Where to open new agent chats (pane or tab)",
            "agentDefaultLocation",
            "select",
            prefs.agentDefaultLocation ?? "pane",
            [
              { value: "pane", label: "Pane" },
              { value: "tab", label: "Tab" },
            ]
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Context">
        <div className="space-y-1">
          {row(
            "Web search",
            "Allow agent to search for datasheets, standards, and hardware docs",
            "agentWebSearchTool",
            "switch",
            prefs.agentWebSearchTool ?? true
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Protection (RTL & repos)">
        <div className="space-y-1">
          {row(
            "File-deletion protection",
            "Prevent agent from deleting files automatically (recommended for design repos)",
            "agentFileDeletionProtection",
            "switch",
            prefs.agentFileDeletionProtection ?? true
          )}
          {row(
            "MCP tools protection",
            "Require approval before running MCP tools",
            "agentMcpToolsProtection",
            "switch",
            prefs.agentMcpToolsProtection ?? false
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
