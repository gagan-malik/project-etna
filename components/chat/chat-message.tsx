"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Heart, Sparkles, FolderOpen } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: File[];
  repository?: string | null;
  model?: { id: string; name: string; provider: string; category: string } | null;
}

export function ChatMessage({ message }: { message: Message }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-sm text-muted-foreground">U</span>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Card className="bg-secondary rounded-xl px-4 py-3">
            {message.content && (
              <p className="text-base leading-6 text-foreground whitespace-pre-wrap">
                {message.content}
              </p>
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
          <p className="text-base leading-6 text-foreground whitespace-pre-wrap">
            {message.content}
          </p>
        </Card>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-auto p-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLiked(!liked)}
            className={`h-auto p-0 text-sm font-medium ${
              liked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>
        </div>
      </div>
    </div>
  );
}
