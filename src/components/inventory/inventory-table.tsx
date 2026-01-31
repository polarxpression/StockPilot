
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Cartridge } from "@/lib/types";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import InventoryTableActions from "./inventory-table-actions";
import AddEditCartridgeDialog from "./add-edit-cartridge-dialog";
import UpdateStockForm from "./update-stock-form";
import { Package } from "lucide-react";
import { useI18n } from "@/contexts/i18n-provider";

interface InventoryTableProps {
  cartridges: Cartridge[];
}

export default function InventoryTable({ cartridges }: InventoryTableProps) {
  const { deleteCartridge } = useCartridgeData();
  const [editingCartridge, setEditingCartridge] = useState<
    Cartridge | undefined
  >(undefined);
  const { t } = useI18n();

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 hidden sm:table-cell">{t("Image")}</TableHead>
              <TableHead>{t("Brand")}</TableHead>
              <TableHead>{t("Model")}</TableHead>
              <TableHead>{t("Color")}</TableHead>
              <TableHead>{t("Barcode")}</TableHead>
              <TableHead>{t("Stock")}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("Threshold")}
              </TableHead>
              <TableHead className="hidden lg:table-cell">{t("Last Updated")}</TableHead>
              <TableHead>
                <span className="sr-only">{t("Actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartridges.length > 0 ? (
              cartridges.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white border">
                    {item.imageUrl ? (
                      <img
                        src={`/api/image-proxy?imageUrl=${encodeURIComponent(item.imageUrl)}`}
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
                  <TableCell className="font-medium">
                     {item.brand}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.model}</TableCell>
                   <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                       {item.color}
                       {item.stock <= item.reorderThreshold && (
                        <Badge variant="destructive" className="hidden sm:inline-flex">{t("Low")}</Badge>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.barcode}</TableCell>
                  <TableCell>
                    <UpdateStockForm cartridge={item} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {item.reorderThreshold}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {format(item.lastUpdated, "PPP p")}
                  </TableCell>
                  <TableCell>
                    <InventoryTableActions
                      onEdit={() => setEditingCartridge(item)}
                      onDelete={() => deleteCartridge(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  {t("No cartridges found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AddEditCartridgeDialog
        open={!!editingCartridge}
        onOpenChange={(open) => !open && setEditingCartridge(undefined)}
        cartridge={editingCartridge}
      />
    </>
  );
}
