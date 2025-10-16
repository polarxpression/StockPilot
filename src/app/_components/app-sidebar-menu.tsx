"use client";


import { Boxes, LayoutDashboard } from "lucide-react";

import { useI18n } from "@/contexts/i18n-provider";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function AppSidebarMenu() {
  const { t } = useI18n();
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={{ children: t("Dashboard") }}>
          <a href="/">
            <LayoutDashboard />
            <span>{t("Dashboard")}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={{ children: t("Inventory") }}>
          <a href="/inventory">
            <Boxes />
            <span>{t("Inventory")}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
