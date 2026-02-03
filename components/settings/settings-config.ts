import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  User,
  Infinity,
  ArrowRight,
  Box,
  Cloud,
  ChartNoAxesColumn,
  CreditCard,
  Wrench,
  FileText,
  ScrollText,
  Bot,
  Link2,
  Database,
  FlaskConical,
  BookOpen,
  Mail,
} from "lucide-react";

export interface SettingsSectionDef {
  id: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
  separatorBefore?: boolean;
  /** Group label for sidebar categorization (same value = same group, separator between groups) */
  group?: string;
}

/** Group order for sidebar; groups not listed appear after in definition order. */
export const SETTINGS_GROUP_ORDER = [
  "Core",
  "Integrations",
  "Billing & Usage",
  "Rules & Automation",
  "Data & Beta",
  "Support",
] as const;

/**
 * Full IA for Cursor-like settings. Matches docs/product/SETTINGS_PLAN.md.
 * Sections are grouped for sidebar: Core, Integrations, Billing & Usage, Rules & Automation, Data & Beta, Support.
 */
export const SETTINGS_SECTIONS: SettingsSectionDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "Core" },
  { id: "general", label: "General", icon: Settings, group: "Core" },
  { id: "account", label: "Account", icon: User, group: "Core" },
  { id: "agents", label: "Agents", icon: Infinity, group: "Integrations" },
  { id: "tab", label: "Tab", icon: ArrowRight, group: "Integrations" },
  { id: "models", label: "Models", icon: Box, group: "Integrations" },
  { id: "cloud-agents", label: "Cloud Agents", icon: Cloud, group: "Integrations" },
  { id: "tools-mcp", label: "Tools & MCP", icon: Wrench, group: "Integrations" },
  { id: "usage", label: "Usage", icon: ChartNoAxesColumn, group: "Billing & Usage" },
  { id: "billing-invoices", label: "Billing & Invoices", icon: CreditCard, group: "Billing & Usage" },
  { id: "rules", label: "Rules", icon: FileText, group: "Rules & Automation" },
  { id: "skills", label: "Skills", icon: ScrollText, group: "Rules & Automation" },
  { id: "workers", label: "Workers", icon: Bot, group: "Rules & Automation" },
  { id: "hooks", label: "Hooks", icon: Link2, group: "Rules & Automation" },
  { id: "indexing-docs", label: "Indexing & Docs", icon: Database, group: "Data & Beta" },
  { id: "beta", label: "Beta", icon: FlaskConical, group: "Data & Beta" },
  { id: "docs", label: "Documentation", icon: BookOpen, external: true, group: "Support" },
  { id: "contact", label: "Contact us", icon: Mail, group: "Support" },
];

export const DEFAULT_SECTION = "general";

export function getSectionById(id: string) {
  return SETTINGS_SECTIONS.find((s) => s.id === id);
}

export function isPaidPlan(plan: string | null | undefined): boolean {
  return plan !== null && plan !== undefined && plan !== "free";
}
