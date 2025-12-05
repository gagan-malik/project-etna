"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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
import { Copy, Heart, Plus, FolderOpen, Sparkles, Send, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/chat/chat-message";
import { FilePreview } from "@/components/chat/file-preview";
import { GitHubRepoSelector } from "@/components/chat/github-repo-selector";
import { LLMModelSelector } from "@/components/chat/llm-model-selector";
import { SourceSelector, type SourceType } from "@/components/chat/source-selector";
import { useConversation, type Message } from "@/lib/hooks/use-conversation";
import { useAIStream } from "@/lib/hooks/use-ai-stream";

interface MessageDisplay {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
  createdAt?: string;
}

const SUGGESTIONS = [
  "What's the latest news about AI?",
  "Explain quantum computing",
  "Best practices for React",
];

function ChatPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
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
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>("");

  // Load available models from API
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch("/api/ai/models", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const models = data.models.map((m: any) => ({
            id: m.id,
            name: m.name,
            provider: m.provider,
            category: m.category,
          }));
          setAvailableModels(models);
          if (models.length > 0 && !selectedModel) {
            setSelectedModel(models[0]);
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
      model: selectedModel,
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
      model: selectedModel,
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
        selectedModel.id,
        selectedModel.provider,
        selectedSources, // Pass selected sources
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
    textareaRef.current?.focus();
  };

  return (
    <main className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8 md:py-16 overflow-hidden">
        {/* Welcome Section */}
        {messages.length === 0 && !streaming && !conversationLoading && (
          <div className="flex flex-col items-center gap-12 text-center mb-28 flex-shrink-0">
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-2xl font-semibold leading-8 text-foreground">
                👋🏽 Hello! How can I help you today?
              </h1>
              <p className="text-lg font-medium leading-7 text-foreground">
                Ask me anything, and I'll search the web to give you the best answer.
              </p>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-w-[600px] px-2">
              {SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 md:px-4 py-2 rounded-full bg-muted text-xs md:text-sm font-medium text-foreground hover:bg-muted/80"
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
                    
                    // Regenerate
                    try {
                      await streamMessage(
                        currentConversation!.id,
                        lastUserMessage.content,
                        selectedModel.id,
                        selectedModel.provider,
                        selectedSources, // Pass selected sources
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
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-foreground" />
                  </div>
                  <Card className="flex-1 bg-muted rounded-xl px-4 py-2">
                    <div className="flex gap-1">
                      <span className="typing-indicator">●</span>
                      <span className="typing-indicator">●</span>
                      <span className="typing-indicator">●</span>
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
              <Card className="bg-muted border border-border rounded-full md:rounded-full rounded-2xl p-3 md:p-4">
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

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none resize-none text-base leading-6 text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[200px]"
                  rows={1}
                />
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
                    <LLMModelSelector
                      models={availableModels}
                      selected={selectedModel}
                      onSelect={(model) => {
                        setSelectedModel(model);
                        localStorage.setItem("selected-llm-model", JSON.stringify(model));
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
