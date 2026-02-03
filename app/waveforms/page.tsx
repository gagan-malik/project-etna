"use client";

import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Activity,
  Upload,
  Trash2,
  ExternalLink,
  FileUp,
  Eye,
  Clock,
  HardDrive,
  Link2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SurferViewer } from "@/components/waveform/surfer-viewer";
import { WaveformUploader, UploadedWaveform } from "@/components/waveform/waveform-uploader";

interface WaveformFile {
  id: string;
  name: string;
  url: string;
  format: "vcd" | "fst" | "ghw";
  size: number;
  spaceId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  linkedSessions?: Array<{ id: string; name: string }>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WaveformsPage() {
  const [waveforms, setWaveforms] = useState<WaveformFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWaveform, setSelectedWaveform] = useState<WaveformFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WaveformFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchWaveforms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/waveforms", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch waveforms");
      }

      const data = await response.json();
      setWaveforms(data.waveforms || []);
    } catch (error) {
      console.error("Error fetching waveforms:", error);
      toast({
        title: "Error",
        description: "Failed to load waveform files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWaveforms();
  }, [fetchWaveforms]);

  const handleUpload = useCallback((uploaded: UploadedWaveform) => {
    const newWaveform: WaveformFile = {
      id: uploaded.id,
      name: uploaded.name,
      url: uploaded.url,
      format: uploaded.format,
      size: uploaded.size,
      spaceId: "",
      createdAt: uploaded.uploadedAt.toISOString(),
      updatedAt: uploaded.uploadedAt.toISOString(),
      linkedSessions: [],
    };
    setWaveforms((prev) => [newWaveform, ...prev]);
    setUploadDialogOpen(false);
    toast({
      title: "Upload Complete",
      description: `${uploaded.name} uploaded successfully`,
    });
  }, [toast]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/waveforms?id=${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete waveform");
      }

      setWaveforms((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      
      // Close viewer if the deleted waveform was being viewed
      if (selectedWaveform?.id === deleteTarget.id) {
        setSelectedWaveform(null);
      }

      toast({
        title: "Deleted",
        description: `${deleteTarget.name} deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting waveform:", error);
      toast({
        title: "Error",
        description: "Failed to delete waveform file",
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, selectedWaveform, toast]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Waveforms</h1>
              <Badge variant="secondary">{waveforms.length} files</Badge>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Waveform
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Waveform File</DialogTitle>
                  <DialogDescription>
                    Upload VCD, FST, or GHW files from your simulation
                  </DialogDescription>
                </DialogHeader>
                <WaveformUploader
                  onUpload={handleUpload}
                  onError={(error) => {
                    toast({
                      title: "Upload Failed",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* File List */}
            <div className="w-80 border-r overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-3">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : waveforms.length === 0 ? (
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No waveform files yet
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First File
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                waveforms.map((waveform) => (
                  <Card
                    key={waveform.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedWaveform?.id === waveform.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedWaveform(waveform)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {waveform.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs uppercase">
                              {waveform.format}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(waveform.size)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(waveform.url, "_blank");
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(waveform);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(waveform.createdAt)}
                        </span>
                        {waveform.linkedSessions && waveform.linkedSessions.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Link2 className="h-3 w-3" />
                            {waveform.linkedSessions.length} session(s)
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Viewer Panel */}
            <div className="flex-1 overflow-hidden p-3">
              {selectedWaveform ? (
                <SurferViewer
                  waveformUrl={selectedWaveform.url}
                  fileName={selectedWaveform.name}
                  fileFormat={selectedWaveform.format}
                  height="calc(100vh - 180px)"
                  className="h-full"
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <CardTitle className="text-lg mb-2">
                      {waveforms.length === 0
                        ? "No waveform files yet"
                        : "Select a Waveform"}
                    </CardTitle>
                    <CardDescription>
                      {waveforms.length === 0
                        ? "Upload a waveform file using the button above to view it here"
                        : "Click on a waveform file from the list to view it here"}
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Storage Info Footer */}
          <footer className="h-10 px-6 border-t flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {waveforms.length} files •{" "}
                {formatFileSize(waveforms.reduce((acc, w) => acc + w.size, 0))} used
              </span>
            </div>
            <span>
              Free tier: 5 files, 25 MB max •{" "}
              <a href="/settings" className="text-primary hover:underline">
                Upgrade for more
              </a>
            </span>
          </footer>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Waveform File?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{deleteTarget?.name}&quot;. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
