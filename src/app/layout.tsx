import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, Boxes, LayoutDashboard, PanelLeft } from "lucide-react";

import "./globals.css";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/logo";
import { CartridgeDataProvider } from "@/contexts/cartridge-data-provider";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "StockPilot",
  description: "Intelligent Cartridge Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <CartridgeDataProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                  <Logo />
                  <SidebarTrigger className="ml-auto" />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={{ children: "Dashboard" }}
                    >
                      <Link href="/">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={{ children: "Inventory" }}
                    >
                      <Link href="/inventory">
                        <Boxes />
                        <span>Inventory</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={{ children: "AI Insights" }}
                    >
                      <Link href="/ai-insights">
                        <BrainCircuit />
                        <span>AI Insights</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </CartridgeDataProvider>
      </body>
    </html>
  );
}
