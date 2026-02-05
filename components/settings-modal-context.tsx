"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_SECTION = "overview";

interface SettingsModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSettings: (section?: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const SettingsModalContext = createContext<SettingsModalContextValue | null>(
  null
);

export function SettingsModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);
  const openSettings = useCallback((section?: string) => {
    if (section) setActiveSection(section);
    setOpen(true);
  }, []);
  const value: SettingsModalContextValue = {
    open,
    setOpen,
    openSettings,
    activeSection,
    setActiveSection,
  };
  return (
    <SettingsModalContext.Provider value={value}>
      {children}
    </SettingsModalContext.Provider>
  );
}

export function useSettingsModal(): SettingsModalContextValue {
  const ctx = useContext(SettingsModalContext);
  if (!ctx) {
    throw new Error("useSettingsModal must be used within SettingsModalProvider");
  }
  return ctx;
}

export function useSettingsModalOptional(): SettingsModalContextValue | null {
  return useContext(SettingsModalContext);
}
