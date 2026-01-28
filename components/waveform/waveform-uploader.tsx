"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileUp,
  X,
  AlertCircle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WaveformUploaderProps {
  /** Callback when file is successfully uploaded */
  onUpload?: (file: UploadedWaveform) => void;
  /** Callback when upload fails */
  onError?: (error: string) => void;
  /** Maximum file size in bytes (default: 25MB for free tier) */
  maxSize?: number;
  /** Allowed file formats */
  allowedFormats?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Disable the uploader */
  disabled?: boolean;
}

export interface UploadedWaveform {
  id: string;
  name: string;
  url: string;
  size: number;
  format: "vcd" | "fst" | "ghw";
  uploadedAt: Date;
}

// File format detection
const FORMAT_EXTENSIONS: Record<string, "vcd" | "fst" | "ghw"> = {
  ".vcd": "vcd",
  ".fst": "fst",
  ".ghw": "ghw",
};

const FORMAT_MIME_TYPES: Record<string, "vcd" | "fst" | "ghw"> = {
  "application/x-vcd": "vcd",
  "application/octet-stream": "vcd", // Common fallback
};

// Default limits
const DEFAULT_MAX_SIZE = 25 * 1024 * 1024; // 25 MB
const DEFAULT_ALLOWED_FORMATS = [".vcd", ".fst", ".ghw"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectFormat(file: File): "vcd" | "fst" | "ghw" | null {
  // Check extension
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (ext && FORMAT_EXTENSIONS[ext]) {
    return FORMAT_EXTENSIONS[ext];
  }

  // Check MIME type
  if (FORMAT_MIME_TYPES[file.type]) {
    return FORMAT_MIME_TYPES[file.type];
  }

  return null;
}

export function WaveformUploader({
  onUpload,
  onError,
  maxSize = DEFAULT_MAX_SIZE,
  allowedFormats = DEFAULT_ALLOWED_FORMATS,
  className,
  disabled = false,
}: WaveformUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check size
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${formatFileSize(maxSize)}. Upgrade to Pro for larger files.`;
    }

    // Check format
    const format = detectFormat(file);
    if (!format) {
      return `Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`;
    }

    return null;
  }, [maxSize, allowedFormats]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setUploadStatus("error");
      onError?.(validationError);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setUploadStatus("idle");
  }, [validateFile, onError]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload to API
      const response = await fetch("/api/waveforms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();

      setUploadStatus("success");
      setUploadProgress(100);

      const uploadedWaveform: UploadedWaveform = {
        id: result.id,
        name: selectedFile.name,
        url: result.url,
        size: selectedFile.size,
        format: detectFormat(selectedFile) || "vcd",
        uploadedAt: new Date(),
      };

      onUpload?.(uploadedWaveform);

      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setUploadStatus("idle");
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setErrorMessage(message);
      setUploadStatus("error");
      onError?.(message);
    }
  }, [selectedFile, onUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Upload Waveform</CardTitle>
        </div>
        <CardDescription>
          Upload VCD, FST, or GHW files (max {formatFileSize(maxSize)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Drop zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging && "border-primary bg-primary/5",
            !isDragging && "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.join(",")}
            onChange={handleInputChange}
            disabled={disabled || uploadStatus === "uploading"}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your waveform file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {allowedFormats.map((fmt) => (
                  <Badge key={fmt} variant="secondary" className="text-xs uppercase">
                    {fmt.replace(".", "")}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File info */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileUp className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {detectFormat(selectedFile)?.toUpperCase()}
                    </p>
                  </div>
                </div>
                {uploadStatus !== "uploading" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Upload progress */}
              {uploadStatus === "uploading" && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Success message */}
              {uploadStatus === "success" && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Upload complete!</span>
                </div>
              )}

              {/* Error message */}
              {uploadStatus === "error" && errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Upload button */}
              {uploadStatus === "idle" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={disabled}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Waveform
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Size limit notice */}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Free tier: {formatFileSize(maxSize)} max •{" "}
          <a href="/billing" className="text-primary hover:underline">
            Upgrade for larger files
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
