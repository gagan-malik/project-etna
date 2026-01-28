"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  FileCode,
  Trash2,
  Search,
  Upload,
  Eye,
  Cpu,
  Layers,
  TestTube,
  Settings2,
  Plus,
  MessageSquare,
} from "lucide-react";
import { DesignFileViewer } from "@/components/debug/design-file-viewer";

interface DesignFile {
  id: string;
  name: string;
  path: string;
  type: string;
  format: string;
  content: string | null;
  metadata: {
    modules?: Array<{
      name: string;
      ports: Array<{ name: string; direction: string; type: string }>;
      signals: number;
      parameters: Record<string, string>;
      instances: string[];
      lineStart: number;
      lineEnd: number;
    }>;
    topModule?: string;
    errors?: string[];
    warnings?: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

const fileTypeConfig = {
  rtl: {
    label: "RTL",
    icon: Cpu,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  testbench: {
    label: "Testbench",
    icon: TestTube,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  constraint: {
    label: "Constraint",
    icon: Settings2,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  netlist: {
    label: "Netlist",
    icon: Layers,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
};

export default function DesignFilesPage() {
  const { toast } = useToast();
  const [designFiles, setDesignFiles] = useState<DesignFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFormat, setFilterFormat] = useState<string>("all");
  const [previewFile, setPreviewFile] = useState<DesignFile | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDesignFiles();
  }, []);

  const loadDesignFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/design-files", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load design files");
      const data = await response.json();
      setDesignFiles(data.designFiles || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load design files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const content = await file.text();
        
        // Get or create a default space
        const spacesResponse = await fetch("/api/spaces", {
          credentials: "include",
        });
        let spaceId: string;
        
        if (spacesResponse.ok) {
          const spacesData = await spacesResponse.json();
          if (spacesData.spaces && spacesData.spaces.length > 0) {
            spaceId = spacesData.spaces[0].id;
          } else {
            // Create a default space
            const createSpaceResponse = await fetch("/api/spaces", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name: "Default Workspace",
                slug: `workspace-${Date.now()}`,
              }),
            });
            if (!createSpaceResponse.ok) throw new Error("Failed to create workspace");
            const newSpace = await createSpaceResponse.json();
            spaceId = newSpace.space.id;
          }
        } else {
          throw new Error("Failed to get workspaces");
        }

        const response = await fetch("/api/design-files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: file.name,
            path: `/${file.name}`,
            content,
            spaceId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload file");
        }

        const data = await response.json();
        toast({
          title: "File uploaded",
          description: `${file.name} - ${data.parseResult.moduleCount} module(s) found`,
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message || `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    loadDesignFiles();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this design file?")) return;

    try {
      const response = await fetch(`/api/design-files/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Design file deleted successfully",
      });

      loadDesignFiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleAskAboutCode = (selectedCode: string, context: string) => {
    // Navigate to chat with the code as context
    const encodedMessage = encodeURIComponent(
      `${context}\n\nPlease analyze this code:\n\`\`\`\n${selectedCode}\n\`\`\``
    );
    window.location.href = `/chat?message=${encodedMessage}`;
  };

  const getTypeConfig = (type: string) => {
    return fileTypeConfig[type as keyof typeof fileTypeConfig] || fileTypeConfig.rtl;
  };

  const filteredFiles = designFiles.filter((file) => {
    // Tab filter
    if (activeTab !== "all" && file.type !== activeTab) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = file.name.toLowerCase().includes(query);
      const matchesModule = file.metadata?.modules?.some(
        (m) => m.name.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesModule) {
        return false;
      }
    }
    // Type filter
    if (filterType !== "all" && file.type !== filterType) {
      return false;
    }
    // Format filter
    if (filterFormat !== "all" && file.format !== filterFormat) {
      return false;
    }
    return true;
  });

  const formats = Array.from(new Set(designFiles.map((f) => f.format)));
  const typeCounts = designFiles.reduce(
    (acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1 flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            Design Files
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your Verilog, VHDL, and SystemVerilog design files
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".v,.vh,.sv,.svh,.vhd,.vhdl"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload design files"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Design Files
          </Button>
        </div>
      </div>

      {/* Tabs for file types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({designFiles.length})
          </TabsTrigger>
          <TabsTrigger value="rtl">
            <Cpu className="h-4 w-4 mr-1" />
            RTL ({typeCounts.rtl || 0})
          </TabsTrigger>
          <TabsTrigger value="testbench">
            <TestTube className="h-4 w-4 mr-1" />
            Testbench ({typeCounts.testbench || 0})
          </TabsTrigger>
          <TabsTrigger value="constraint">
            <Settings2 className="h-4 w-4 mr-1" />
            Constraints ({typeCounts.constraint || 0})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or module..."
            className="pl-9"
          />
        </div>
        <Select value={filterFormat} onValueChange={setFilterFormat}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {formats.map((format) => (
              <SelectItem key={format} value={format}>
                {format.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card className="p-12 text-center">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No design files found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterType !== "all" || filterFormat !== "all"
              ? "Try adjusting your search or filters"
              : "Upload Verilog, VHDL, or SystemVerilog files to get started"}
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="h-4 w-4 mr-2" />
            Upload First File
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFiles.map((file) => {
            const typeConfig = getTypeConfig(file.type);
            const TypeIcon = typeConfig.icon;
            const moduleCount = file.metadata?.modules?.length || 0;
            const topModule = file.metadata?.topModule;

            return (
              <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${typeConfig.bgColor} flex items-center justify-center`}
                  >
                    <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold truncate">{file.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                      <Badge variant="secondary">{file.format.toUpperCase()}</Badge>
                      {topModule && (
                        <Badge variant="outline" className="text-xs">
                          Top: {topModule}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{moduleCount} module{moduleCount !== 1 ? "s" : ""}</span>
                      <span>•</span>
                      <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {file.metadata?.modules && file.metadata.modules.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {file.metadata.modules.slice(0, 3).map((m) => (
                          <span
                            key={m.name}
                            className="text-xs bg-muted px-2 py-0.5 rounded font-mono"
                          >
                            {m.name}
                          </span>
                        ))}
                        {file.metadata.modules.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{file.metadata.modules.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewFile(file)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAskAboutCode(
                        file.content || "",
                        `Analyzing ${file.name}`
                      )
                    }
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Analyze
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              {previewFile?.name}
            </DialogTitle>
            <DialogDescription>
              {previewFile && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {previewFile.format.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{previewFile.type}</Badge>
                  {previewFile.metadata?.topModule && (
                    <span className="text-xs">
                      Top module: {previewFile.metadata.topModule}
                    </span>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[calc(90vh-120px)]">
            {previewFile?.content && (
              <DesignFileViewer
                name={previewFile.name}
                content={previewFile.content}
                format={previewFile.format as "verilog" | "vhdl" | "systemverilog"}
                type={previewFile.type as "rtl" | "testbench" | "constraint" | "netlist"}
                metadata={previewFile.metadata || undefined}
                onAskAboutCode={handleAskAboutCode}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
