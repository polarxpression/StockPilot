
"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Cartridge } from "@/lib/data";
import { useI18n } from "@/contexts/i18n-provider";

interface RestockReportTableProps {
  cartridges: Cartridge[];
}

export default function RestockReportTable({
  cartridges,
}: RestockReportTableProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 hidden sm:table-cell">
              {t("Image")}
            </TableHead>
            <TableHead>{t("Brand")}</TableHead>
            <TableHead>{t("Model")}</TableHead>
            <TableHead>{t("Color")}</TableHead>
            <TableHead className="text-center">{t("Current Stock")}</TableHead>
            <TableHead className="text-center">
              {t("Reorder Threshold")}
            </TableHead>
            <TableHead className="text-center">{t("Status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartridges.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="hidden sm:table-cell">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={`${item.brand} ${item.model}`}
                      width={48}
                      height={48}
                      className="h-full w-full rounded-md object-cover"
                      data-ai-hint="ink cartridge"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.brand}</TableCell>
              <TableCell className="text-muted-foreground">
                {item.model}
              </TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell className="text-center font-bold text-destructive">
                {item.stock}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {item.reorderThreshold}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="destructive">{t("Low Stock")}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
