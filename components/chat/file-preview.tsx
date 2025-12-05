"use client";

import { Button } from "@/components/ui/button";
import { X, File, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  uploadingFiles?: Set<number>;
  uploadedUrls?: Map<number, string>;
}

export function FilePreview({ 
  files, 
  onRemove, 
  uploadingFiles = new Set(),
  uploadedUrls = new Map()
}: FilePreviewProps) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return null; // Show image
    if (file.type === "application/pdf") return "📄";
    if (file.type.includes("word") || file.type.includes("document")) return "📝";
    if (file.type.includes("spreadsheet") || file.type === "text/csv") return "📊";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, index) => {
        const isUploading = uploadingFiles.has(index);
        const isUploaded = uploadedUrls.has(index);
        const fileIcon = getFileIcon(file);

        return (
          <div 
            key={index} 
            className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted group border border-border"
          >
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <div className="text-2xl mb-1">{fileIcon}</div>
                <div className="text-xs text-center text-muted-foreground truncate w-full">
                  {file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>
              </div>
            )}
            
            {/* Upload Status */}
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {isUploaded && !isUploading && (
              <div className="absolute top-1 left-1">
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              </div>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
