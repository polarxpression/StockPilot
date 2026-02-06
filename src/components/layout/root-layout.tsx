"use client";

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/logo";
import { CartridgeDataProvider } from "@/contexts/cartridge-data-provider";
import { AppProviders } from "@/components/app-providers";
import Settings from "@/components/settings";
import Header from "@/components/header";
import AppSidebarMenu from "@/components/dashboard/app-sidebar-menu";

interface RootLayoutProps {
  children: React.ReactNode;
  pathname: string;
}

export function RootLayout({ children, pathname }: RootLayoutProps) {
  return (
    <AppProviders>
      <CartridgeDataProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <AppSidebarMenu pathname={pathname} />
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <Settings />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header pathname={pathname} />
            <main className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </CartridgeDataProvider>
    </AppProviders>
  );
}
