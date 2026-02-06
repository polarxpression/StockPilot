
"use client";

import { Boxes, LayoutDashboard } from "lucide-react";

import { useI18n } from "@/contexts/i18n-provider";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarMenuProps {
  pathname?: string;
}

export default function AppSidebarMenu({ pathname = "/" }: AppSidebarMenuProps) {
  const { t } = useI18n();

  const menuItems = [
    {
      title: t("Dashboard"),
      url: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      title: t("Inventory"),
      url: "/inventory",
      icon: Boxes,
      isActive: pathname.startsWith("/inventory"),
    },
  ];

  return (
    <div className="space-y-1 p-2">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            asChild
            tooltip={{ children: item.title }}
            isActive={item.isActive}
            className={`transition-all duration-200 ${
              item.isActive 
                ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <a href={item.url} className="flex items-center gap-3 py-3">
              <item.icon className={`h-5 w-5 ${item.isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span>{item.title}</span>
              {item.isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  );
}

