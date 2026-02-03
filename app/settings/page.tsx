"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSettingsModal } from "@/components/settings-modal-context";

/**
 * /settings redirects to chat and opens the settings modal.
 * There is no full-page settings; everything uses the modal.
 */
export default function SettingsRedirectPage() {
  const router = useRouter();
  const { openSettings } = useSettingsModal();

  useEffect(() => {
    openSettings();
    router.replace("/chat");
  }, [router, openSettings]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Opening settings…</p>
    </div>
  );
}
