"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { User, Settings as SettingsIcon, Bell, Palette, LayoutGrid, Building2, Users, Plug, Shield, CreditCard, Receipt, UserPlus, Copy, Check, Home, Keyboard, Globe, MessageCircle, Paintbrush, Menu, Lock, Video, Link as LinkIcon } from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "preferences", label: "Preferences", icon: SettingsIcon },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "appearance", label: "Appearance", icon: Palette },
    ],
  },
  {
    title: "Organisation",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid },
      { id: "workspaces", label: "Workspaces", icon: Building2 },
      { id: "members", label: "Members", icon: Users },
      { id: "integrations", label: "Integrations", icon: Plug },
      { id: "security", label: "Security", icon: Shield },
    ],
  },
  {
    title: "Billing",
    items: [
      { id: "plan", label: "Your plan", icon: CreditCard },
      { id: "addons", label: "Add-ons", icon: CreditCard },
      { id: "payment", label: "Payment methods", icon: CreditCard },
      { id: "invoices", label: "Invoices", icon: Receipt },
      { id: "seats", label: "Manage seats", icon: UserPlus },
    ],
  },
];

// Sidebar-13 navigation items
const sidebarNav = [
  { name: "Notifications", icon: Bell },
  { name: "Navigation", icon: Menu },
  { name: "Home", icon: Home },
  { name: "Appearance", icon: Paintbrush },
  { name: "Messages & media", icon: MessageCircle },
  { name: "Language & region", icon: Globe },
  { name: "Accessibility", icon: Keyboard },
  { name: "Mark as read", icon: Check },
  { name: "Audio & video", icon: Video },
  { name: "Connected accounts", icon: LinkIcon },
  { name: "Privacy & visibility", icon: Lock },
  { name: "Advanced", icon: SettingsIcon },
];

function SettingsSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <Sidebar collapsible="none" className="hidden md:flex border-r border-border bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={activeTab === item.name}
                    onClick={() => setActiveTab(item.name)}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Messages & media");
  const [workspaceName, setWorkspaceName] = useState("ACME Corp");
  const [actionKey, setActionKey] = useState("ACM");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("xEch7CGihdnejks537282");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveSection = () => {
    return SETTINGS_SECTIONS.flatMap((section) => section.items).find(
      (item) => item.id === activeTab
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex flex-col">
        <main className="flex h-[calc(100vh-72px)] flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border">
            <div className="flex items-center gap-2 px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeTab}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
            {activeTab === "Messages & media" && (
              <div className="flex flex-col gap-12">
                <div>
                  <h2 className="text-xl font-semibold leading-8 text-foreground mb-1">
                    Messages & media settings
                  </h2>
                  <p className="text-sm font-normal leading-5 text-muted-foreground">
                    Configure your messages and media preferences
                  </p>
                </div>
                <Card className="bg-background border border-border rounded-2xl p-12">
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="aspect-video max-w-3xl rounded-xl bg-muted/50" />
                    ))}
                  </div>
                </Card>
              </div>
            )}
            {activeTab !== "Messages & media" && (
              <div className="flex flex-col gap-12">
                <div>
                  <h2 className="text-xl font-semibold leading-8 text-foreground mb-1">
                    {activeTab} settings
                  </h2>
                  <p className="text-sm font-normal leading-5 text-muted-foreground">
                    Configure your {activeTab.toLowerCase()} preferences
                  </p>
                </div>
                <Card className="bg-background border border-border rounded-2xl p-12">
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="aspect-video max-w-3xl rounded-xl bg-muted/50" />
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>
        </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
