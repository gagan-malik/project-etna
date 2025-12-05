"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  LayoutGrid, 
  HelpCircle, 
  Globe, 
  Paperclip, 
  Mic, 
  Radio,
  Send,
  Sparkles,
  X,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/chat-message";
import { FilePreview } from "@/components/chat/file-preview";
import { ModelSelector } from "@/components/chat/model-selector";
import { SourceSelector, type SourceType } from "@/components/chat/source-selector";
import { useConversation, type Message } from "@/lib/hooks/use-conversation";
import { useAIStream } from "@/lib/hooks/use-ai-stream";
import { getBestModelForQuery, getHighestQualityModel } from "@/lib/ai/model-ranking";
import type { ModelInfo } from "@/lib/ai/types";
import { hasPremiumAccess as checkPremiumAccess } from "@/lib/subscription";
import { useSession } from "next-auth/react";

interface MessageDisplay {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
  createdAt?: string;
}

function ChatPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const {
    currentConversation,
    messages: dbMessages,
    loading: conversationLoading,
    createConversation,
    loadConversation,
    setMessages,
  } = useConversation();
  const { streaming, streamMessage } = useAIStream();

  const [messages, setMessagesDisplay] = useState<MessageDisplay[]>([]);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [selectedSources, setSelectedSources] = useState<SourceType[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected-sources");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ["web", "my_files"];
        }
      }
    }
    return ["web", "my_files"];
  });
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [autoMode, setAutoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auto-mode") === "true";
    }
    return false;
  });
  const [maxMode, setMaxMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("max-mode") === "true";
    }
    return false;
  });
  const [useMultipleModels, setUseMultipleModels] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("use-multiple-models") === "true";
    }
    return false;
  });
  const [activeLeftIcon, setActiveLeftIcon] = useState<"search" | "layout" | "help">("help");
  const [activeRightIcon, setActiveRightIcon] = useState<"globe" | "attach" | "mic" | "equalizer">("equalizer");
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>("");

  // Fetch premium access status
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const response = await fetch("/api/account/profile", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setHasPremiumAccess(data.user.plan !== "free");
        }
      } catch (error) {
        console.error("Failed to fetch premium status:", error);
        setHasPremiumAccess(false);
      }
    };
    fetchPremiumStatus();
  }, []);

  // Load available models from API
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch("/api/ai/models", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const models: ModelInfo[] = data.models.map((m: any) => ({
            id: m.id,
            name: m.name,
            provider: m.provider,
            category: m.category,
            available: m.available ?? false,
          }));
          setAvailableModels(models);
          if (models.length > 0 && !selectedModel) {
            const availableModel = models.find(m => m.available) || models[0];
            setSelectedModel(availableModel);
          }
        }
      } catch (error) {
        console.error("Failed to load models:", error);
      }
    };
    loadModels();
  }, []);

  // Load saved model preference
  useEffect(() => {
    const savedModel = localStorage.getItem("selected-llm-model");
    if (savedModel && availableModels.length > 0) {
      try {
        const model = JSON.parse(savedModel);
        const found = availableModels.find((m) => m.id === model.id);
        if (found) {
          setSelectedModel(found);
        }
      } catch (e) {
        console.error("Error loading saved model:", e);
      }
    }
  }, [availableModels]);

  // Save selected sources to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-sources", JSON.stringify(selectedSources));
    }
  }, [selectedSources]);

  // Save toggle states to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auto-mode", String(autoMode));
      localStorage.setItem("max-mode", String(maxMode));
      localStorage.setItem("use-multiple-models", String(useMultipleModels));
    }
  }, [autoMode, maxMode, useMultipleModels]);

  // Auto-select model based on Auto Mode or MAX Mode
  useEffect(() => {
    if (availableModels.length > 0) {
      if (maxMode && hasPremiumAccess) {
        const highestQuality = getHighestQualityModel(availableModels);
        if (highestQuality) {
          setSelectedModel(highestQuality);
        }
      } else if (autoMode && inputValue.trim()) {
        const bestModel = getBestModelForQuery(inputValue, availableModels);
        if (bestModel) {
          setSelectedModel(bestModel);
        }
      }
    }
  }, [autoMode, maxMode, inputValue, availableModels, hasPremiumAccess]);

  // Load conversation from URL parameter
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId && conversationId !== currentConversation?.id) {
      loadConversation(conversationId);
    }
  }, [searchParams, currentConversation?.id, loadConversation]);

  // Convert database messages to display format
  useEffect(() => {
    if (dbMessages && dbMessages.length > 0) {
      const displayMessages: MessageDisplay[] = dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        createdAt: msg.createdAt,
        model: msg.model
          ? {
              id: msg.model,
              name: msg.model,
              provider: msg.provider || "unknown",
              category: "General",
              available: true,
            }
          : null,
      }));
      setMessagesDisplay(displayMessages);
    } else if (!conversationLoading) {
      setMessagesDisplay([]);
    }
  }, [dbMessages, conversationLoading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const [uploadingFiles, setUploadingFiles] = useState<Set<number>>(new Set());
  const [uploadedFileUrls, setUploadedFileUrls] = useState<Map<number, string>>(new Map());

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const startIndex = selectedFiles.length;

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const fileIndex = startIndex + i;
      
      setUploadingFiles((prev) => new Set(prev).add(fileIndex));

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (currentConversation?.spaceId) {
          formData.append("spaceId", currentConversation.spaceId);
        }

        const response = await fetch("/api/files/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        setUploadedFileUrls((prev) => new Map(prev).set(fileIndex, data.blob.url));
        
        toast({
          title: "File uploaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message || `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== fileIndex));
      } finally {
        setUploadingFiles((prev) => {
          const next = new Set(prev);
          next.delete(fileIndex);
          return next;
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFileUrls((prev) => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
    setUploadingFiles((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select an AI model first",
        variant: "destructive",
      });
      return;
    }

    const content = inputValue.trim();
    if (!content) return;

    let modelToUse = selectedModel;
    if (maxMode && hasPremiumAccess) {
      const highestQuality = getHighestQualityModel(availableModels);
      if (highestQuality) {
        modelToUse = highestQuality;
      }
    } else if (autoMode) {
      const bestModel = getBestModelForQuery(content, availableModels);
      if (bestModel) {
        modelToUse = bestModel;
      }
    }

    if (!modelToUse) {
      toast({
        title: "Error",
        description: "Could not determine AI model to use.",
        variant: "destructive",
      });
      return;
    }

    let conversationId = currentConversation?.id;
    if (!conversationId) {
      const newConv = await createConversation();
      if (!newConv) {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        return;
      }
      conversationId = newConv.id;
    }

    const userMessage: MessageDisplay = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      repository: selectedRepository,
      model: modelToUse,
    };

    setMessagesDisplay((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedFiles([]);

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: MessageDisplay = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      model: modelToUse,
    };
    setMessagesDisplay((prev) => [...prev, assistantMessage]);
    streamingMessageRef.current = "";

    try {
      if (!conversationId) {
        throw new Error("Conversation ID is missing");
      }
      await streamMessage(
        conversationId,
        content,
        modelToUse.id,
        modelToUse.provider,
        selectedSources,
        maxMode && hasPremiumAccess,
        useMultipleModels && hasPremiumAccess,
        (chunk: string) => {
          streamingMessageRef.current += chunk;
          setMessagesDisplay((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamingMessageRef.current }
                : msg
            )
          );
        },
        async (fullContent: string) => {
          if (currentConversation) {
            const response = await fetch(
              `/api/conversations/${conversationId}`,
              { credentials: "include" }
            );
            if (response.ok) {
              const data = await response.json();
              setMessages(data.conversation.messages || []);
            }
          }
        }
      );
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send message";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setMessagesDisplay((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Header with Logo */}
      <div className="flex justify-center pt-12 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="text-white">Project Etna</span>{" "}
          <span className="text-[#00d9ff]">Enterprise</span>
        </h1>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {conversationLoading && messages.length === 0 && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-24 w-full rounded-lg bg-[#1a1a1a]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!conversationLoading && messages.length > 0 && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onEdit={async (id, newContent) => {
                  try {
                    const response = await fetch(`/api/messages/${id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ content: newContent }),
                    });
                    if (!response.ok) throw new Error("Failed to update message");
                    if (currentConversation) {
                      await loadConversation(currentConversation.id);
                    }
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to edit message",
                      variant: "destructive",
                    });
                    throw error;
                  }
                }}
                onRegenerate={async () => {}}
                onDelete={async (id) => {
                  try {
                    const response = await fetch(`/api/messages/${id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    if (!response.ok) throw new Error("Failed to delete message");
                    if (currentConversation) {
                      await loadConversation(currentConversation.id);
                    }
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to delete message",
                      variant: "destructive",
                    });
                  }
                }}
              />
            ))}
            {streaming && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-[#00d9ff]" />
                </div>
                <div className="flex-1 bg-[#1a1a1a] rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <span className="typing-indicator">●</span>
                    <span className="typing-indicator">●</span>
                    <span className="typing-indicator">●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {messages.length === 0 && !streaming && !conversationLoading && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                Start a conversation by typing below
              </p>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 pb-2">
          <FilePreview 
            files={selectedFiles} 
            onRemove={removeFile}
            uploadingFiles={uploadingFiles}
            uploadedUrls={uploadedFileUrls}
          />
        </div>
      )}

      {/* Input Bar - Perplexity Style */}
      <div className="px-4 pb-8 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] px-4 py-3 flex items-center gap-3">
            {/* Left Icons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeLeftIcon === "search" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setActiveLeftIcon("search")}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeLeftIcon === "layout" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setActiveLeftIcon("layout")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeLeftIcon === "help" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setActiveLeftIcon("help")}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* Input Field */}
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything. Type @ for mentions."
              className="flex-1 bg-transparent border-none text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeRightIcon === "globe" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setActiveRightIcon("globe")}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,text/*,.doc,.docx"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeRightIcon === "attach" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => {
                  fileInputRef.current?.click();
                  setActiveRightIcon("attach");
                }}
                disabled={uploadingFiles.size > 0}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeRightIcon === "mic" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => {
                  setIsRecording(!isRecording);
                  setActiveRightIcon("mic");
                }}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md ${
                  activeRightIcon === "equalizer" 
                    ? "bg-[#00d9ff]/20 text-[#00d9ff]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setActiveRightIcon("equalizer")}
              >
                <Radio className="h-4 w-4" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={(!inputValue.trim() && selectedFiles.length === 0) || streaming || !selectedModel}
              className="h-8 w-8 rounded-md bg-[#00d9ff] hover:bg-[#00d9ff]/90 text-black"
              size="icon"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Hidden Controls Row - Model Selector and Source Selector */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {availableModels.length > 0 && (
              <ModelSelector
                models={availableModels}
                selected={selectedModel}
                onSelect={(model) => {
                  const modelInfo: ModelInfo = {
                    id: model.id,
                    name: model.name,
                    provider: model.provider,
                    category: model.category,
                    available: model.available ?? false,
                  };
                  setSelectedModel(modelInfo);
                  localStorage.setItem("selected-llm-model", JSON.stringify(modelInfo));
                }}
                hasPremiumAccess={hasPremiumAccess}
                autoMode={autoMode}
                maxMode={maxMode}
                useMultipleModels={useMultipleModels}
                onAutoModeChange={setAutoMode}
                onMaxModeChange={(enabled) => {
                  if (enabled && !hasPremiumAccess) {
                    toast({
                      title: "Premium Feature",
                      description: "MAX Mode requires a premium subscription.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setMaxMode(enabled);
                }}
                onUseMultipleModelsChange={(enabled) => {
                  if (enabled && !hasPremiumAccess) {
                    toast({
                      title: "Premium Feature",
                      description: "Use Multiple Models requires a premium subscription.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setUseMultipleModels(enabled);
                }}
              />
            )}
            <SourceSelector
              selectedSources={selectedSources}
              onSourcesChange={setSelectedSources}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
