"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Copy, Heart, Plus, FolderOpen, Sparkles, Send, X } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { FilePreview } from "@/components/chat/file-preview";
import { GitHubRepoSelector } from "@/components/chat/github-repo-selector";
import { LLMModelSelector } from "@/components/chat/llm-model-selector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
}

const SUGGESTIONS = [
  "What's the latest news about AI?",
  "Explain quantum computing",
  "Best practices for React",
];

const AVAILABLE_MODELS = [
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", category: "General" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", category: "General" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", category: "General" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", category: "General" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", category: "General" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", category: "Open Source" },
  { id: "llama-3-8b", name: "Llama 3 8B", provider: "Meta", category: "Open Source" },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", provider: "Mistral AI", category: "Open Source" },
  { id: "code-llama-70b", name: "Code Llama 70B", provider: "Meta", category: "Code" },
  { id: "deepseek-coder", name: "DeepSeek Coder", provider: "DeepSeek", category: "Code" },
  { id: "verilog-llm", name: "Verilog LLM", provider: "Specialized", category: "Verification" },
  { id: "systemverilog-llm", name: "SystemVerilog LLM", provider: "Specialized", category: "Verification" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved preferences
  useEffect(() => {
    const savedModel = localStorage.getItem("selected-llm-model");
    if (savedModel) {
      try {
        const model = JSON.parse(savedModel);
        setSelectedModel(model);
      } catch (e) {
        console.error("Error loading saved model:", e);
      }
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      files: [...selectedFiles],
      repository: selectedRepository,
      model: selectedModel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedFiles([]);
    setCharCount(0);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateResponse(inputValue, selectedModel),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string, model: typeof AVAILABLE_MODELS[0] | null): string => {
    const modelName = model?.name || "Default Model";
    return `Based on your question "${query}", here's what I found using ${modelName}:

This is a simulated response. In a real implementation, this would connect to the selected AI model service for silicon verification and code analysis.

**Key Features:**
• Model-specific silicon verification capabilities
• Code analysis and hardware description language (HDL) support
• Source code understanding from GitHub repositories
• Context-aware responses based on selected model

The selected model provides specialized capabilities for verification tasks.`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <main className="flex-1 flex flex-col items-center w-full max-w-[var(--width-xl)] mx-auto px-[var(--spacing-xl)] py-[var(--spacing-4xl)] overflow-hidden">
        {/* Welcome Section */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center gap-[var(--spacing-3xl)] text-center mb-[var(--spacing-7xl)] flex-shrink-0">
            <div className="flex flex-col gap-[var(--spacing-xl)] items-center">
              <h1 className="text-[24px] font-semibold leading-[32px] text-[var(--colours-text-text-primary-900)]">
                👋🏽 Hello! How can I help you today?
              </h1>
              <p className="text-[18px] font-medium leading-[28px] text-[var(--colours-text-text-secondary-700)]">
                Ask me anything, and I'll search the web to give you the best answer.
              </p>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-[var(--spacing-lg)] justify-center max-w-[600px]">
              {SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-[var(--spacing-xl)] py-[var(--spacing-lg)] rounded-[var(--radius-5xl)] bg-[var(--component-colors-utility-gray-utility-gray-100)] text-[14px] font-medium text-[var(--colours-text-text-secondary-700)] hover:bg-[var(--component-colors-utility-gray-utility-gray-200)]"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <ScrollArea className="flex-1 w-full mb-[var(--spacing-4xl)] min-h-0">
            <div className="flex flex-col gap-[var(--spacing-4xl)]">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex gap-[var(--spacing-lg)]">
                  <div className="w-8 h-8 rounded-[var(--radius-full)] bg-[var(--component-colors-utility-gray-utility-gray-200)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-[var(--colours-text-text-secondary-700)]" />
                  </div>
                  <Card className="flex-1 bg-[var(--component-colors-utility-gray-utility-gray-100)] rounded-[var(--radius-2xl)] px-[var(--spacing-xl)] py-[var(--spacing-lg)]">
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
        <div className="w-full flex-shrink-0 pt-[var(--spacing-xl)]">
          <Card className="bg-[var(--component-colors-utility-gray-utility-gray-100)] border border-[var(--colours-border-border-primary)] rounded-[var(--radius-5xl)] p-[var(--spacing-xl)]">
            <div className="flex flex-col gap-[var(--spacing-md)]">
              {/* File Preview */}
              {selectedFiles.length > 0 && (
                <FilePreview files={selectedFiles} onRemove={removeFile} />
              )}

              {/* Text Input */}
              <div className="flex items-center gap-[var(--spacing-md)]">
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
                  className="flex-1 bg-transparent border-none resize-none text-[16px] leading-[24px] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)] min-h-[24px] max-h-[200px]"
                  rows={1}
                />
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[var(--spacing-md)]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-[var(--spacing-xs)] text-[14px] font-semibold text-[var(--component-colors-components-buttons-tertiary-button-tertiary-fg)]"
                  >
                    <Plus className="h-5 w-5" />
                    Attach
                  </Button>
                  
                  <GitHubRepoSelector
                    selected={selectedRepository}
                    onSelect={setSelectedRepository}
                  />
                  
                  <LLMModelSelector
                    models={AVAILABLE_MODELS}
                    selected={selectedModel}
                    onSelect={(model) => {
                      setSelectedModel(model);
                      localStorage.setItem("selected-llm-model", JSON.stringify(model));
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-[var(--spacing-lg)]">
                  {charCount > 0 && (
                    <span className="text-[14px] text-[var(--colours-text-text-tertiary-600)]">
                      {charCount}/1000
                    </span>
                  )}
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() && selectedFiles.length === 0}
                    className="bg-[var(--component-colors-components-buttons-primary-button-primary-bg)] hover:bg-[var(--component-colors-components-buttons-primary-button-primary-bg_hover)] rounded-[var(--radius-full)]"
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
