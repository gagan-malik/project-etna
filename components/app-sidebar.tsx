"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Bug, 
  History, 
  Settings, 
  Home, 
  Cpu,
  User,
  CreditCard,
  HelpCircle,
  Plus,
  Loader2,
  Wrench,
  FileCode,
  Activity,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSettingsModal } from "@/components/settings-modal-context";
import { SettingsDialog } from "@/components/settings-dialog";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Debug Assistant",
        url: "/chat",
        icon: Bug,
      },
      {
        title: "Debug Sessions",
        url: "/activity",
        icon: History,
      },
      {
        title: "EDA Tools",
        url: "/integrations",
        icon: Wrench,
      },
      {
        title: "Design Files",
        url: "/files",
        icon: FileCode,
      },
      {
        title: "Waveforms",
        url: "/waveforms",
        icon: Activity,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
      },
      {
        title: "Account",
        url: "/account",
        icon: User,
      },
    ],
  },
];

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
  messages?: Array<{ id: string }>;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { open: settingsOpen, setOpen: setSettingsOpen } = useSettingsModal();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Get user initials
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Extract conversation ID from URL if on chat page
  useEffect(() => {
    if (pathname === "/chat") {
      const params = new URLSearchParams(window.location.search);
      const convId = params.get("conversation");
      setCurrentConversationId(convId);
    } else {
      setCurrentConversationId(null);
    }
  }, [pathname]);

  // Load conversations
  useEffect(() => {
    if (pathname === "/chat" || pathname === "/activity") {
      const loadConversations = async () => {
        try {
          setLoadingConversations(true);
          const response = await fetch("/api/conversations", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setConversations(data.conversations || []);
          }
        } catch (error) {
          console.error("Failed to load conversations:", error);
        } finally {
          setLoadingConversations(false);
        }
      };
      loadConversations();
    }
  }, [pathname]);

  const handleNewChat = () => {
    router.push("/chat");
  };

  const handleConversationClick = (id: string) => {
    router.push(`/chat?conversation=${id}`);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cpu className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Silicon Debug</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Project Etna
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* New Debug Session Button - Show on chat page */}
        {pathname === "/chat" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleNewChat} tooltip="New Debug Session">
                    <Plus className="h-4 w-4" />
                    <span>New Debug Session</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Debug Sessions List - Show on chat page */}
        {pathname === "/chat" && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Debug Sessions</SidebarGroupLabel>
            <SidebarGroupContent>
              {loadingConversations ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No debug sessions yet
                </div>
              ) : (
                <SidebarMenu>
                  {conversations.slice(0, 10).map((conv) => (
                    <SidebarMenuItem key={conv.id}>
                      <SidebarMenuButton
                        onClick={() => handleConversationClick(conv.id)}
                        isActive={currentConversationId === conv.id}
                        tooltip={conv.title || "Untitled Debug Session"}
                        className="w-full"
                      >
                        <Bug className="h-4 w-4" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="truncate text-sm">
                            {conv.title || "Untitled Debug Session"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(conv.updatedAt)}
                            {conv.messages && conv.messages.length > 0 && (
                              <> • {conv.messages.length} msg</>
                            )}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = 
                    pathname === item.url || 
                    (item.url !== "/" && pathname?.startsWith(item.url));
                  
                  // Handle Settings as a dialog instead of navigation
                  if (item.title === "Settings") {
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton 
                          onClick={() => setSettingsOpen(true)}
                          isActive={settingsOpen}
                          tooltip={item.title}
                        >
                          <Icon />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/account">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session?.user?.email || "No email"}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SettingsDialog
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      session={session}
      status={sessionStatus}
    />
    </>
  );
}

