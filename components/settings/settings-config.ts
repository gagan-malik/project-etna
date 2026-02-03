import type { LucideIcon } from "lucide-react";
import {
  Settings,
  Infinity,
  ArrowRight,
  Box,
  Cloud,
  Wrench,
  FileText,
  ScrollText,
  Bot,
  Link2,
  Database,
  FlaskConical,
  BookOpen,
} from "lucide-react";

export interface SettingsSectionDef {
  id: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
  separatorBefore?: boolean;
}

/**
 * Full IA for Cursor-like settings. Matches docs/product/SETTINGS_PLAN.md.
 */
export const SETTINGS_SECTIONS: SettingsSectionDef[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "agents", label: "Agents", icon: Infinity },
  { id: "tab", label: "Tab", icon: ArrowRight },
  { id: "models", label: "Models", icon: Box },
  { id: "cloud-agents", label: "Cloud Agents", icon: Cloud, separatorBefore: true },
  { id: "tools-mcp", label: "Tools & MCP", icon: Wrench },
  { id: "rules", label: "Rules", icon: FileText, separatorBefore: true },
  { id: "skills", label: "Skills", icon: ScrollText },
  { id: "workers", label: "Workers", icon: Bot },
  { id: "hooks", label: "Hooks", icon: Link2 },
  { id: "indexing-docs", label: "Indexing & Docs", icon: Database },
  { id: "beta", label: "Beta", icon: FlaskConical },
  { id: "docs", label: "Documentation", icon: BookOpen, external: true, separatorBefore: true },
];

export const DEFAULT_SECTION = "general";

export function getSectionById(id: string) {
  return SETTINGS_SECTIONS.find((s) => s.id === id);
}

export function isPaidPlan(plan: string | null | undefined): boolean {
  return plan !== null && plan !== undefined && plan !== "free";
}
