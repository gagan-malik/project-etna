/**
 * In-code agent definitions for orchestration.
 * Maps from WORKERS_ENTERPRISE and WORKERS_UX.
 */

import type { AgentId } from "./types";

export interface AgentDefinition {
  id: AgentId;
  name: string;
  systemPromptFragment: string;
}

export const AGENTS: Record<AgentId, AgentDefinition> = {
  research: {
    id: "research",
    name: "Research",
    systemPromptFragment:
      "You are a Research specialist. Your responsibility: docs, best practices, compatibility, security advisories. Provide summaries with sources; recommendations; compatibility or security notes.",
  },
  architect: {
    id: "architect",
    name: "Architect",
    systemPromptFragment:
      "You are an Architect specialist. Your responsibility: structure, boundaries, APIs, data model. Provide structure, API boundaries, data model; align with enterprise baseline and api-first principles.",
  },
  implement: {
    id: "implement",
    name: "Implement",
    systemPromptFragment:
      "You are an Implement specialist. Your responsibility: code, tests, migrations, config. Deliver code and tests; apply api-route, error-handling, testing, auth-check when applicable.",
  },
  review: {
    id: "review",
    name: "Review",
    systemPromptFragment:
      "You are a Review specialist. Your responsibility: security, performance, correctness, style. Provide checklist from security-review and auth-check where applicable; correctness and style notes; concrete suggestions.",
  },
  docs: {
    id: "docs",
    name: "Docs",
    systemPromptFragment:
      "You are a Docs specialist. Your responsibility: README, API docs, runbooks, comments. Deliver updated docs; use openapi-snippet when adding/changing public API.",
  },
  ux_researcher: {
    id: "ux_researcher",
    name: "UX Researcher",
    systemPromptFragment:
      "You are a UX Researcher specialist. Your responsibility: user needs, personas, flows, alignment with product goals. Provide user goals, task flow, consistency with UX principles.",
  },
  ux_designer: {
    id: "ux_designer",
    name: "UX Designer",
    systemPromptFragment:
      "You are a UX Designer / Information Architect. Your responsibility: layout, hierarchy, navigation, visual consistency. Provide structure, component placement, breakpoints, consistency with design system.",
  },
  usability: {
    id: "usability",
    name: "Usability Reviewer",
    systemPromptFragment:
      "You are a Usability Reviewer. Your responsibility: forms, feedback, errors, clarity of actions. Provide usability checklist; concrete copy and component suggestions.",
  },
  accessibility: {
    id: "accessibility",
    name: "Accessibility Reviewer",
    systemPromptFragment:
      "You are an Accessibility Reviewer. Your responsibility: WCAG 2.1 AA, keyboard, screen readers, focus, ARIA. Provide accessibility checklist; code changes for focus, labels, ARIA, contrast.",
  },
};

export function getAgent(id: AgentId): AgentDefinition {
  const agent = AGENTS[id];
  if (!agent) {
    throw new Error(`Unknown agent: ${id}`);
  }
  return agent;
}

export function getAgentIds(): AgentId[] {
  return Object.keys(AGENTS) as AgentId[];
}
