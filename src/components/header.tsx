
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/inventory": "Inventory",
  "/ai-insights": "Intelligent Alerting Tool",
};

const pageDescriptions: { [key: string]: string } = {
  "/": "An overview of your cartridge inventory.",
  "/inventory": "Manage your cartridge inventory and reorder thresholds.",
  "/ai-insights":
    "Generate predictive restock alerts using AI analysis of your usage patterns.",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "StockPilot";
  const description = pageDescriptions[pathname] || "";

  return (
    <header className="flex items-center justify-between border-b p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  );
}
