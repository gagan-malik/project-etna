"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Heart, Sparkles, FolderOpen, Edit2, RotateCw, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
  createdAt?: string;
}

interface ChatMessageProps {
  message: Message;
  onEdit?: (id: string, newContent: string) => Promise<void>;
  onRegenerate?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function ChatMessage({ message, onEdit, onRegenerate, onDelete }: ChatMessageProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = async () => {
    if (!onEdit) return;
    setIsSaving(true);
    try {
      await onEdit(message.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm("Are you sure you want to delete this message?")) return;
    try {
      await onDelete(message.id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    try {
      await onRegenerate(message.id);
    } catch (error) {
      console.error("Error regenerating message:", error);
    }
  };

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (message.role === "user") {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-sm text-muted-foreground">U</span>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Card className="bg-secondary rounded-xl px-4 py-3">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditContent(message.content);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              message.content && (
                <p className="text-base leading-6 text-foreground whitespace-pre-wrap">
                  {message.content}
                </p>
              )
            )}
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Array.from(message.files).map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    {file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {(message.repository || message.model) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.repository && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    {message.repository}
                  </Badge>
                )}
                {message.model && (
                  <Badge variant="outline">
                    {message.model.name}
                  </Badge>
                )}
              </div>
            )}
          </Card>
          {!isEditing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {formatTimestamp(message.createdAt) && (
                <span>{formatTimestamp(message.createdAt)}</span>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-auto p-0 text-xs"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-auto p-0 text-xs text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 chat-message">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Card className="bg-secondary rounded-xl px-4 py-3">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }: any) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                h1: ({ children }: any) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }: any) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                h3: ({ children }: any) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </Card>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {formatTimestamp(message.createdAt) && (
            <span>{formatTimestamp(message.createdAt)}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-3 w-3 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLiked(!liked)}
            className={`h-auto p-0 text-xs font-medium ${
              liked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-3 w-3 mr-1 ${liked ? "fill-current" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          )}
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>⋯</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
