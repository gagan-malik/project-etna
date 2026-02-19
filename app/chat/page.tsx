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
import { Copy, Heart, Plus, FolderOpen, Sparkles, Send, X, Loader2, Bug, Cpu, Zap, Bot, ChevronDown, FileText, MessageSquare, FileCode, GitBranch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/chat-message";
import { FilePreview } from "@/components/chat/file-preview";
import { GitHubRepoSelector } from "@/components/chat/github-repo-selector";
import { ModelSelector } from "@/components/chat/model-selector";
import { SourceSelector, type SourceType } from "@/components/chat/source-selector";
import { useConversation, type Message } from "@/lib/hooks/use-conversation";
import { useAIStream } from "@/lib/hooks/use-ai-stream";
import { useOrchestrationStream } from "@/lib/hooks/use-orchestration-stream";
import { getBestModelForQuery, getHighestQualityModel, getModelMetadata } from "@/lib/ai/model-ranking";
import { DEFAULT_CHAT_MODELS } from "@/lib/ai";
import type { ModelInfo } from "@/lib/ai/types";
import { hasPremiumAccess as checkPremiumAccess } from "@/lib/subscription";
import { useAuth } from "@clerk/nextjs";
import { QUICK_PROMPTS, getSystemPrompt } from "@/lib/ai/prompts/silicon-debug";
import { isHardwareDebugQuery } from "@/lib/ai/model-ranking";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { isSignedIn: hasSession } = useAuth();
  const { preferences, updatePreferences } = useUserSettings();
  const {
    conversations,
    currentConversation,
    messages: dbMessages,
    loading: conversationLoading,
    createConversation,
    loadConversation,
    setMessages,
  } = useConversation();
  const { streaming, streamMessage } = useAIStream();
  const {
    streaming: orchestrationStreaming,
    runState,
    streamOrchestration,
    resetRunState,
  } = useOrchestrationStream();

  const [orchestrationMode, setOrchestrationMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orchestration-mode");
      return saved === "true";
    }
    return false;
  });
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
  const autoMode = (hasSession && (preferences.autoMode as boolean | undefined) != null)
    ? (preferences.autoMode as boolean)
    : autoModeState;
  const maxMode = (hasSession && (preferences.maxMode as boolean | undefined) != null)
    ? (preferences.maxMode as boolean)
    : maxModeState;
  const useMultipleModels = (hasSession && (preferences.useMultipleModels as boolean | undefined) != null)
    ? (preferences.useMultipleModels as boolean)
    : useMultipleModelsState;
  const setAutoMode = useCallback((v: boolean) => {
    setAutoModeState(v);
    if (hasSession) void updatePreferences({ autoMode: v });
    if (typeof window !== "undefined") localStorage.setItem("auto-mode", String(v));
  }, [hasSession, updatePreferences]);
  const setMaxMode = useCallback((v: boolean) => {
    setMaxModeState(v);
    if (hasSession) void updatePreferences({ maxMode: v });
    if (typeof window !== "undefined") localStorage.setItem("max-mode", String(v));
  }, [hasSession, updatePreferences]);
  const setUseMultipleModels = useCallback((v: boolean) => {
    setUseMultipleModelsState(v);
    if (hasSession) void updatePreferences({ useMultipleModels: v });
    if (typeof window !== "undefined") localStorage.setItem("use-multiple-models", String(v));
  }, [hasSession, updatePreferences]);
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
  const [userCommands, setUserCommands] = useState<Array<{ id: string; name: string; slug: string; promptTemplate: string; showAsQuickAction: boolean }>>([]);
  const [workers, setWorkers] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [skillsForSlash, setSkillsForSlash] = useState<Array<{ id: string; name: string; description: string | null }>>([]);
  const [additionalSkillIdsForMessage, setAdditionalSkillIdsForMessage] = useState<string[]>([]);
  const [additionalSkillNames, setAdditionalSkillNames] = useState<Record<string, string>>({});
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [atMentionDocs, setAtMentionDocs] = useState<{ path: string; title: string }[]>([]);
  const [atMentionFiles, setAtMentionFiles] = useState<{ id: string; title: string; source?: string | null }[]>([]);
  const [atSelectedIndex, setAtSelectedIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>("");

  // Load commands, workers, and skills for slash menu (Skills / Subagents / Actions)
  useEffect(() => {
    if (!hasSession) {
      setUserCommands([]);
      setWorkers([]);
      setSkillsForSlash([]);
      return;
    }
    let cancelled = false;
    Promise.all([
      fetch("/api/commands", { credentials: "include" }).then((r) => (r.ok ? r.json() : { commands: [] })),
      fetch("/api/workers", { credentials: "include" }).then((r) => (r.ok ? r.json() : { workers: [] })),
      fetch("/api/skills", { credentials: "include" }).then((r) => (r.ok ? r.json() : { skills: [] })),
    ]).then(([cmdRes, workerRes, skillsRes]) => {
      if (cancelled) return;
      setUserCommands(Array.isArray(cmdRes.commands) ? cmdRes.commands : []);
      setWorkers(Array.isArray(workerRes.workers) ? workerRes.workers : []);
      const skills = Array.isArray(skillsRes.skills) ? skillsRes.skills : [];
      setSkillsForSlash(skills.map((s: { id: string; name: string; description?: string | null }) => ({ id: s.id, name: s.name, description: s.description ?? null })));
      setAdditionalSkillNames((prev) => {
        const next = { ...prev };
        skills.forEach((s: { id: string; name: string }) => {
          next[s.id] = s.name;
        });
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [hasSession]);

  // Load docs list for @-mention (public)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/docs/list")
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.docs)) setAtMentionDocs(data.docs);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load indexed documents (files) for @-mention when signed in
  useEffect(() => {
    if (!hasSession) {
      setAtMentionFiles([]);
      return;
    }
    let cancelled = false;
    fetch("/api/documents", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { documents: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.documents)) {
          setAtMentionFiles(
            data.documents.slice(0, 50).map((d: { id: string; title: string; source?: string | null }) => ({
              id: d.id,
              title: d.title,
              source: d.source,
            }))
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hasSession]);

  // Load premium access status
  useEffect(() => {
    const checkPremiumAccess = async () => {
      if (!hasSession) return;
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
  }, [hasSession]);

  // Load available models: from API when authenticated, static list for guests
  const enabledModelIds = (preferences.enabledModelIds as string[] | undefined) ?? [];
  const enabledModelIdsKey = enabledModelIds.join(",");
  useEffect(() => {
    if (!hasSession) {
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
  }, [hasSession, enabledModelIdsKey]);

  // Restrict reasoning models to paid users: recompute available list when premium status or enabled list changes
  useEffect(() => {
    if (!hasSession || allModels.length === 0) return;
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
  }, [hasSession, allModels, enabledModelIdsKey, hasPremiumAccess, selectedModel]);

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
    if (hasSession && (preferences.autoMode as boolean | undefined) != null) {
      setAutoModeState(preferences.autoMode as boolean);
    }
    if (hasSession && (preferences.maxMode as boolean | undefined) != null) {
      setMaxModeState(preferences.maxMode as boolean);
    }
    if (hasSession && (preferences.useMultipleModels as boolean | undefined) != null) {
      setUseMultipleModelsState(preferences.useMultipleModels as boolean);
    }
  }, [hasSession, preferences.autoMode, preferences.maxMode, preferences.useMultipleModels]);

  // Persist toggle states to localStorage (for guests)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auto-mode", String(autoMode));
      localStorage.setItem("max-mode", String(maxMode));
      localStorage.setItem("use-multiple-models", String(useMultipleModels));
      localStorage.setItem("debug-mode", String(debugMode));
      localStorage.setItem("orchestration-mode", String(orchestrationMode));
    }
  }, [autoMode, maxMode, useMultipleModels, debugMode, orchestrationMode]);

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

  // Slash autocomplete: Cursor-style Skills, Subagents, Actions (with descriptions)
  type SlashItem = {
    section: "Skills" | "Subagents" | "Actions" | "Modes";
    type: "skill" | "worker" | "command" | "orchestrate";
    id: string;
    slug: string;
    name: string;
    description: string;
  };
  const slashSuggestions = useMemo(() => {
    const raw = inputValue.trim();
    if (!raw.startsWith("/")) return [];
    const after = raw.slice(1).trim().toLowerCase();
    const match = (name: string, slug: string, desc: string) =>
      !after ||
      name.toLowerCase().includes(after) ||
      slug.toLowerCase().includes(after) ||
      desc.toLowerCase().includes(after);
    const list: SlashItem[] = [];
    if (match("Orchestration", "orchestrate", "Multi-agent pipeline")) {
      list.push({
        section: "Modes",
        type: "orchestrate",
        id: "orchestrate",
        slug: "orchestrate",
        name: "Orchestration",
        description: "Run multi-agent pipeline (classify, route, execute)",
      });
    }
    skillsForSlash.forEach((s) => {
      const desc = s.description || "";
      if (match(s.name, s.name.toLowerCase().replace(/\s+/g, "-"), desc)) {
        list.push({
          section: "Skills",
          type: "skill",
          id: s.id,
          slug: s.name.toLowerCase().replace(/\s+/g, "-"),
          name: s.name,
          description: desc.slice(0, 60) + (desc.length > 60 ? "…" : ""),
        });
      }
    });
    workers.forEach((w) => {
      if (match(w.name, w.slug, "")) {
        list.push({
          section: "Subagents",
          type: "worker",
          id: w.id,
          slug: w.slug,
          name: w.name,
          description: "Run this subagent for this message",
        });
      }
    });
    userCommands.forEach((c) => {
      const desc = c.promptTemplate.slice(0, 60) + (c.promptTemplate.length > 60 ? "…" : "");
      if (match(c.name, c.slug, c.promptTemplate)) {
        list.push({
          section: "Actions",
          type: "command",
          id: c.id,
          slug: c.slug,
          name: c.name,
          description: desc,
        });
      }
    });
    return list.slice(0, 15);
  }, [inputValue, skillsForSlash, workers, userCommands]);

  const showSlashAutocomplete = inputValue.startsWith("/") && slashSuggestions.length > 0;
  const acceptSlashSelection = useCallback(
    (item: SlashItem) => {
      if (item.type === "orchestrate") {
        setOrchestrationMode((v) => !v);
        const beforeSlash = inputValue.slice(0, inputValue.indexOf("/"));
        setInputValue(beforeSlash);
        setCharCount(beforeSlash.length);
        toast({
          title: !orchestrationMode ? "Orchestration on" : "Orchestration off",
          description: !orchestrationMode
            ? "Multi-agent pipeline will run for your next message"
            : "Using standard chat mode",
        });
      } else if (item.type === "skill") {
        setAdditionalSkillIdsForMessage((ids) =>
          ids.includes(item.id) ? ids : [...ids, item.id]
        );
        setAdditionalSkillNames((names) => ({ ...names, [item.id]: item.name }));
        const beforeSlash = inputValue.slice(0, inputValue.indexOf("/"));
        setInputValue(beforeSlash);
        setCharCount(beforeSlash.length);
      } else {
        setInputValue(`/${item.slug} `);
        setCharCount(item.slug.length + 2);
      }
      setSlashSelectedIndex(0);
    },
    [inputValue, orchestrationMode, toast]
  );
  const removeSkillFromMessage = useCallback((skillId: string) => {
    setAdditionalSkillIdsForMessage((ids) => ids.filter((id) => id !== skillId));
  }, []);
  const quickActionCommands = useMemo(
    () => userCommands.filter((c) => c.showAsQuickAction),
    [userCommands]
  );

  // @-mention: parse query after last @ and build flat list with sections
  const atMentionQuery = useMemo(() => {
    const i = inputValue.lastIndexOf("@");
    if (i === -1) return "";
    return inputValue.slice(i + 1).trim().toLowerCase();
  }, [inputValue]);

  const atMentionItems = useMemo(() => {
    const q = atMentionQuery;
    const match = (label: string, value: string) =>
      !q || label.toLowerCase().includes(q) || value.toLowerCase().includes(q);
    const out: { type: "doc" | "chat" | "file"; section: string; label: string; value: string; subtitle?: string }[] = [];
    atMentionDocs.forEach((d) => {
      if (match(d.title, d.path)) out.push({ type: "doc", section: "Docs", label: d.title, value: `@doc:${d.path}`, subtitle: d.path });
    });
    (conversations || []).slice(0, 20).forEach((c) => {
      const label = c.title || "Untitled chat";
      const value = `@chat:${c.id}`;
      if (match(label, value)) out.push({ type: "chat", section: "Past Chats", label, value, subtitle: "Chat" });
    });
    atMentionFiles.forEach((f) => {
      if (match(f.title, f.id)) out.push({ type: "file", section: "Files & Folders", label: f.title, value: `@file:${f.id}`, subtitle: f.source || "File" });
    });
    return out;
  }, [atMentionQuery, atMentionDocs, conversations, atMentionFiles]);

  const showAtMention = inputValue.includes("@") && !showSlashAutocomplete;
  const acceptAtMention = useCallback(
    (item: (typeof atMentionItems)[0]) => {
      const i = inputValue.lastIndexOf("@");
      if (i === -1) return;
      const before = inputValue.slice(0, i);
      const next = before + item.value + " ";
      setInputValue(next);
      setCharCount(next.length);
      setAtSelectedIndex(0);
      textareaRef.current?.focus();
    },
    [inputValue]
  );

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

  type SendPayload = { content?: string; expandedContent?: string; workerSlug?: string } | undefined;

  const handleSend = async (payload?: SendPayload) => {
    const rawContent = payload?.content ?? inputValue.trim();
    if (!rawContent && selectedFiles.length === 0 && !payload) return;

    if (!hasSession) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the AI.",
        variant: "destructive",
      });
      return;
    }

    // Resolve slash command or worker when not using explicit payload
    let content = rawContent;
    let expandedContent: string | undefined = payload?.expandedContent;
    let workerSlug: string | undefined = payload?.workerSlug;

    if (!payload && content.startsWith("/")) {
      const afterSlash = content.slice(1).trim();
      const firstSpace = afterSlash.indexOf(" ");
      const slug = firstSpace >= 0 ? afterSlash.slice(0, firstSpace) : afterSlash;
      const rest = firstSpace >= 0 ? afterSlash.slice(firstSpace + 1).trim() : "";

      const cmd = userCommands.find((c) => c.slug === slug);
      const worker = workers.find((w) => w.slug === slug);

      if (cmd) {
        expandedContent = cmd.promptTemplate.includes("{{user_input}}")
          ? cmd.promptTemplate.replace(/\{\{user_input\}\}/g, rest)
          : rest
            ? `${cmd.promptTemplate}\n${rest}`
            : cmd.promptTemplate;
      } else if (worker) {
        workerSlug = worker.slug;
        content = rest || content;
      } else if (slug) {
        toast({
          title: "Unknown command",
          description: `No command or worker "${slug}". Create one in Settings → Rules or Workers.`,
          variant: "destructive",
        });
        return;
      }
    }

    if (!content && !expandedContent && !workerSlug) return;

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
      const bestModel = getBestModelForQuery(content || expandedContent || "", modelsWithAvailable);
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

    // Add user message to UI immediately (show what user sent)
    const displayContent = payload?.content ?? inputValue.trim();
    const userMessage: MessageDisplay = {
      id: `user-${Date.now()}`,
      role: "user",
      content: displayContent,
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      repository: selectedRepository,
      model: modelToUse,
    };

    setMessagesDisplay((prev) => [...prev, userMessage]);
    if (!payload) {
      setInputValue("");
      setSelectedFiles([]);
      setCharCount(0);
    }

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
      if (!conversationId) {
        throw new Error("Conversation ID is missing");
      }

      if (orchestrationMode) {
        // Create user message in DB
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            conversationId,
            content: content || expandedContent || displayContent,
            role: "user",
            metadata: { orchestration: true },
          }),
        });

        resetRunState();
        const { finalOutput, runId } = await streamOrchestration(
          content || expandedContent || displayContent,
          {
            conversationId,
            spaceId: currentConversation?.spaceId ?? undefined,
            sources: selectedSources,
            model: modelToUse.id,
          },
          {
            onChunk: (chunk: string) => {
              streamingMessageRef.current += chunk;
              setMessagesDisplay((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: streamingMessageRef.current }
                    : msg
                )
              );
            },
          }
        );

        const assistantContent =
          finalOutput +
          (runId ? `\n\n[View run details](/orchestration/runs/${runId})` : "");

        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            conversationId,
            content: assistantContent,
            role: "assistant",
            metadata: runId ? { runId } : {},
          }),
        });

        setMessagesDisplay((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantContent }
              : msg
          )
        );

        if (currentConversation) {
          await loadConversation(conversationId);
        }
      } else {
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
            setAdditionalSkillIdsForMessage([]);
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
          },
          { workerSlug, expandedContent, additionalSkillIds: additionalSkillIdsForMessage.length > 0 ? additionalSkillIdsForMessage : undefined }
        );
      }
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
  useEffect(() => {
    setSlashSelectedIndex((i) => Math.min(Math.max(0, i), slashSuggestions.length - 1));
  }, [slashSuggestions.length]);
  useEffect(() => {
    setAtSelectedIndex((i) => Math.min(Math.max(0, i), atMentionItems.length - 1));
  }, [atMentionItems.length]);

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

            {/* Mode Toggles */}
            <div className="flex flex-wrap items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-3">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="orchestration-mode" className="text-sm font-medium cursor-pointer">
                  Orchestration
                </Label>
                <Switch
                  id="orchestration-mode"
                  checked={orchestrationMode}
                  onCheckedChange={setOrchestrationMode}
                />
              </div>
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

        {/* Orchestration Run Progress */}
        {runState.status === "running" && runState.runId && (
          <Card className="w-full max-w-3xl mx-auto mb-4 p-3 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Orchestration run</span>
              {runState.activeAgentId && (
                <Badge variant="secondary" className="text-xs">
                  {runState.activeAgentId}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {runState.tasks.map((t) => (
                <Badge
                  key={t.taskId || t.agentId}
                  variant={t.status === "running" ? "default" : t.status === "completed" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {t.agentId}
                  {t.status === "running" && "..."}
                  {t.status === "completed" && " ✓"}
                </Badge>
              ))}
            </div>
          </Card>
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

            {/* Quick actions (commands with showAsQuickAction) */}
            {quickActionCommands.length > 0 && (
              <div className="w-full flex-shrink-0 flex flex-wrap gap-2 pb-2">
                {quickActionCommands.map((cmd) => (
                  <Button
                    key={cmd.id}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() =>
                      handleSend({
                        content: cmd.name,
                        expandedContent:
                          cmd.promptTemplate.replace(/\{\{user_input\}\}/g, "").trim() || cmd.name,
                      })
                    }
                    disabled={streaming || !selectedModel}
                  >
                    {cmd.name}
                  </Button>
                ))}
              </div>
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

                  {/* Skills for this message (from / menu) */}
                  {additionalSkillIdsForMessage.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {additionalSkillIdsForMessage.map((skillId) => (
                        <Badge
                          key={skillId}
                          variant="secondary"
                          className="pl-2 pr-1 py-0.5 text-xs font-normal gap-1"
                        >
                          {additionalSkillNames[skillId] ?? "Skill"}
                          <button
                            type="button"
                            onClick={() => removeSkillFromMessage(skillId)}
                            className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                            aria-label={`Remove ${additionalSkillNames[skillId] ?? "skill"}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
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
                        setSlashSelectedIndex(0);
                        setAtSelectedIndex(0);
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => {
                        // Allow click on suggestion before blur fires
                        setTimeout(() => setInputFocused(false), 150);
                      }}
                      onKeyDown={(e) => {
                        if (showAtMention) {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setAtSelectedIndex((i) => Math.min(i + 1, Math.max(0, atMentionItems.length - 1)));
                            return;
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setAtSelectedIndex((i) => Math.max(0, i - 1));
                            return;
                          }
                          if (e.key === "Enter" || e.key === "Tab") {
                            e.preventDefault();
                            const item = atMentionItems[atSelectedIndex];
                            if (item) acceptAtMention(item);
                            return;
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            const i = inputValue.lastIndexOf("@");
                            if (i !== -1) setInputValue(inputValue.slice(0, i));
                            setAtSelectedIndex(0);
                            return;
                          }
                        }
                        if (showSlashAutocomplete) {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSlashSelectedIndex((i) =>
                              Math.min(i + 1, slashSuggestions.length - 1)
                            );
                            return;
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSlashSelectedIndex((i) => Math.max(0, i - 1));
                            return;
                          }
                          if (e.key === "Enter" || e.key === "Tab") {
                            e.preventDefault();
                            const sel = slashSuggestions[slashSelectedIndex];
                            if (sel) acceptSlashSelection(sel);
                            return;
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setInputValue("");
                            setSlashSelectedIndex(0);
                            return;
                          }
                        }
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
                    {showSlashAutocomplete && (
                      <div
                        role="listbox"
                        aria-label="Skills, Subagents, Actions"
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[320px] overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md min-w-[280px]"
                      >
                        {(() => {
                          let lastSection = "";
                          return slashSuggestions.map((item, idx) => {
                            const showSection = item.section !== lastSection;
                            if (showSection) lastSection = item.section;
                            return (
                              <div key={`${item.type}-${item.id}-${idx}`}>
                                {showSection && (
                                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 bg-muted/30">
                                    {item.section}
                                  </div>
                                )}
                                <button
                                  role="option"
                                  aria-selected={idx === slashSelectedIndex ? "true" : "false"}
                                  type="button"
                                  className={`w-full px-3 py-2 text-left text-sm flex flex-col gap-0.5 transition-colors ${
                                    idx === slashSelectedIndex
                                      ? "bg-accent text-accent-foreground"
                                      : "hover:bg-muted"
                                  }`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    acceptSlashSelection(item);
                                  }}
                                >
                                  <span className="font-medium">/{item.slug}</span>
                                  {item.description && (
                                    <span className="text-xs text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                    {showAtMention && (
                      <div
                        role="listbox"
                        aria-label="Reference docs, chats, or files"
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                      >
                        {atMentionItems.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                            No references found. Type to search docs, past chats, or files.
                          </div>
                        ) : (
                          atMentionItems.map((item, idx) => {
                            const Icon =
                              item.type === "doc"
                                ? FileText
                                : item.type === "chat"
                                  ? MessageSquare
                                  : FileCode;
                            return (
                              <button
                                key={`${item.type}-${item.value}`}
                                role="option"
                                aria-selected={idx === atSelectedIndex ? "true" : "false"}
                                type="button"
                                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                                  idx === atSelectedIndex
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-muted"
                                }`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  acceptAtMention(item);
                                }}
                              >
                                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium truncate block">{item.label}</span>
                                  {item.subtitle && (
                                    <span className="text-xs text-muted-foreground truncate block">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
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

                      {workers.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
                              disabled={streaming || !selectedModel}
                              aria-label="Run a worker"
                            >
                              <Bot className="h-4 w-4" />
                              Run worker
                              <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="min-w-[180px]">
                            {workers.map((w) => (
                              <DropdownMenuItem
                                key={w.id}
                                onSelect={() =>
                                  handleSend({
                                    content: inputValue.trim() || "Please proceed.",
                                    workerSlug: w.slug,
                                  })
                                }
                              >
                                <span className="font-medium">/{w.slug}</span>
                                <span className="text-muted-foreground ml-2 truncate">{w.name}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      
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
                        onClick={() => handleSend()}
                        disabled={(!inputValue.trim() && selectedFiles.length === 0) || streaming || orchestrationStreaming || !selectedModel}
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
