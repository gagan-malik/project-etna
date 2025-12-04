import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarLayout } from "@/components/sidebar-layout";

export const metadata: Metadata = {
  title: "Project Etna",
  description: "AI-powered chat application with modern UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}