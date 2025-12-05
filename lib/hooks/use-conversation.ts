/**
 * Hook for managing conversation state and API calls
 */

import { useState, useEffect, useCallback } from "react";

export interface Conversation {
  id: string;
  title: string | null;
  userId: string;
  spaceId: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string | null;
  provider: string | null;
  metadata: any;
  createdAt: string;
}

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load conversations");
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific conversation with messages
  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load conversation");
      const data = await response.json();
      setCurrentConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (title?: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title || "New Conversation" }),
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      const data = await response.json();
      const newConv = data.conversation;
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversation(newConv);
      setMessages([]);
      return newConv;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Switch to a different conversation
  const switchConversation = useCallback(
    async (conversationId: string) => {
      await loadConversation(conversationId);
    },
    [loadConversation]
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    loadConversation,
    createConversation,
    switchConversation,
    setMessages,
  };
}

