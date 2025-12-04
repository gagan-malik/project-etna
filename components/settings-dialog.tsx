"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Palette, 
  Globe, 
  Keyboard, 
  MessageCircle, 
  Video, 
  Lock, 
  Settings as SettingsIcon,
  User,
  CreditCard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsSections: SettingsSection[] = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "messages", label: "Messages & Media", icon: MessageCircle },
  { id: "language", label: "Language & Region", icon: Globe },
  { id: "accessibility", label: "Accessibility", icon: Keyboard },
  { id: "audio", label: "Audio & Video", icon: Video },
  { id: "privacy", label: "Privacy & Security", icon: Lock },
  { id: "account", label: "Account", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "advanced", label: "Advanced", icon: SettingsIcon },
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SettingsSidebar({ 
  activeSection, 
  setActiveSection 
}: { 
  activeSection: string; 
  setActiveSection: (section: string) => void;
}) {
  return (
    <Sidebar collapsible="none" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      isActive={activeSection === section.id}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon />
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState("notifications");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
  });
  const [appearance, setAppearance] = useState({
    theme: "system",
    compact: false,
  });
  const [messages, setMessages] = useState({
    autoDownload: true,
    previewLinks: true,
    showReadReceipts: true,
  });
  const [language, setLanguage] = useState("en");
  const [accessibility, setAccessibility] = useState({
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
  });

  const activeSectionData = settingsSections.find((s) => s.id === activeSection);
  const ActiveIcon = activeSectionData?.icon || SettingsIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <ActiveIcon className="h-5 w-5" />
            {activeSectionData?.label || "Settings"}
          </DialogTitle>
          <DialogDescription>
            Manage your {activeSectionData?.label.toLowerCase() || "settings"} preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about updates and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, sms: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and updates
                        </p>
                      </div>
                      <Switch
                        id="marketing-notifications"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, marketing: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                      Customize the appearance of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={appearance.theme}
                        onValueChange={(value) =>
                          setAppearance({ ...appearance, theme: value })
                        }
                      >
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a more compact layout
                        </p>
                      </div>
                      <Switch
                        id="compact-mode"
                        checked={appearance.compact}
                        onCheckedChange={(checked) =>
                          setAppearance({ ...appearance, compact: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label>Theme Toggle</Label>
                      <ThemeToggle />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Messages & Media Section */}
              {activeSection === "messages" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Messages & Media</CardTitle>
                    <CardDescription>
                      Configure how messages and media are handled
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-download">Auto-download Media</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically download media files in messages
                        </p>
                      </div>
                      <Switch
                        id="auto-download"
                        checked={messages.autoDownload}
                        onCheckedChange={(checked) =>
                          setMessages({ ...messages, autoDownload: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="preview-links">Link Previews</Label>
                        <p className="text-sm text-muted-foreground">
                          Show previews for links in messages
                        </p>
                      </div>
                      <Switch
                        id="preview-links"
                        checked={messages.previewLinks}
                        onCheckedChange={(checked) =>
                          setMessages({ ...messages, previewLinks: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="read-receipts">Read Receipts</Label>
                        <p className="text-sm text-muted-foreground">
                          Let others know when you've read their messages
                        </p>
                      </div>
                      <Switch
                        id="read-receipts"
                        checked={messages.showReadReceipts}
                        onCheckedChange={(checked) =>
                          setMessages({ ...messages, showReadReceipts: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Language & Region Section */}
              {activeSection === "language" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>
                      Set your preferred language and regional settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={language}
                        onValueChange={setLanguage}
                      >
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">EST (UTC-5)</SelectItem>
                          <SelectItem value="pst">PST (UTC-8)</SelectItem>
                          <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accessibility Section */}
              {activeSection === "accessibility" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                    <CardDescription>
                      Customize accessibility features to improve your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-motion">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={accessibility.reducedMotion}
                        onCheckedChange={(checked) =>
                          setAccessibility({ ...accessibility, reducedMotion: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-contrast">High Contrast</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={accessibility.highContrast}
                        onCheckedChange={(checked) =>
                          setAccessibility({ ...accessibility, highContrast: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="screen-reader">Screen Reader Support</Label>
                        <p className="text-sm text-muted-foreground">
                          Optimize interface for screen readers
                        </p>
                      </div>
                      <Switch
                        id="screen-reader"
                        checked={accessibility.screenReader}
                        onCheckedChange={(checked) =>
                          setAccessibility({ ...accessibility, screenReader: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Section */}
              {activeSection === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy & Security Section */}
              {activeSection === "privacy" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                      Manage your privacy and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                      <Button>Update Password</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Default/Other Sections */}
              {!["notifications", "appearance", "messages", "language", "accessibility", "account", "privacy"].includes(activeSection) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{activeSectionData?.label || "Settings"}</CardTitle>
                    <CardDescription>
                      Configure your {activeSectionData?.label.toLowerCase() || "settings"} preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This section is coming soon. Check back later for more options.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

