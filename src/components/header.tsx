"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useI18n } from "@/contexts/i18n-provider";

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const { t } = useI18n();
  
  const pageTitles: { [key: string]: string } = {
    "/": t("Dashboard"),
    "/inventory": t("Inventory"),
  };
  
  const pageDescriptions: { [key: string]: string } = {
    "/": t("An overview of your cartridge inventory."),
    "/inventory": t("Manage your cartridge inventory and reorder thresholds."),
  };

  const title = pageTitles[pathname] || "StockPilot";
  const description = pageDescriptions[pathname] || "";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-4 md:px-6 glass transition-all duration-300">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </header>
  );
}
