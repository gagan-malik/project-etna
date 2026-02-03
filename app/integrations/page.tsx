"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Github, FileText, Cloud, RefreshCw, Trash2, CheckCircle2, XCircle } from "lucide-react";

interface Integration {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  config: any;
}

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<any>({});

  // Load integrations
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/integrations", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load integrations");
      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select an integration type",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: selectedType,
          name: formData.name || `${selectedType} Integration`,
          config: getConfigForType(selectedType),
          credentials: getCredentialsForType(selectedType),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create integration");
      }

      toast({
        title: "Success",
        description: "Integration connected successfully",
      });

      setConnectDialogOpen(false);
      setSelectedType("");
      setFormData({});
      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect integration",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (id: string) => {
    setSyncing((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/integrations/${id}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sync");
      }

      const data = await response.json();
      toast({
        title: "Sync Complete",
        description: `Synced ${data.syncedCount} items`,
      });
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync integration",
        variant: "destructive",
      });
    } finally {
      setSyncing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this integration?")) return;

    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Integration deleted",
      });

      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete integration",
        variant: "destructive",
      });
    }
  };

  const getConfigForType = (type: string) => {
    switch (type) {
      case "github":
        return {
          owner: formData.owner || "",
          repo: formData.repo || "",
          path: formData.path || "",
          recursive: formData.recursive !== false,
        };
      case "confluence":
        return {
          baseUrl: formData.baseUrl || "",
          spaceKey: formData.spaceKey || "",
        };
      case "microsoft_graph":
        return {
          folderPath: formData.folderPath || "/",
        };
      default:
        return {};
    }
  };

  const getCredentialsForType = (type: string) => {
    switch (type) {
      case "github":
        return {
          accessToken: formData.accessToken || "",
        };
      case "confluence":
        return {
          email: formData.email || "",
          apiToken: formData.apiToken || "",
        };
      case "microsoft_graph":
        return {
          accessToken: formData.accessToken || "",
        };
      default:
        return {};
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "confluence":
        return <FileText className="h-5 w-5" />;
      case "microsoft_graph":
        return <Cloud className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 space-y-4">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-3 -mx-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Integrations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect external services to index and search content
          </p>
        </div>
        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Connect Integration</DialogTitle>
              <DialogDescription>
                Connect an external service to index and search content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Integration Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </div>
                    </SelectItem>
                    <SelectItem value="confluence">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Confluence
                      </div>
                    </SelectItem>
                    <SelectItem value="microsoft_graph">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Microsoft Graph (OneDrive/SharePoint)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedType === "github" && (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My GitHub Repo"
                    />
                  </div>
                  <div>
                    <Label>Owner</Label>
                    <Input
                      value={formData.owner || ""}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <Label>Repository</Label>
                    <Input
                      value={formData.repo || ""}
                      onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                      placeholder="repo-name"
                    />
                  </div>
                  <div>
                    <Label>Path (optional)</Label>
                    <Input
                      value={formData.path || ""}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      placeholder="/src"
                    />
                  </div>
                  <div>
                    <Label>GitHub Personal Access Token</Label>
                    <Input
                      type="password"
                      value={formData.accessToken || ""}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      placeholder="ghp_..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Create a token at https://github.com/settings/tokens with `repo` scope
                    </p>
                  </div>
                </div>
              )}

              {selectedType === "confluence" && (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Confluence Space"
                    />
                  </div>
                  <div>
                    <Label>Base URL</Label>
                    <Input
                      value={formData.baseUrl || ""}
                      onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                      placeholder="https://your-domain.atlassian.net"
                    />
                  </div>
                  <div>
                    <Label>Space Key (optional)</Label>
                    <Input
                      value={formData.spaceKey || ""}
                      onChange={(e) => setFormData({ ...formData, spaceKey: e.target.value })}
                      placeholder="SPACE"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your-email@example.com"
                    />
                  </div>
                  <div>
                    <Label>API Token</Label>
                    <Input
                      type="password"
                      value={formData.apiToken || ""}
                      onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                      placeholder="Your Confluence API token"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Create a token at https://id.atlassian.com/manage-profile/security/api-tokens
                    </p>
                  </div>
                </div>
              )}

              {selectedType === "microsoft_graph" && (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My OneDrive"
                    />
                  </div>
                  <div>
                    <Label>Folder Path (optional)</Label>
                    <Input
                      value={formData.folderPath || ""}
                      onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
                      placeholder="/Documents"
                    />
                  </div>
                  <div>
                    <Label>Access Token</Label>
                    <Input
                      type="password"
                      value={formData.accessToken || ""}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      placeholder="Your Microsoft Graph access token"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Get an access token via OAuth2 flow (implementation needed)
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect}>Connect</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Integrations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : integrations.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect an integration to start indexing content
          </p>
          <Button onClick={() => setConnectDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Integration
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {getIcon(integration.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{integration.name}</h3>
                      <Badge variant={integration.enabled ? "default" : "secondary"}>
                        {integration.enabled ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Disabled
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {integration.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Connected {new Date(integration.createdAt).toLocaleDateString()}
                    </p>
                    {integration.config && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {integration.type === "github" && (
                          <span>
                            {integration.config.owner}/{integration.config.repo}
                          </span>
                        )}
                        {integration.type === "confluence" && (
                          <span>{integration.config.baseUrl}</span>
                        )}
                        {integration.type === "microsoft_graph" && (
                          <span>OneDrive/SharePoint</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.id)}
                    disabled={syncing.has(integration.id) || !integration.enabled}
                  >
                    {syncing.has(integration.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

