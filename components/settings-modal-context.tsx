"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SettingsModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSettings: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextValue | null>(
  null
);

export function SettingsModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSettings = useCallback(() => setOpen(true), []);
  const value: SettingsModalContextValue = { open, setOpen, openSettings };
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
