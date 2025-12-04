"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Activity, Settings, Home, Sparkles } from "lucide-react";
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
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Main",
    items: [
      {
        label: "Home",
        href: "/",
        icon: Home,
      },
      {
        label: "Chat",
        href: "/chat",
        icon: MessageSquare,
      },
      {
        label: "History",
        href: "/activity",
        icon: Activity,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarHeader className="h-[72px] border-b border-border flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              AI Chat
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sidebarItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Link href={item.href}>
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
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

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              Workspace Name
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Free Plan
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

