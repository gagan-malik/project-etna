"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "../settings-section";

export function NetworkPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [httpMode, setHttpMode] = useState<"http1" | "http2">("http2");

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { preferences: {} })
      .then((d) => {
        const mode = d.preferences?.httpCompatibilityMode;
        setHttpMode(mode === "http1" ? "http1" : "http2");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateMode = async (value: "http1" | "http2") => {
    setHttpMode(value);
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ httpCompatibilityMode: value }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const runDiagnostic = () => {
    toast({ title: "Running diagnostic…", description: "Check network connectivity to backend AI services." });
  };

  if (loading) {
    return <div className="px-6 py-8"><p className="text-sm text-muted-foreground">Loading…</p></div>;
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="HTTP Compatibility Mode">
        <p className="text-xs text-muted-foreground mb-3">
          HTTP/2 is recommended for low-latency streaming. In some corporate proxy and VPN environments, the compatibility mode may need to be lowered.
        </p>
        <Select value={httpMode} onValueChange={(v: "http1" | "http2") => updateMode(v)} disabled={saving}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="http2">HTTP/2</SelectItem>
            <SelectItem value="http1">HTTP/1.1</SelectItem>
          </SelectContent>
        </Select>
      </SettingsSection>

      <SettingsSection title="Network Diagnostics">
        <p className="text-xs text-muted-foreground mb-3">
          Check network connectivity to backend AI services.
        </p>
        <Button variant="outline" size="xs" onClick={runDiagnostic}>
          Run Diagnostic
        </Button>
      </SettingsSection>
    </div>
  );
}
