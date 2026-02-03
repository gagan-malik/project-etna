"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SettingsSection } from "../settings-section";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { isPaidPlan } from "../settings-config";
import { Gem, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModelMetadata } from "@/lib/ai/model-ranking";

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

const PROVIDER_BY_ID_PREFIX: { prefix: string; label: string }[] = [
  { prefix: "gpt-", label: "OpenAI" },
  { prefix: "gemini-", label: "Google" },
  { prefix: "deepseek-", label: "DeepSeek" },
  { prefix: "llama-", label: "Meta" },
  { prefix: "claude-", label: "Anthropic" },
];

function getProvider(modelId: string): string {
  const id = modelId.toLowerCase();
  for (const { prefix, label } of PROVIDER_BY_ID_PREFIX) {
    if (id.startsWith(prefix)) return label;
  }
  return "Other";
}

export function ModelsSettingsPanel() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { preferences, plan, isLoading: prefsLoading, updatePreferences } = useUserSettings();
  const hasPremiumAccess = isPaidPlan(plan);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openAIKeyOpen, setOpenAIKeyOpen] = useState(false);
  const [anthropicKeyOpen, setAnthropicKeyOpen] = useState(false);
  const [googleKeyOpen, setGoogleKeyOpen] = useState(false);
  const [azureOpenAIOpen, setAzureOpenAIOpen] = useState(false);
  const [awsBedrockOpen, setAwsBedrockOpen] = useState(false);

  const [byokValues, setByokValues] = useState({
    openAI: "",
    anthropic: "",
    google: "",
    azureBaseUrl: "",
    azureDeployment: "",
    azureApiKey: "",
    awsAccessKeyId: "",
    awsSecretKey: "",
    awsRegion: "",
    awsTestModel: "",
  });
  const [byokErrors, setByokErrors] = useState<Record<string, string>>({});
  const [byokApplying, setByokApplying] = useState<string | null>(null);

  const validateOpenAI = (): string | null => {
    if (!openAIKeyOpen) return null;
    const v = byokValues.openAI.trim();
    if (!v) return "API key is required when enabled.";
    if (!v.startsWith("sk-")) return "OpenAI API keys usually start with sk-.";
    return null;
  };
  const validateAnthropic = (): string | null => {
    if (!anthropicKeyOpen) return null;
    if (!byokValues.anthropic.trim()) return "API key is required when enabled.";
    return null;
  };
  const validateGoogle = (): string | null => {
    if (!googleKeyOpen) return null;
    if (!byokValues.google.trim()) return "API key is required when enabled.";
    return null;
  };
  const validateAzure = (): string | null => {
    if (!azureOpenAIOpen) return null;
    if (!byokValues.azureBaseUrl.trim()) return "Base URL is required.";
    if (!byokValues.azureDeployment.trim()) return "Deployment name is required.";
    if (!byokValues.azureApiKey.trim()) return "API key is required.";
    return null;
  };
  const validateAws = (): string | null => {
    if (!awsBedrockOpen) return null;
    if (!byokValues.awsAccessKeyId.trim()) return "Access Key ID is required.";
    if (!byokValues.awsSecretKey.trim()) return "Secret Access Key is required.";
    if (!byokValues.awsRegion.trim()) return "Region is required.";
    return null;
  };

  const applyOpenAI = () => {
    setByokApplying("openai");
    setByokErrors((e) => ({ ...e, openai: "" }));
    const err = validateOpenAI();
    if (err) {
      setByokErrors((e) => ({ ...e, openai: err }));
      setByokApplying(null);
      return;
    }
    setByokApplying(null);
    toast({ title: "OpenAI key applied", description: "Your key has been saved." });
  };
  const applyAnthropic = () => {
    setByokApplying("anthropic");
    setByokErrors((e) => ({ ...e, anthropic: "" }));
    const err = validateAnthropic();
    if (err) {
      setByokErrors((e) => ({ ...e, anthropic: err }));
      setByokApplying(null);
      return;
    }
    setByokApplying(null);
    toast({ title: "Anthropic key applied", description: "Your key has been saved." });
  };
  const applyGoogle = () => {
    setByokApplying("google");
    setByokErrors((e) => ({ ...e, google: "" }));
    const err = validateGoogle();
    if (err) {
      setByokErrors((e) => ({ ...e, google: err }));
      setByokApplying(null);
      return;
    }
    setByokApplying(null);
    toast({ title: "Google API key applied", description: "Your key has been saved." });
  };
  const applyAzure = () => {
    setByokApplying("azure");
    setByokErrors((e) => ({ ...e, azure: "" }));
    const err = validateAzure();
    if (err) {
      setByokErrors((e) => ({ ...e, azure: err }));
      setByokApplying(null);
      return;
    }
    setByokApplying(null);
    toast({ title: "Azure OpenAI settings applied", description: "Your settings have been saved." });
  };
  const applyAws = () => {
    setByokApplying("aws");
    setByokErrors((e) => ({ ...e, aws: "" }));
    const err = validateAws();
    if (err) {
      setByokErrors((e) => ({ ...e, aws: err }));
      setByokApplying(null);
      return;
    }
    setByokApplying(null);
    toast({ title: "AWS Bedrock settings applied", description: "Your settings have been saved." });
  };

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

  const modelsByProvider = useMemo(() => {
    const map = new Map<string, ModelInfo[]>();
    for (const m of models) {
      const provider = getProvider(m.id);
      const list = map.get(provider) ?? [];
      list.push(m);
      map.set(provider, list);
    }
    const order = ["OpenAI", "Google", "Anthropic", "DeepSeek", "Meta", "Other"];
    return order.filter((p) => map.has(p)).map((provider) => {
      const list = map.get(provider)!;
      const sorted = [...list].sort((a, b) => {
        const aPaid = getModelMetadata(a.id)?.capabilities.reasoning ?? false;
        const bPaid = getModelMetadata(b.id)?.capabilities.reasoning ?? false;
        return Number(aPaid) - Number(bPaid);
      });
      return { provider, list: sorted };
    });
  }, [models]);

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
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Models">
        {/* Auto and MAX Mode — match Select Model dialog */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between gap-3 py-1.5">
            <div className="flex-1 min-w-0">
              <Label htmlFor="models-auto-mode" className="text-sm font-medium cursor-pointer">
                Auto
              </Label>
              <p className="text-xs text-muted-foreground truncate">
                Automatically selects the best model based on query type.
              </p>
            </div>
            <Switch
              id="models-auto-mode"
              checked={(preferences.autoMode as boolean | undefined) ?? false}
              onCheckedChange={(v) => updatePreferences({ autoMode: v })}
              disabled={saving}
              className="shrink-0"
            />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between gap-3 py-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <Label htmlFor="models-max-mode" className="text-sm font-medium cursor-pointer">
                  MAX Mode
                </Label>
                {!hasPremiumAccess && (
                  <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Uses the highest quality/most capable model available.
              </p>
            </div>
            <Switch
              id="models-max-mode"
              checked={(preferences.maxMode as boolean | undefined) ?? false}
              onCheckedChange={(v) => updatePreferences({ maxMode: v })}
              disabled={saving || (!hasPremiumAccess && !(preferences.maxMode as boolean))}
              className="shrink-0"
            />
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {modelsByProvider.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No models available.</p>
          ) : (
            modelsByProvider.map(({ provider, list }, index) => (
              <div key={provider}>
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground tracking-wide">
                    {provider}
                  </h3>
                  <div className="space-y-1">
                    {list.map((model) => {
                      const enabled = enabledIds.has(model.id) || enabledIds.size === 0;
                      const hasReasoning = getModelMetadata(model.id)?.capabilities.reasoning ?? false;
                      return (
                        <div
                          key={model.id}
                          className="flex items-center justify-between gap-4 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-sm truncate min-w-0">{model.name}</span>
                            {hasReasoning && (
                              <>
                                <Badge variant="secondary" className="shrink-0 gap-1 text-xs font-normal" title="Offers reasoning">
                                  <BrainCircuit className="h-3 w-3" aria-hidden />
                                  Reasoning
                                </Badge>
                                <Badge variant="upgrade" className="shrink-0 gap-1"><Gem className="h-3 w-3" aria-hidden />Paid</Badge>
                              </>
                            )}
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(v) => toggleModel(model.id, v)}
                            disabled={saving || (hasReasoning && !hasPremiumAccess)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {index < modelsByProvider.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">Request more models</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Don&apos;t see the model you need? Request it from the team.
            </p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href="https://github.com/gaganmalik/project-etna/issues/new?title=Request%3A%20New%20model&body=**Model request**%0A%0ADescribe%20the%20model%20you%20would%20like%20to%20see%20added%20and%20the%20provider%20(e.g.%20OpenAI%2C%20Anthropic)."
              target="_blank"
              rel="noopener noreferrer"
            >
              Request
            </Link>
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="API Keys">
        <div className="flex items-center justify-between gap-3 py-1.5 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <Label htmlFor="api-keys-byok" className="text-sm font-medium cursor-pointer">
                Bring your own keys
              </Label>
              {!hasPremiumAccess && (
                <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Use models at cost with your own keys.
            </p>
          </div>
          <Switch
            id="api-keys-byok"
            checked={(preferences.bringYourOwnKeys as boolean | undefined) ?? false}
            onCheckedChange={(v) => updatePreferences({ bringYourOwnKeys: v })}
            disabled={saving || (!hasPremiumAccess && !(preferences.bringYourOwnKeys as boolean | undefined))}
            className="shrink-0"
          />
        </div>
        {(preferences.bringYourOwnKeys as boolean | undefined) === true && (
        <div className="space-y-6">
          {/* OpenAI API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium">OpenAI API Key</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can put in your{" "}
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal text-primary" asChild>
                    <Link href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                      OpenAI key
                    </Link>
                  </Button>{" "}
                  to use OpenAI models at cost.
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={openAIKeyOpen}
                onCheckedChange={setOpenAIKeyOpen}
                disabled={saving}
              />
            </div>
            {openAIKeyOpen && (
              <div className="mt-2 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your OpenAI API Key"
                    className={cn("max-w-md flex-1 min-w-[200px]", byokErrors.openai && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.openAI}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, openAI: e.target.value }));
                      if (byokErrors.openai) setByokErrors((e) => ({ ...e, openai: "" }));
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyOpenAI}
                    disabled={byokApplying === "openai" || validateOpenAI() !== null}
                  >
                    {byokApplying === "openai" ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {byokErrors.openai && (
                  <p className="text-xs text-destructive">{byokErrors.openai}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Anthropic API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium">Anthropic API Key</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can put in your{" "}
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal text-primary" asChild>
                    <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
                      Anthropic key
                    </Link>
                  </Button>{" "}
                  to use Claude at cost. When enabled, this key will be used for all models beginning with &quot;claude-&quot;.
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={anthropicKeyOpen}
                onCheckedChange={setAnthropicKeyOpen}
                disabled={saving}
              />
            </div>
            {anthropicKeyOpen && (
              <div className="mt-2 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your Anthropic API Key"
                    className={cn("max-w-md flex-1 min-w-[200px]", byokErrors.anthropic && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.anthropic}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, anthropic: e.target.value }));
                      if (byokErrors.anthropic) setByokErrors((e) => ({ ...e, anthropic: "" }));
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyAnthropic}
                    disabled={byokApplying === "anthropic" || validateAnthropic() !== null}
                  >
                    {byokApplying === "anthropic" ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {byokErrors.anthropic && (
                  <p className="text-xs text-destructive">{byokErrors.anthropic}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Google API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium">Google API Key</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can put in your{" "}
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal text-primary" asChild>
                    <Link href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                      Google AI Studio key
                    </Link>
                  </Button>{" "}
                  to use Google models at-cost.
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={googleKeyOpen}
                onCheckedChange={setGoogleKeyOpen}
                disabled={saving}
              />
            </div>
            {googleKeyOpen && (
              <div className="mt-2 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your Google AI Studio API Key"
                    className={cn("max-w-md flex-1 min-w-[200px]", byokErrors.google && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.google}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, google: e.target.value }));
                      if (byokErrors.google) setByokErrors((e) => ({ ...e, google: "" }));
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyGoogle}
                    disabled={byokApplying === "google" || validateGoogle() !== null}
                  >
                    {byokApplying === "google" ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {byokErrors.google && (
                  <p className="text-xs text-destructive">{byokErrors.google}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Azure OpenAI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium">Azure OpenAI</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure{" "}
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal text-primary" asChild>
                    <Link href="https://learn.microsoft.com/en-us/azure/ai-services/openai/" target="_blank" rel="noopener noreferrer">
                      Azure OpenAI
                    </Link>
                  </Button>{" "}
                  to use OpenAI models through your Azure account.
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={azureOpenAIOpen}
                onCheckedChange={setAzureOpenAIOpen}
                disabled={saving}
              />
            </div>
            {azureOpenAIOpen && (
              <div className="space-y-2 mt-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Base URL</Label>
                  <Input
                    type="url"
                    placeholder="e.g. my-resource.openai.azure.com"
                    className={cn("max-w-md mt-1", byokErrors.azure && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.azureBaseUrl}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, azureBaseUrl: e.target.value }));
                      if (byokErrors.azure) setByokErrors((e) => ({ ...e, azure: "" }));
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Deployment Name</Label>
                  <Input
                    placeholder="e.g. gpt-35-turbo"
                    className={cn("max-w-md mt-1", byokErrors.azure && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.azureDeployment}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, azureDeployment: e.target.value }));
                      if (byokErrors.azure) setByokErrors((e) => ({ ...e, azure: "" }));
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs text-muted-foreground">API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your Azure OpenAI API Key"
                      className={cn("max-w-md mt-1", byokErrors.azure && "border-destructive")}
                      autoComplete="off"
                      value={byokValues.azureApiKey}
                      onChange={(e) => {
                        setByokValues((v) => ({ ...v, azureApiKey: e.target.value }));
                        if (byokErrors.azure) setByokErrors((e) => ({ ...e, azure: "" }));
                      }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyAzure}
                    disabled={byokApplying === "azure" || validateAzure() !== null}
                    className="shrink-0"
                  >
                    {byokApplying === "azure" ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {byokErrors.azure && (
                  <p className="text-xs text-destructive">{byokErrors.azure}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* AWS Bedrock */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium">AWS Bedrock</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure{" "}
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal text-primary" asChild>
                    <Link href="https://docs.aws.amazon.com/bedrock/" target="_blank" rel="noopener noreferrer">
                      AWS Bedrock
                    </Link>
                  </Button>{" "}
                  to use Anthropic Claude models through your AWS account. Cursor Enterprise teams can configure IAM roles to access Bedrock without any Access Keys.
                </p>
              </div>
              <Switch
                className="shrink-0"
                checked={awsBedrockOpen}
                onCheckedChange={setAwsBedrockOpen}
                disabled={saving}
              />
            </div>
            {awsBedrockOpen && (
              <div className="space-y-2 mt-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Access Key ID</Label>
                  <Input
                    placeholder="AWS Access Key ID"
                    className={cn("max-w-md mt-1", byokErrors.aws && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.awsAccessKeyId}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, awsAccessKeyId: e.target.value }));
                      if (byokErrors.aws) setByokErrors((e) => ({ ...e, aws: "" }));
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Secret Access Key</Label>
                  <Input
                    type="password"
                    placeholder="AWS Secret Access Key"
                    className={cn("max-w-md mt-1", byokErrors.aws && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.awsSecretKey}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, awsSecretKey: e.target.value }));
                      if (byokErrors.aws) setByokErrors((e) => ({ ...e, aws: "" }));
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Region</Label>
                  <Input
                    placeholder="e.g. us-east-1"
                    className={cn("max-w-md mt-1", byokErrors.aws && "border-destructive")}
                    autoComplete="off"
                    value={byokValues.awsRegion}
                    onChange={(e) => {
                      setByokValues((v) => ({ ...v, awsRegion: e.target.value }));
                      if (byokErrors.aws) setByokErrors((e) => ({ ...e, aws: "" }));
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs text-muted-foreground">Test Model</Label>
                    <Input
                      placeholder="us.anthropic.claude-sonnet"
                      className="max-w-md mt-1"
                      autoComplete="off"
                      value={byokValues.awsTestModel}
                      onChange={(e) => setByokValues((v) => ({ ...v, awsTestModel: e.target.value }))}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyAws}
                    disabled={byokApplying === "aws" || validateAws() !== null}
                    className="shrink-0"
                  >
                    {byokApplying === "aws" ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {byokErrors.aws && (
                  <p className="text-xs text-destructive">{byokErrors.aws}</p>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </SettingsSection>
    </div>
  );
}
