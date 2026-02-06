
"use client";

import { Package, AlertTriangle } from "lucide-react";
import type { Cartridge } from "@/lib/types";
import { useI18n } from "@/contexts/i18n-provider";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestockReportTableProps {
  cartridges: Cartridge[];
}

export default function RestockReportTable({
  cartridges,
}: RestockReportTableProps) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cartridges.map((item) => {
        const orderAmount = Math.max(0, (item.reorderThreshold * 2) - item.stock);
        return (
          <Card 
            key={item.id} 
            data-item-id={item.id} 
            className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-muted-foreground/10"
          >
            <CardContent className="p-0 relative">
              <div className="absolute top-2 right-2 z-10">
                 <Badge variant="destructive" className="flex gap-1 items-center px-1.5 py-0.5 text-[10px] h-5">
                    <AlertTriangle className="h-3 w-3" />
                    {t("Low")}
                 </Badge>
              </div>
              <div className="h-40 w-full bg-white dark:bg-zinc-950 flex items-center justify-center border-b p-4">
                {item.imageUrl ? (
                  <img
                    src={`/api/image-proxy?imageUrl=${encodeURIComponent(item.imageUrl)}`}
                    alt={`${item.brand} ${item.model}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint="ink cartridge"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start justify-center p-3 text-left w-full space-y-2">
              <div className="w-full">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.brand}</p>
                <h4 className="font-semibold text-sm truncate w-full" title={`${item.model} - ${item.color}`}>
                  {item.model} <span className="text-muted-foreground font-normal">- {item.color}</span>
                </h4>
              </div>
              
              <div className="w-full pt-2 border-t flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{t("Order Qty")}</p>
                <Badge variant="secondary" className="text-sm font-bold h-7 px-2.5">
                  {orderAmount}
                </Badge>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
