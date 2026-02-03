"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "../settings-section";

type AgentPrefs = {
  agentDefaultMode?: string;
  agentDefaultLocation?: string;
  agentAutoClearChat?: boolean;
  agentReviewOnCommit?: boolean;
  agentWebSearchTool?: boolean;
  agentAutoAcceptOnCommit?: boolean;
  agentAutoRunMode?: string;
  agentBrowserProtection?: boolean;
  agentMcpToolsProtection?: boolean;
  agentFileDeletionProtection?: boolean;
  agentToolbarOnSelection?: boolean;
  agentCommitAttribution?: boolean;
};

export function AgentsSettingsPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<AgentPrefs>({});

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { preferences: {} })
      .then((d) => { setPrefs((d.preferences ?? {}) as AgentPrefs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = async (updates: AgentPrefs) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      setPrefs((p) => ({ ...p, ...(data.preferences as AgentPrefs) }));
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const row = (
    label: string,
    desc: string,
    key: string,
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

  if (loading) {
    return <div className="px-6 py-8"><p className="text-sm text-muted-foreground">Loading…</p></div>;
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="General Agent Settings">
        <div className="space-y-1">
          {row("Default Mode", "Mode for new agents", "agentDefaultMode", "select", prefs.agentDefaultMode ?? "agent", [
            { value: "agent", label: "Agent" },
            { value: "chat", label: "Chat" },
          ])}
          {row("Default Location", "Where to open new agents", "agentDefaultLocation", "select", prefs.agentDefaultLocation ?? "pane", [
            { value: "pane", label: "Pane" },
            { value: "tab", label: "Tab" },
          ])}
          {row("Auto-Clear Chat", "After inactivity, open Agent Pane to a new conversation", "agentAutoClearChat", "switch", prefs.agentAutoClearChat ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Agent Review">
        <div className="space-y-1">
          {row("Start Agent Review on Commit", "Automatically review your changes for issues after each commit", "agentReviewOnCommit", "switch", prefs.agentReviewOnCommit ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Context">
        <div className="space-y-1">
          {row("Web Search Tool", "Allow Agent to search the web for relevant information", "agentWebSearchTool", "switch", prefs.agentWebSearchTool ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Applying Changes">
        <div className="space-y-1">
          {row("Auto-Accept on Commit", "Automatically accept all changes when files are committed", "agentAutoAcceptOnCommit", "switch", prefs.agentAutoAcceptOnCommit ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Auto-Run">
        <div className="space-y-1">
          {row("Auto-Run Mode", "Choose how Agent runs tools (command execution, MCP, file writes)", "agentAutoRunMode", "select", prefs.agentAutoRunMode ?? "run-everything", [
            { value: "run-everything", label: "Run Everything (Unsandboxed)" },
            { value: "approve", label: "Approve before running" },
            { value: "off", label: "Off" },
          ])}
        </div>
      </SettingsSection>

      <SettingsSection title="Protection Settings">
        <div className="space-y-1">
          {row("Browser Protection", "Prevent Agent from automatically running Browser tools", "agentBrowserProtection", "switch", prefs.agentBrowserProtection ?? true)}
          {row("MCP Tools Protection", "Prevent Agent from automatically running MCP tools", "agentMcpToolsProtection", "switch", prefs.agentMcpToolsProtection ?? false)}
          {row("File-Deletion Protection", "Prevent Agent from deleting files automatically", "agentFileDeletionProtection", "switch", prefs.agentFileDeletionProtection ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Inline Editing & Terminal">
        <div className="space-y-1">
          {row("Toolbar on Selection", "Show Add to Chat & Quick Edit buttons when selecting code", "agentToolbarOnSelection", "switch", prefs.agentToolbarOnSelection ?? true)}
        </div>
      </SettingsSection>

      <SettingsSection title="Attribution">
        <div className="space-y-1">
          {row("Commit Attribution", "Mark Agent commits as co-authored", "agentCommitAttribution", "switch", prefs.agentCommitAttribution ?? true)}
        </div>
      </SettingsSection>
    </div>
  );
}
