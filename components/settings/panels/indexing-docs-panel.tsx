"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";

export function IndexingDocsPanel() {
  const { toast } = useToast();
  const { preferences, isLoading, updatePreferences } = useUserSettings();
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
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Codebase Indexing">
        <p className="text-xs text-muted-foreground mb-3">
          Embed codebase for improved contextual understanding. Embeddings and metadata are stored in the cloud; all code is stored locally.
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
        <div className="flex gap-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
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
        <p className="text-xs text-muted-foreground mb-2">
          Files to exclude from indexing in addition to .gitignore
        </p>
        <div className="flex gap-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>

      <SettingsSection title="Docs">
        <p className="text-xs text-muted-foreground mb-2">
          Crawl and index custom resources and developer docs.
        </p>
        <p className="text-sm text-muted-foreground mb-3">No Docs Added</p>
        <p className="text-xs text-muted-foreground mb-3">
          Add documentation to use as context. You can also use @Add in Chat or while editing to add a doc.
        </p>
        <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
      </SettingsSection>
    </div>
  );
}
