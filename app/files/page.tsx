"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
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
import { Loader2, File, FileText, Image, Trash2, Search, Download, Eye } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  url: string | null;
  source: string | null;
  createdAt: string;
  metadata: any;
}

export default function FilesPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load documents");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      loadDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (source: string | null, metadata: any) => {
    if (source === "upload") {
      const fileType = metadata?.fileType || "";
      if (fileType.startsWith("image/")) return <Image className="h-5 w-5" />;
      if (fileType === "application/pdf") return <FileText className="h-5 w-5" />;
    }
    if (source === "github") return <FileText className="h-5 w-5" />;
    if (source === "confluence") return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredDocuments = documents.filter((doc) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!doc.title.toLowerCase().includes(query) && !doc.content.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filterSource !== "all" && doc.source !== filterSource) {
      return false;
    }
    return true;
  });

  const sources = Array.from(new Set(documents.map((d) => d.source).filter((s): s is string => s !== null)));

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-semibold leading-8 text-foreground mb-1">
          Files
        </h1>
        <p className="text-sm font-normal leading-5 text-muted-foreground">
          Manage your uploaded and indexed files
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source === "upload" ? "Uploaded" : source?.charAt(0).toUpperCase() + source?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            {filteredDocuments.length} file{filteredDocuments.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Files List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="p-12 text-center">
          <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || filterSource !== "all"
              ? "Try adjusting your search or filters"
              : "Upload files or connect integrations to see files here"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {getFileIcon(doc.source, doc.metadata)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold truncate">{doc.title}</h3>
                      {doc.source && (
                        <Badge variant="outline" className="capitalize">
                          {doc.source === "upload" ? "Uploaded" : doc.source}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {doc.content.substring(0, 150)}
                      {doc.content.length > 150 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      {doc.metadata?.fileSize && (
                        <>
                          <span>•</span>
                          <span>{formatFileSize(doc.metadata.fileSize)}</span>
                        </>
                      )}
                      {doc.metadata?.fileType && (
                        <>
                          <span>•</span>
                          <span>{doc.metadata.fileType}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(doc.url!, "_blank")}
                      title="Open file"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewDoc(doc)}
                    title="Preview"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewDoc?.title}</DialogTitle>
            <DialogDescription>
              {previewDoc?.source && (
                <Badge variant="outline" className="capitalize">
                  {previewDoc.source}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewDoc?.url && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewDoc.url!, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Open Original
                </Button>
              </div>
            )}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                {previewDoc?.content}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

