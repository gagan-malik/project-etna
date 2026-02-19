"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";

type TabPrefs = {
  cursorTab?: boolean;
  partialAccepts?: boolean;
  suggestionsWhileCommenting?: boolean;
  whitespaceOnlySuggestions?: boolean;
  imports?: boolean;
  autoImportPython?: boolean;
};

export function TabSettingsPanel() {
  const { toast } = useToast();
  const { preferences, isLoading, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);

  const prefs: TabPrefs = {
    cursorTab: (preferences.cursorTab as boolean) ?? true,
    partialAccepts: (preferences.partialAccepts as boolean) ?? true,
    suggestionsWhileCommenting: (preferences.suggestionsWhileCommenting as boolean) ?? true,
    whitespaceOnlySuggestions: (preferences.whitespaceOnlySuggestions as boolean) ?? false,
    imports: (preferences.imports as boolean) ?? true,
    autoImportPython: (preferences.autoImportPython as boolean) ?? false,
  };

  const update = async (updates: Partial<TabPrefs>) => {
    setSaving(true);
    const result = await updatePreferences(updates);
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({
        title: "Error",
        description: result.error ?? "Failed to save",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const row = (
    label: string,
    description: string,
    key: keyof TabPrefs,
    value: boolean
  ) => (
    <div key={key} className="flex items-center justify-between gap-4 py-3">
      <div>
        <Label className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={value}
        onCheckedChange={(v) => update({ [key]: v })}
        disabled={saving}
      />
    </div>
  );

  return (
    <div className="w-full px-8 pt-16 pb-5 space-y-6">
      <SettingsSection title="Tab" list>
        {row(
          "Cursor Tab",
          "Context-aware, multi-line suggestions around your cursor based on recent edits.",
          "cursorTab",
          prefs.cursorTab ?? true
        )}
        {row(
          "Partial Accepts",
          "Accept the next word of a suggestion via ⌘→",
          "partialAccepts",
          prefs.partialAccepts ?? true
        )}
        {row(
          "Suggestions While Commenting",
          "Allow Tab to trigger while in a comment region.",
          "suggestionsWhileCommenting",
          prefs.suggestionsWhileCommenting ?? true
        )}
        {row(
          "Whitespace-Only Suggestions",
          "Suggest edits like new lines and indentation that modify whitespace only.",
          "whitespaceOnlySuggestions",
          prefs.whitespaceOnlySuggestions ?? false
        )}
        {row(
          "Imports",
          "Automatically import necessary modules for TypeScript.",
          "imports",
          prefs.imports ?? true
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5">
              Auto Import for Python
              <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                BETA
              </span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable auto import for Python. This is a beta feature.
            </p>
          </div>
          <Switch
            checked={prefs.autoImportPython ?? false}
            onCheckedChange={(v) => update({ autoImportPython: v })}
            disabled={saving}
          />
        </div>
      </SettingsSection>
    </div>
  );
}
