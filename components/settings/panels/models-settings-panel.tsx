"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { useSession } from "next-auth/react";
import { SettingsSection } from "../settings-section";
import { ChevronDown, RefreshCw } from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
}

const DEFAULT_MODELS: ModelInfo[] = [
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gemini-pro", name: "Gemini Pro" },
  { id: "deepseek-chat", name: "DeepSeek Chat" },
  { id: "deepseek-coder", name: "DeepSeek Coder" },
  { id: "llama-3-70b", name: "Llama 3 70B" },
  { id: "llama-3-8b", name: "Llama 3 8B" },
];

export function ModelsSettingsPanel() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { preferences, isLoading: prefsLoading, updatePreferences } = useUserSettings();
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [apiKeysOpen, setApiKeysOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      setModels(DEFAULT_MODELS);
      setModelsLoading(false);
      return;
    }
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/ai/models", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const list = (data.models ?? []).map((m: { id: string; name: string }) => ({ id: m.id, name: m.name }));
          setModels(list.length > 0 ? list : DEFAULT_MODELS);
        } else {
          setModels(DEFAULT_MODELS);
        }
      } catch (e) {
        setModels(DEFAULT_MODELS);
      } finally {
        setModelsLoading(false);
      }
    };
    fetchModels();
  }, [session?.user]);

  const enabledIds = useMemo(() => {
    const ids = (preferences.enabledModelIds as string[] | undefined) ?? [];
    if (ids.length > 0) return new Set(ids);
    return new Set(models.map((m) => m.id));
  }, [preferences.enabledModelIds, models]);

  const filteredModels = models.filter(
    (m) =>
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModel = async (id: string, enabled: boolean) => {
    const next = new Set(enabledIds);
    if (enabled) next.add(id);
    else next.delete(id);
    setSaving(true);
    const result = await updatePreferences({ enabledModelIds: Array.from(next) });
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

  const loading = prefsLoading || modelsLoading;
  if (loading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading models…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Models">
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Add or search model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            aria-label="Search models"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={() => window.location.reload()}
            aria-label="Refresh models"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {filteredModels.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {search.trim() ? "No models match your search." : "No models available."}
            </p>
          ) : (
            filteredModels.map((model) => {
              const enabled = enabledIds.has(model.id) || enabledIds.size === 0;
              return (
                <div
                  key={model.id}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <span className="text-sm truncate">{model.name}</span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(v) => toggleModel(model.id, v)}
                    disabled={saving}
                  />
                </div>
              );
            })
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="API Keys">
        <Collapsible open={apiKeysOpen} onOpenChange={setApiKeysOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="xs" className="w-full justify-between px-0">
              <span className="text-sm font-medium">API Keys</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Add your own API keys to use models at cost. Keys are not stored in
              settings; use your provider dashboard or environment variables.
            </p>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">OpenAI API Key</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Use OpenAI models at cost. Set OPENAI_API_KEY in environment or
                  add key in your account.
                </p>
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API Key"
                  className="max-w-md"
                  disabled
                  readOnly
                />
              </div>
              <div>
                <Label className="text-sm">Anthropic API Key</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Use Claude models at cost. Set ANTHROPIC_API_KEY or add in
                  account.
                </p>
                <Input
                  type="password"
                  placeholder="Enter your Anthropic API Key"
                  className="max-w-md"
                  disabled
                  readOnly
                />
              </div>
              <div>
                <Label className="text-sm">Google AI Studio Key</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Use Google models at cost. Set GEMINI_API_KEY or add in account.
                </p>
                <Input
                  type="password"
                  placeholder="Enter your Google AI Studio API Key"
                  className="max-w-md"
                  disabled
                  readOnly
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SettingsSection>
    </div>
  );
}
