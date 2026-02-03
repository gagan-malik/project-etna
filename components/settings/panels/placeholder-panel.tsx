"use client";

import { SettingsSection } from "../settings-section";

export function PlaceholderPanel({ sectionLabel }: { sectionLabel: string }) {
  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection>
        <p className="text-sm text-muted-foreground">
          {sectionLabel} settings — coming soon. Check back later.
        </p>
      </SettingsSection>
    </div>
  );
}
