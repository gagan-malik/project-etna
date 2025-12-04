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
    <Sidebar collapsible="icon" className="border-r border-[var(--colours-border-border-primary)] bg-[var(--colours-background-bg-page-primary)]">
      <SidebarHeader className="h-[72px] border-b border-[var(--colours-border-border-primary)] flex items-center px-[var(--spacing-xl)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <div className="w-8 h-8 rounded-[var(--radius-full)] bg-[var(--colours-background-bg-quaternary)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[var(--colours-text-text-secondary-700)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-[var(--colours-text-text-secondary-700)] whitespace-nowrap">
              AI Chat
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sidebarItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-[12px] font-semibold text-[var(--colours-text-text-tertiary-600)] uppercase tracking-wider">
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
                        className="data-[active=true]:bg-[var(--colours-background-bg-active)] data-[active=true]:text-[var(--colours-text-text-primary-900)] text-[var(--colours-text-text-tertiary-600)] hover:bg-[var(--component-colors-utility-gray-utility-gray-100)] hover:text-[var(--colours-text-text-secondary-700)]"
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

      <SidebarFooter className="border-t border-[var(--colours-border-border-primary)] p-[var(--spacing-xl)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <div className="w-8 h-8 rounded-[var(--radius-full)] bg-[var(--component-colors-utility-gray-utility-gray-200)] flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--colours-text-text-primary-900)] truncate">
              Workspace Name
            </p>
            <p className="text-[12px] text-[var(--colours-text-text-tertiary-600)] truncate">
              Free Plan
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

