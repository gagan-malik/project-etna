import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSyncFromPreferences } from "@/components/theme-sync-from-preferences";
import { SidebarLayout } from "@/components/sidebar-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider } from "@/components/auth-provider";
import { NextjsPortalFix } from "@/components/nextjs-portal-fix";
import { SettingsModalProvider } from "@/components/settings-modal-context";
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Project Etna - Silicon Debug Assistant",
  description: "AI-powered silicon debugging tool for verification engineers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSyncFromPreferences />
            <ErrorBoundary>
              <SettingsModalProvider>
                <SidebarLayout>
                  {children}
                </SidebarLayout>
              </SettingsModalProvider>
            </ErrorBoundary>
            <Toaster />
            <NextjsPortalFix />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}