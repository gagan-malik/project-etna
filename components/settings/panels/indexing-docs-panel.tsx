"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { SettingsSection } from "../settings-section";

export function IndexingDocsPanel() {
  const [indexNewFolders, setIndexNewFolders] = useState(true);
  const [codebaseProgress] = useState(100);
  const [fileCount] = useState(0);

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
          <Button variant="outline" size="xs">Sync</Button>
          <Button variant="outline" size="xs">Delete Index</Button>
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
            onCheckedChange={setIndexNewFolders}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Ignore Files in .cursorignore">
        <p className="text-xs text-muted-foreground mb-2">
          Files to exclude from indexing in addition to .gitignore
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="xs">View included files</Button>
          <Button variant="outline" size="xs">Edit</Button>
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
        <Button size="xs">+ Add Doc</Button>
      </SettingsSection>
    </div>
  );
}
