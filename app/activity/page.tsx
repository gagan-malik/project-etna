"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Heart, MoreVertical, MessageSquare, Trash2, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string | null;
  userId: string;
  spaceId: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Array<{
    id: string;
    content: string;
    role: string;
    createdAt: string;
  }>;
}

export default function ActivityPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "favorites">("all");
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("day");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Load conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/conversations", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [toast]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorite-conversations");
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorite-conversations", JSON.stringify(Array.from(newFavorites)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      toast({
        title: "Success",
        description: "Conversation deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const handleConversationClick = (id: string) => {
    router.push(`/chat?conversation=${id}`);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getMessagePreview = (conversation: Conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[0];
      return lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? "..." : "");
    }
    return "No messages yet";
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filterType === "favorites" && !favorites.has(conv.id)) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = conv.title?.toLowerCase().includes(query);
      const contentMatch = getMessagePreview(conv).toLowerCase().includes(query);
      if (!titleMatch && !contentMatch) return false;
    }
    
    return true;
  });

  // Sort by updatedAt (most recent first)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold leading-8 text-foreground mb-1">
            History
          </h1>
          <p className="text-sm font-normal leading-5 text-muted-foreground">
            View and manage your recent activity
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-4 flex-wrap">
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="favorites">Favourites</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as typeof timeFilter)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
              <p className="text-xs text-muted-foreground">
                Start a new conversation to see it here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="p-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">
                          {conversation.title || "Untitled Conversation"}
                        </h3>
                        {conversation.messages && conversation.messages.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {conversation.messages.length} message{conversation.messages.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {getMessagePreview(conversation)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatTimestamp(conversation.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(conversation.id);
                        }}
                        className={favorites.has(conversation.id) ? "text-primary" : ""}
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(conversation.id) ? "fill-current" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(conversation.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </main>
  );
}
