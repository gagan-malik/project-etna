"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Maximize2,
  Minimize2,
  ExternalLink,
  RefreshCw,
  Menu,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Surfer Waveform Viewer Integration
 * 
 * Supports two modes:
 * 1. Hosted (default): Uses app.surfer-project.org via iframe
 * 2. Self-hosted: Uses local WASM build in /public/surfer (requires setup)
 * 
 * postMessage API commands:
 * - LoadUrl: Load waveform from URL
 * - ToggleMenu: Toggle Surfer's menu visibility
 * - InjectMessage: Send raw Surfer messages (unstable API)
 * 
 * @see https://gitlab.com/surfer-project/surfer
 */

interface SurferViewerProps {
  /** URL to the waveform file (VCD, FST, or GHW) */
  waveformUrl?: string;
  /** Use self-hosted WASM instead of app.surfer-project.org */
  selfHosted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Height of the viewer */
  height?: string | number;
  /** Callback when Surfer is loaded */
  onLoad?: () => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
  /** Show header with controls */
  showHeader?: boolean;
  /** File name to display */
  fileName?: string;
  /** File format (vcd, fst, ghw) */
  fileFormat?: string;
}

// Base URLs for Surfer
const SURFER_HOSTED_URL = "https://app.surfer-project.org";
const SURFER_SELF_HOSTED_PATH = "/surfer/index.html";

export function SurferViewer({
  waveformUrl,
  selfHosted = false,
  className,
  height = 500,
  onLoad,
  onError,
  showHeader = true,
  fileName,
  fileFormat,
}: SurferViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine the base URL for Surfer
  const surferBaseUrl = selfHosted ? SURFER_SELF_HOSTED_PATH : SURFER_HOSTED_URL;

  /**
   * Send a command to Surfer via postMessage
   */
  const sendCommand = useCallback((command: string, data?: Record<string, unknown>) => {
    if (!iframeRef.current?.contentWindow) {
      console.warn("Surfer iframe not ready");
      return;
    }

    const message = { command, ...data };
    iframeRef.current.contentWindow.postMessage(message, "*");
  }, []);

  /**
   * Load a waveform file from URL
   */
  const loadWaveform = useCallback((url: string) => {
    sendCommand("LoadUrl", { url });
  }, [sendCommand]);

  /**
   * Toggle Surfer's menu visibility
   */
  const toggleMenu = useCallback(() => {
    sendCommand("ToggleMenu");
  }, [sendCommand]);

  /**
   * Reload the current waveform
   */
  const reloadWaveform = useCallback(() => {
    if (waveformUrl) {
      loadWaveform(waveformUrl);
    }
  }, [waveformUrl, loadWaveform]);

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = useCallback(() => {
    if (!iframeRef.current) return;

    if (!isFullscreen) {
      iframeRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  /**
   * Open Surfer in a new tab
   */
  const openInNewTab = useCallback(() => {
    const url = waveformUrl
      ? `${SURFER_HOSTED_URL}/?url=${encodeURIComponent(waveformUrl)}`
      : SURFER_HOSTED_URL;
    window.open(url, "_blank");
  }, [waveformUrl]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
    setError(null);
    onLoad?.();

    // Auto-load waveform if URL provided
    if (waveformUrl) {
      // Small delay to ensure Surfer is fully initialized
      setTimeout(() => loadWaveform(waveformUrl), 500);
    }
  }, [waveformUrl, loadWaveform, onLoad]);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    const errorMsg = "Failed to load Surfer waveform viewer";
    setError(errorMsg);
    onError?.(errorMsg);
  }, [onError]);

  // Listen for messages from Surfer
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Surfer origin
      if (selfHosted || event.origin === SURFER_HOSTED_URL) {
        // Handle any messages from Surfer here
        // Currently Surfer doesn't send many messages back, but this is
        // where we'd handle things like "waveform loaded" events
        console.debug("Message from Surfer:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selfHosted]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <Card className={cn("overflow-hidden", className)}>
      {showHeader && (
        <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              {fileName || "Waveform Viewer"}
            </CardTitle>
            {fileFormat && (
              <Badge variant="outline" className="text-xs uppercase">
                {fileFormat}
              </Badge>
            )}
            {!isLoaded && !error && (
              <Badge variant="secondary" className="text-xs">
                Loading...
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="text-xs">
                Error
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              title="Toggle Menu"
              disabled={!isLoaded}
            >
              <Menu className="h-4 w-4" />
            </Button>
            {waveformUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={reloadWaveform}
                title="Reload Waveform"
                disabled={!isLoaded}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {error ? (
          <div
            className="flex flex-col items-center justify-center bg-muted/50 text-muted-foreground"
            style={{ height }}
          >
            <Activity className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : !waveformUrl ? (
          <div
            className="flex flex-col items-center justify-center bg-muted/50 text-muted-foreground"
            style={{ height }}
          >
            <Upload className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm mb-2">No waveform file loaded</p>
            <p className="text-xs text-muted-foreground">
              Upload a VCD, FST, or GHW file to view waveforms
            </p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={surferBaseUrl}
            className="w-full border-0"
            style={{ height }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="fullscreen"
            title="Surfer Waveform Viewer"
          />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Hook to control a Surfer viewer instance
 */
export function useSurferControls(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const sendCommand = useCallback((command: string, data?: Record<string, unknown>) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ command, ...data }, "*");
  }, [iframeRef]);

  return {
    loadWaveform: (url: string) => sendCommand("LoadUrl", { url }),
    toggleMenu: () => sendCommand("ToggleMenu"),
    /**
     * Send a raw Surfer message (unstable API)
     * @see surfer/main.rs for available messages
     */
    injectMessage: (message: string) => sendCommand("InjectMessage", { message }),
  };
}
