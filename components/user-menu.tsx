"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, User, LogOut, Copy, Settings, CreditCard, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { useSettingsModal } from "@/components/settings-modal-context";

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { openSettings } = useSettingsModal();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { updatePreferences } = useUserSettings();

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
    void updatePreferences({ theme: value });
  };
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Close when window loses focus so Cursor's "Select element" tool isn't blocked.
  useEffect(() => {
    const handleBlur = () => setOpen(false);
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  const handleCopyEmail = async () => {
    if (email) {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Email address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image || undefined} alt={name || "User"} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={image || undefined} alt={name || "User"} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name || "User"}</p>
              <div className="flex items-center gap-2">
                <p className="truncate text-xs leading-none text-muted-foreground">{email || "No email"}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 shrink-0"
                  onClick={handleCopyEmail}
                  title="Copy email"
                  aria-label="Copy email"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs text-muted-foreground">Theme</span>
          <div className="flex items-center gap-1">
            <Button
              variant={theme === "light" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={() => handleThemeChange("light")}
              title="Light mode"
              aria-label="Light mode"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={() => handleThemeChange("dark")}
              title="Dark mode"
              aria-label="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "system" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={() => handleThemeChange("system")}
              title="System"
              aria-label="Follow system"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openSettings("account")}>
          <User className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings("general")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings("billing-invoices")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings("contact")}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Contact Us</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

