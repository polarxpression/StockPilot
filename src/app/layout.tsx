import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, Boxes, LayoutDashboard } from "lucide-react";
import { Inter } from "next/font/google";

import "./globals.css";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/logo";
import { CartridgeDataProvider } from "@/contexts/cartridge-data-provider";
import { AppProviders } from "@/components/app-providers";
import Settings from "@/components/settings";
import Header from "@/components/header";
import AppSidebarMenu from "@/app/_components/app-sidebar-menu";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      <body className={`font-sans ${inter.variable} antialiased`}>
        <AppProviders>
          <CartridgeDataProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <Logo />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <AppSidebarMenu />
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                  <Settings />
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <Header />
                <main className="p-4 md:p-6 lg:p-8">{children}</main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </CartridgeDataProvider>
        </AppProviders>
      </body>
    </html>
  );
}