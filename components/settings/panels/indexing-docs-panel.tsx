"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

export function IndexingDocsPanel() {
  const { toast } = useToast();
  const { preferences, plan, isLoading, updatePreferences } = useUserSettings();
  const paid = isPaidPlan(plan);
  const [saving, setSaving] = useState(false);
  const [codebaseProgress] = useState(100);
  const [fileCount] = useState(0);

  const indexNewFolders = (preferences.indexNewFolders as boolean) ?? true;

  const update = async (updates: Record<string, unknown>) => {
    setSaving(true);
    const result = await updatePreferences(updates);
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
      <SettingsSection title="Codebase Indexing">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Codebase Indexing</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Codebase Indexing" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Embed codebase for improved contextual understanding (RTL, design files). Embeddings and metadata are stored in the cloud; all code is stored locally.
        </p>
        <p className="text-xs text-muted-foreground mb-2" role="status">
          Coming soon. Progress and file count will appear here when indexing is available.
        </p>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{codebaseProgress}%</span>
          </div>
          <Progress value={codebaseProgress} className="h-2" />
        </div>
        {fileCount > 0 && (
          <p className="text-xs text-muted-foreground mb-3">{fileCount} files</p>
        )}
      </SettingsSection>

      <SettingsSection title="Index New Folders">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm">Index New Folders</Label>
            <p className="text-xs text-muted-foreground">
              Automatically index any new folders with fewer than 50,000 files
            </p>
          </div>
          <Switch
            checked={indexNewFolders}
            onCheckedChange={(v) => update({ indexNewFolders: v })}
            disabled={saving}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Ignore Files in .cursorignore">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Ignore Files in .cursorignore</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Ignore files" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Files to exclude from indexing in addition to .gitignore
        </p>
      </SettingsSection>

      <SettingsSection title="Docs">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Docs</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Docs" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Crawl and index custom resources and developer docs.
        </p>
        <p className="text-sm text-muted-foreground mb-2">No docs added</p>
        <p className="text-xs text-muted-foreground mb-3">
          Coming soon. Add documentation (e.g. spec sheets, protocol docs) to use as context for RTL and hardware questions.
        </p>
      </SettingsSection>
    </div>
  );
}
