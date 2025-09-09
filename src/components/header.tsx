
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useI18n } from "@/contexts/i18n-provider";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  
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
    <header className="flex items-center justify-between border-b p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
    </header>
  );
}
