
"use client";

import Link from "next/link";
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
          <Link href="/">
            <LayoutDashboard />
            <span>{t("Dashboard")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={{ children: t("Inventory") }}>
          <Link href="/inventory">
            <Boxes />
            <span>{t("Inventory")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

