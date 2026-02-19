import type { LucideIcon } from "lucide-react";
import {
  Bug,
  History,
  Settings,
  Home,
  Wrench,
  FileCode,
  Activity,
  FolderOpen,
} from "lucide-react";

/** Paths where sidebar and header are hidden (auth / onboarding). */
export const AUTH_PATHS = ["/login", "/signup", "/auth"] as const;

export function isAuthPath(pathname: string | null): boolean {
  return pathname != null && (AUTH_PATHS as readonly string[]).includes(pathname);
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  /** If true, open Settings modal instead of navigating. */
  openSettings?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const SIDEBAR_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Debug Assistant", url: "/chat", icon: Bug },
      { title: "Spaces", url: "/spaces", icon: FolderOpen },
      { title: "History", url: "/activity", icon: History },
      { title: "EDA Tools", url: "/integrations", icon: Wrench },
      { title: "Design Files", url: "/files", icon: FileCode },
      { title: "Waveforms", url: "/waveforms", icon: Activity },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", url: "/settings", icon: Settings, openSettings: true },
    ],
  },
];
