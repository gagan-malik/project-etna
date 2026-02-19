import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSyncFromPreferences } from "@/components/theme-sync-from-preferences";
import { SidebarLayout } from "@/components/sidebar-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { NextjsPortalFix } from "@/components/nextjs-portal-fix";
import { SettingsModalProvider } from "@/components/settings-modal-context";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

// Avoid prerender so build does not require Clerk env at build time (set on Vercel for runtime).
export const dynamic = "force-dynamic";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  function apply(el){
    if(!el||!el.style)return;
    el.style.setProperty('display','block','important');
    el.style.setProperty('position','fixed','important');
    el.style.setProperty('top','0','important');
    el.style.setProperty('left','0','important');
    el.style.setProperty('width','1px','important');
    el.style.setProperty('height','1px','important');
    el.style.setProperty('min-width','1px','important');
    el.style.setProperty('min-height','1px','important');
    el.style.setProperty('overflow','hidden','important');
    el.style.setProperty('clip-path','inset(100%)','important');
    el.style.setProperty('pointer-events','none','important');
    el.style.setProperty('z-index','-1','important');
  }
  function run(){
    try{
      var doc=document;
      var portals=doc.querySelectorAll('nextjs-portal');
      for(var i=0;i<portals.length;i++)apply(portals[i]);
    }catch(e){}
  }
  function loop(){ run(); requestAnimationFrame(loop); }
  function start(){
    run();
    requestAnimationFrame(loop);
    try{
      var root=document.documentElement;
      var ob=new MutationObserver(run);
      ob.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
    }catch(e){}
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }
  run();
})();
            `.trim(),
          }}
        />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSyncFromPreferences />
            <ErrorBoundary>
              <AuthGuard>
                <SettingsModalProvider>
                  <OnboardingWizard />
                  <SidebarLayout>
                    {children}
                  </SidebarLayout>
                </SettingsModalProvider>
              </AuthGuard>
            </ErrorBoundary>
            <Toaster />
            <NextjsPortalFix />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}