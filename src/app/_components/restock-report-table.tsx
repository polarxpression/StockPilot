
"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { Cartridge } from "@/lib/data";
import { useI18n } from "@/contexts/i18n-provider";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface RestockReportTableProps {
  cartridges: Cartridge[];
}

export default function RestockReportTable({
  cartridges,
}: RestockReportTableProps) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cartridges.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square w-full bg-muted flex items-center justify-center">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={`${item.brand} ${item.model}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-contain"
                  data-ai-hint="ink cartridge"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center p-4">
            <p className="text-sm font-semibold text-center">{`${item.brand} ${item.model} - ${item.color}`}</p>
            <p className="text-2xl font-bold">{Math.max(0, (item.reorderThreshold * 2) - item.stock)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
