"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarVariant = "default" | "icon";

const SidebarContext = createContext<{
  variant: SidebarVariant;
  setVariant: (v: SidebarVariant) => void;
} | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<SidebarVariant>("default");
  return (
    <SidebarContext.Provider value={{ variant, setVariant }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarVariant() {
  const ctx = useContext(SidebarContext);
  return ctx ?? { variant: "default" as SidebarVariant, setVariant: () => {} };
}
