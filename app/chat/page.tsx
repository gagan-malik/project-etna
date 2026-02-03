"use client";

import { useState, useRef, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Copy, Heart, Plus, FolderOpen, Sparkles, Send, X, Loader2, Bug, Cpu, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/chat-message";
import { FilePreview } from "@/components/chat/file-preview";
import { GitHubRepoSelector } from "@/components/chat/github-repo-selector";
import { ModelSelector } from "@/components/chat/model-selector";
import { SourceSelector, type SourceType } from "@/components/chat/source-selector";
import { useConversation, type Message } from "@/lib/hooks/use-conversation";
import { useAIStream } from "@/lib/hooks/use-ai-stream";
import { getBestModelForQuery, getHighestQualityModel, getModelMetadata } from "@/lib/ai/model-ranking";
import { DEFAULT_CHAT_MODELS } from "@/lib/ai";
import type { ModelInfo } from "@/lib/ai/types";
import { hasPremiumAccess as checkPremiumAccess } from "@/lib/subscription";
import { useSession } from "next-auth/react";
import { QUICK_PROMPTS, getSystemPrompt } from "@/lib/ai/prompts/silicon-debug";
import { isHardwareDebugQuery } from "@/lib/ai/model-ranking";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserSettings } from "@/components/user-settings-provider";

interface MessageDisplay {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
  createdAt?: string;
}

// General suggestions
const GENERAL_SUGGESTIONS = [
  "What's the latest news about AI?",
  "Explain quantum computing",
  "Best practices for React",
];

// Silicon debugging suggestions
const DEBUG_SUGGESTIONS = [
  "Analyze my Verilog module for potential issues",
  "Check for race conditions in this testbench",
  "Review clock domain crossings",
  "Help debug this FSM implementation",
  "Generate assertions for this design",
  "Find timing violations in my RTL",
];

function ChatPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { preferences, updatePreferences } = useUserSettings();
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
  const [allModels, setAllModels] = useState<
    Array<{ id: string; name: string; provider: string; category: string; available?: boolean }>
  >([]);
  const [availableModels, setAvailableModels] = useState<
    Array<{ id: string; name: string; provider: string; category: string }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<{
    id: string;
    name: string;
    provider: string;
    category: string;
  } | null>(null);
  const [selectedSources, setSelectedSources] = useState<SourceType[]>(() => {
    // Load saved sources from localStorage, default to web and my_files
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
  const [autoModeState, setAutoModeState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("auto-mode");
      return saved === "true";
    }
    return false;
  });
  const [maxModeState, setMaxModeState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("max-mode");
      return saved === "true";
    }
    return false;
  });
  const [useMultipleModelsState, setUseMultipleModelsState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("use-multiple-models");
      return saved === "true";
    }
    return false;
  });
  const autoMode = (session?.user && (preferences.autoMode as boolean | undefined) != null)
    ? (preferences.autoMode as boolean)
    : autoModeState;
  const maxMode = (session?.user && (preferences.maxMode as boolean | undefined) != null)
    ? (preferences.maxMode as boolean)
    : maxModeState;
  const useMultipleModels = (session?.user && (preferences.useMultipleModels as boolean | undefined) != null)
    ? (preferences.useMultipleModels as boolean)
    : useMultipleModelsState;
  const setAutoMode = useCallback((v: boolean) => {
    setAutoModeState(v);
    if (session?.user) void updatePreferences({ autoMode: v });
    if (typeof window !== "undefined") localStorage.setItem("auto-mode", String(v));
  }, [session?.user, updatePreferences]);
  const setMaxMode = useCallback((v: boolean) => {
    setMaxModeState(v);
    if (session?.user) void updatePreferences({ maxMode: v });
    if (typeof window !== "undefined") localStorage.setItem("max-mode", String(v));
  }, [session?.user, updatePreferences]);
  const setUseMultipleModels = useCallback((v: boolean) => {
    setUseMultipleModelsState(v);
    if (session?.user) void updatePreferences({ useMultipleModels: v });
    if (typeof window !== "undefined") localStorage.setItem("use-multiple-models", String(v));
  }, [session?.user, updatePreferences]);
  const [charCount, setCharCount] = useState(0);
  const [debugMode, setDebugMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("debug-mode");
      return saved === "true";
    }
    return true; // Default to debug mode enabled
  });
  const agentAutocomplete = (preferences.agentAutocomplete as boolean) ?? true;
  const [inputFocused, setInputFocused] = useState(false);
  const [autocompleteSelectedIndex, setAutocompleteSelectedIndex] = useState(0);
  const [autocompleteJustAccepted, setAutocompleteJustAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>("");

  // Load premium access status
  useEffect(() => {
    const checkPremiumAccess = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch("/api/account/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const plan = data.user?.plan || "free";
          const subscriptionStatus = data.user?.subscriptionStatus;
          const subscriptionExpiresAt = data.user?.subscriptionExpiresAt
            ? new Date(data.user.subscriptionExpiresAt)
            : null;

          const isPremium =
            (plan === "pro" || plan === "enterprise") &&
            subscriptionStatus === "active" &&
            (!subscriptionExpiresAt || subscriptionExpiresAt > new Date());

          setHasPremiumAccess(isPremium);

          // Disable premium features if access is lost
          if (!isPremium) {
            setMaxMode(false);
            setUseMultipleModels(false);
          }
        }
      } catch (error) {
        console.error("Failed to check premium access:", error);
      }
    };
    checkPremiumAccess();
  }, [session]);

  // Load available models: from API when authenticated, static list for guests
  const enabledModelIds = (preferences.enabledModelIds as string[] | undefined) ?? [];
  const enabledModelIdsKey = enabledModelIds.join(",");
  useEffect(() => {
    if (!session?.user?.id) {
      // Guest: use static list; filter by enabledModelIds from localStorage when set
      const base = DEFAULT_CHAT_MODELS;
      setAllModels(base);
      const models =
        enabledModelIds.length > 0
          ? base.filter((m) => enabledModelIds.includes(m.id))
          : base;
      setAvailableModels(models);
      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0]);
      }
      return;
    }
    const loadModels = async () => {
      try {
        const response = await fetch("/api/ai/models", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const fullList: ModelInfo[] = data.models.map((m: { id: string; name: string; provider: string; category: string; available?: boolean }) => ({
            id: m.id,
            name: m.name,
            provider: m.provider,
            category: m.category,
            available: m.available ?? false,
          }));
          setAllModels(fullList);
          const models =
            enabledModelIds.length > 0
              ? fullList.filter((m) => enabledModelIds.includes(m.id))
              : fullList;
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
  }, [session?.user?.id, enabledModelIdsKey]);

  // Restrict reasoning models to paid users: recompute available list when premium status or enabled list changes
  useEffect(() => {
    if (!session?.user || allModels.length === 0) return;
    let list =
      enabledModelIds.length > 0
        ? allModels.filter((m) => enabledModelIds.includes(m.id))
        : [...allModels];
    if (!hasPremiumAccess) {
      list = list.filter((m) => !getModelMetadata(m.id)?.capabilities.reasoning);
    }
    setAvailableModels(list);
    if (selectedModel && !list.some((m) => m.id === selectedModel.id)) {
      setSelectedModel(list[0] ?? null);
    }
  }, [session?.user, allModels, enabledModelIdsKey, hasPremiumAccess, selectedModel]);

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

  // Auto-select model based on query when Auto Mode is enabled
  useEffect(() => {
    if (autoMode && inputValue.trim() && availableModels.length > 0) {
      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
      const bestModel = getBestModelForQuery(inputValue, modelsWithAvailable);
      if (bestModel && bestModel.id !== selectedModel?.id) {
        setSelectedModel(availableModels.find(m => m.id === bestModel.id) || selectedModel);
      }
    }
  }, [inputValue, autoMode, availableModels, selectedModel]);

  // Apply MAX Mode - override model selection with highest quality
  useEffect(() => {
    if (maxMode && hasPremiumAccess && availableModels.length > 0) {
      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
      const highestQualityModel = getHighestQualityModel(modelsWithAvailable);
      if (highestQualityModel && highestQualityModel.id !== selectedModel?.id) {
        setSelectedModel(availableModels.find(m => m.id === highestQualityModel.id) || selectedModel);
      }
    }
  }, [maxMode, hasPremiumAccess, availableModels, selectedModel]);

  // Sync local state from preferences when they load (e.g. after login)
  useEffect(() => {
    if (session?.user && (preferences.autoMode as boolean | undefined) != null) {
      setAutoModeState(preferences.autoMode as boolean);
    }
    if (session?.user && (preferences.maxMode as boolean | undefined) != null) {
      setMaxModeState(preferences.maxMode as boolean);
    }
    if (session?.user && (preferences.useMultipleModels as boolean | undefined) != null) {
      setUseMultipleModelsState(preferences.useMultipleModels as boolean);
    }
  }, [session?.user, preferences.autoMode, preferences.maxMode, preferences.useMultipleModels]);

  // Persist toggle states to localStorage (for guests)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auto-mode", String(autoMode));
      localStorage.setItem("max-mode", String(maxMode));
      localStorage.setItem("use-multiple-models", String(useMultipleModels));
      localStorage.setItem("debug-mode", String(debugMode));
    }
  }, [autoMode, maxMode, useMultipleModels, debugMode]);

  // Get appropriate suggestions based on debug mode
  const SUGGESTIONS = debugMode ? DEBUG_SUGGESTIONS : GENERAL_SUGGESTIONS;

  // Contextual autocomplete: combine quick prompts + debug + general, filter by input prefix
  const autocompleteSuggestions = useMemo(() => {
    const all: string[] = [
      ...QUICK_PROMPTS.map((p) => p.prompt),
      ...DEBUG_SUGGESTIONS,
      ...GENERAL_SUGGESTIONS,
    ];
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return all.slice(0, 6);
    return all
      .filter((s) => s.toLowerCase().includes(trimmed) || s.toLowerCase().startsWith(trimmed))
      .slice(0, 6);
  }, [inputValue]);

  // Save selected sources to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-sources", JSON.stringify(selectedSources));
    }
  }, [selectedSources]);

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
            }
          : null,
      }));
      setMessagesDisplay(displayMessages);
    } else if (!conversationLoading) {
      setMessagesDisplay([]);
    }
  }, [dbMessages, conversationLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

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

    // Add files to selected files immediately
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Upload each file
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
        // Remove failed file
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

    // Determine which model(s) to use
    let modelToUse = selectedModel;
    
    // Apply MAX Mode if enabled and user has premium access
    if (maxMode && hasPremiumAccess && availableModels.length > 0) {
      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
      const highestQualityModel = getHighestQualityModel(modelsWithAvailable);
      if (highestQualityModel) {
        const foundModel = availableModels.find(m => m.id === highestQualityModel.id);
        if (foundModel) {
          modelToUse = foundModel;
        }
      }
    }
    
    // Apply Auto Mode if enabled and MAX Mode is not
    if (autoMode && !maxMode && availableModels.length > 0) {
      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
      const bestModel = getBestModelForQuery(inputValue.trim(), modelsWithAvailable);
      if (bestModel) {
        const foundModel = availableModels.find(m => m.id === bestModel.id);
        if (foundModel) {
          modelToUse = foundModel;
        }
      }
    }

    if (!modelToUse) {
      toast({
        title: "No model selected",
        description: "Please select an AI model first",
        variant: "destructive",
      });
      return;
    }

    const content = inputValue.trim();
    if (!content) return;

    // Ensure we have a conversation
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

    // Add user message to UI immediately
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
    setCharCount(0);

    // Create assistant message placeholder for streaming
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
      // Stream AI response
      if (!conversationId) {
        throw new Error("Conversation ID is missing");
      }
      await streamMessage(
        conversationId,
        content,
        modelToUse.id,
        modelToUse.provider,
        selectedSources, // Pass selected sources
        maxMode && hasPremiumAccess, // Pass MAX Mode flag
        useMultipleModels && hasPremiumAccess, // Pass Multiple Models flag
        (chunk: string) => {
          // Update streaming message
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
          // Reload messages from database to get the saved assistant message
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
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Retry sending the message
              handleSend();
            }}
          >
            Retry
          </Button>
        ),
      });
      // Remove failed assistant message
      setMessagesDisplay((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setCharCount(suggestion.length);
    textareaRef.current?.focus();
  };

  // Accept contextual autocomplete suggestion (from dropdown)
  const acceptAutocomplete = useCallback((suggestion: string) => {
    setInputValue(suggestion);
    setCharCount(suggestion.length);
    setAutocompleteJustAccepted(true);
    textareaRef.current?.focus();
    setTimeout(() => setAutocompleteJustAccepted(false), 150);
  }, []);

  const showAutocomplete =
    agentAutocomplete &&
    inputFocused &&
    autocompleteSuggestions.length > 0 &&
    !autocompleteJustAccepted;

  // Clamp selected index when suggestions change
  useEffect(() => {
    setAutocompleteSelectedIndex((i) =>
      Math.min(Math.max(0, i), autocompleteSuggestions.length - 1)
    );
  }, [autocompleteSuggestions.length]);

  return (
    <main className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8 md:py-16 overflow-hidden">
        {/* Welcome Section */}
        {messages.length === 0 && !streaming && !conversationLoading && (
          <div className="flex flex-col items-center gap-8 text-center mb-28 flex-shrink-0">
            {/* Debug Mode Header */}
            {debugMode ? (
              <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Silicon Debug Assistant
                </h1>
                <p className="text-muted-foreground max-w-lg">
                  I can help analyze Verilog, VHDL, and SystemVerilog code, identify bugs, 
                  check timing issues, and review your RTL designs.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <h1 className="text-2xl font-semibold text-foreground">
                  Hello! How can I help you today?
                </h1>
                <p className="text-muted-foreground max-w-lg">
                  Ask me anything, and I'll search the web to give you the best answer.
                </p>
              </div>
            )}

            {/* Debug Mode Toggle */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Bug className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="debug-mode" className="text-sm font-medium cursor-pointer">
                Debug Mode
              </Label>
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
            </div>

            {/* Quick Debug Prompts - Only show in debug mode */}
            {debugMode && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-[700px] px-2">
                {QUICK_PROMPTS.slice(0, 6).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    onClick={() => handleSuggestionClick(prompt.prompt)}
                    className="h-auto py-3 px-4 flex flex-col items-start gap-1 text-left"
                  >
                    <span className="text-xs font-semibold">{prompt.label}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {prompt.prompt.slice(0, 50)}...
                    </span>
                  </Button>
                ))}
              </div>
            )}
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-w-[600px] px-2">
              {SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {conversationLoading && messages.length === 0 && (
          <ScrollArea className="flex-1 w-full mb-16 min-h-0">
            <div className="flex flex-col gap-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Chat Messages */}
        {!conversationLoading && messages.length > 0 && (
          <ScrollArea className="flex-1 w-full mb-8 md:mb-16 min-h-0">
            <div className="flex flex-col gap-8 md:gap-16">
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
                      // Reload conversation
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
                  onRegenerate={async (id) => {
                    // Find the message and regenerate from that point
                    const messageIndex = messages.findIndex(m => m.id === id);
                    if (messageIndex === -1) return;
                    
                    // Get all messages up to this point
                    const messagesUpTo = messages.slice(0, messageIndex);
                    const lastUserMessage = messagesUpTo.reverse().find(m => m.role === "user");
                    
                    if (!lastUserMessage || !selectedModel) {
                      toast({
                        title: "Error",
                        description: "Cannot regenerate: no user message found",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    // Remove messages from this point forward
                    setMessagesDisplay(prev => prev.slice(0, messageIndex));
                    
                    // Determine model to use (respect MAX Mode and Auto Mode)
                    let modelToUseForRegen = selectedModel;
                    if (maxMode && hasPremiumAccess && availableModels.length > 0) {
                      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
                      const highestQualityModel = getHighestQualityModel(modelsWithAvailable);
                      if (highestQualityModel) {
                        const foundModel = availableModels.find(m => m.id === highestQualityModel.id);
                        if (foundModel) {
                          modelToUseForRegen = foundModel;
                        }
                      }
                    } else if (autoMode && availableModels.length > 0) {
                      const modelsWithAvailable = availableModels.map(m => ({ ...m, available: true }));
                      const bestModel = getBestModelForQuery(lastUserMessage.content, modelsWithAvailable);
                      if (bestModel) {
                        const foundModel = availableModels.find(m => m.id === bestModel.id);
                        if (foundModel) {
                          modelToUseForRegen = foundModel;
                        }
                      }
                    }

                    // Regenerate
                    try {
                      await streamMessage(
                        currentConversation!.id,
                        lastUserMessage.content,
                        modelToUseForRegen.id,
                        modelToUseForRegen.provider,
                        selectedSources, // Pass selected sources
                        maxMode && hasPremiumAccess, // Pass MAX Mode flag
                        useMultipleModels && hasPremiumAccess, // Pass Multiple Models flag
                        (chunk: string) => {
                          streamingMessageRef.current += chunk;
                          const assistantMessageId = `assistant-${Date.now()}`;
                          setMessagesDisplay(prev => {
                            const existing = prev.find(m => m.id === assistantMessageId);
                            if (existing) {
                              return prev.map(m => 
                                m.id === assistantMessageId 
                                  ? { ...m, content: streamingMessageRef.current }
                                  : m
                              );
                            }
                            return [...prev, {
                              id: assistantMessageId,
                              role: "assistant" as const,
                              content: streamingMessageRef.current,
                              model: selectedModel,
                            }];
                          });
                        },
                        async () => {
                          if (currentConversation) {
                            const response = await fetch(
                              `/api/conversations/${currentConversation.id}`,
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
                      toast({
                        title: "Error",
                        description: error.message || "Failed to regenerate",
                        variant: "destructive",
                      });
                    }
                  }}
                  onDelete={async (id) => {
                    try {
                      const response = await fetch(`/api/messages/${id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      if (!response.ok) throw new Error("Failed to delete message");
                      // Reload conversation
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
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse-subtle" />
                  </div>
                  <Card className="flex-1 bg-muted/50 border-border/50 rounded-lg px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="typing-indicator text-primary">●</span>
                      <span className="typing-indicator text-primary">●</span>
                      <span className="typing-indicator text-primary">●</span>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

            {/* Input Container */}
            <div className="w-full flex-shrink-0 pt-4">
              <Card className="bg-muted border border-border rounded-[var(--radius)] p-3">
                <div className="flex flex-col gap-2">
                  {/* File Preview */}
                  {selectedFiles.length > 0 && (
                    <FilePreview 
                      files={selectedFiles} 
                      onRemove={removeFile}
                      uploadingFiles={uploadingFiles}
                      uploadedUrls={uploadedFileUrls}
                    />
                  )}

                  {/* Text Input with contextual autocomplete */}
                  <div className="flex items-center gap-2 relative">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setCharCount(e.target.value.length);
                        setAutocompleteSelectedIndex(0);
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => {
                        // Allow click on suggestion before blur fires
                        setTimeout(() => setInputFocused(false), 150);
                      }}
                      onKeyDown={(e) => {
                        if (showAutocomplete) {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setAutocompleteSelectedIndex((i) =>
                              Math.min(i + 1, autocompleteSuggestions.length - 1)
                            );
                            return;
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setAutocompleteSelectedIndex((i) => Math.max(0, i - 1));
                            return;
                          }
                          if (e.key === "Enter" || e.key === "Tab") {
                            e.preventDefault();
                            const suggestion = autocompleteSuggestions[autocompleteSelectedIndex];
                            if (suggestion) acceptAutocomplete(suggestion);
                            return;
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setInputFocused(false);
                            return;
                          }
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent border-none resize-none text-base leading-6 text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[200px]"
                      rows={1}
                      aria-autocomplete="list"
                      aria-controls={showAutocomplete ? "agent-autocomplete-list" : undefined}
                      aria-expanded={showAutocomplete}
                      aria-activedescendant={
                        showAutocomplete && autocompleteSuggestions[autocompleteSelectedIndex]
                          ? `agent-autocomplete-option-${autocompleteSelectedIndex}`
                          : undefined
                      }
                    />
                    {showAutocomplete && (
                      <div
                        id="agent-autocomplete-list"
                        role="listbox"
                        aria-label="Contextual suggestions"
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                      >
                        {autocompleteSuggestions.map((suggestion, idx) => (
                          <button
                            key={`${idx}-${suggestion.slice(0, 30)}`}
                            id={`agent-autocomplete-option-${idx}`}
                            role="option"
                            aria-selected={idx === autocompleteSelectedIndex ? "true" : "false"}
                            type="button"
                            className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                              idx === autocompleteSelectedIndex
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-muted"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              acceptAutocomplete(suggestion);
                            }}
                          >
                            <span className="line-clamp-2">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf,text/*,.doc,.docx"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        aria-label="Upload files"
                      />
                      <SourceSelector
                        selectedSources={selectedSources}
                        onSourcesChange={setSelectedSources}
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
                        disabled={uploadingFiles.size > 0}
                      >
                        <Plus className="h-5 w-5" />
                        Attach
                      </Button>
                      
                      <GitHubRepoSelector
                        selected={selectedRepository}
                        onSelect={setSelectedRepository}
                      />
                      
                      {availableModels.length > 0 && (
                        <ModelSelector
                          models={availableModels}
                          selected={selectedModel}
                          onSelect={(model) => {
                            setSelectedModel(model);
                            localStorage.setItem("selected-llm-model", JSON.stringify(model));
                          }}
                          hasPremiumAccess={hasPremiumAccess}
                          autoMode={autoMode}
                          maxMode={maxMode}
                          onAutoModeChange={setAutoMode}
                          onMaxModeChange={(enabled) => {
                            if (enabled && !hasPremiumAccess) {
                              toast({
                                title: "Premium Feature",
                                description: "MAX Mode requires a premium subscription. Please upgrade to access this feature.",
                                action: (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.location.href = "/overview"}
                                  >
                                    Upgrade
                                  </Button>
                                ),
                              });
                              return;
                            }
                            setMaxMode(enabled);
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {charCount > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {charCount}/1000
                        </span>
                      )}
                      <Button
                        onClick={handleSend}
                        disabled={(!inputValue.trim() && selectedFiles.length === 0) || streaming || !selectedModel}
                        className="rounded-full"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
      </main>
    );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
