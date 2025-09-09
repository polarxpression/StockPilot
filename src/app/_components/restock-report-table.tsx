"use client";

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
            <TableHead>{t("Name")}</TableHead>
            <TableHead>{t("Model")}</TableHead>
            <TableHead className="text-center">{t("Current Stock")}</TableHead>
            <TableHead className="text-center">{t("Reorder Threshold")}</TableHead>
            <TableHead className="text-center">{t("Status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartridges.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-muted-foreground">{item.model}</TableCell>
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
