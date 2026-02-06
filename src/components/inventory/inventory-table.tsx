"use client";

import { useState, useMemo } from "react";
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
import { Package, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { useI18n } from "@/contexts/i18n-provider";

interface InventoryTableProps {
  cartridges: Cartridge[];
}

type SortConfig = {
  key: keyof Cartridge;
  direction: "asc" | "desc";
} | null;

export default function InventoryTable({ cartridges }: InventoryTableProps) {
  const { deleteCartridge } = useCartridgeData();
  const [editingCartridge, setEditingCartridge] = useState<
    Cartridge | undefined
  >(undefined);
  const { t } = useI18n();
  
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedCartridges = useMemo(() => {
    let sortableItems = [...cartridges];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [cartridges, sortConfig]);

  const requestSort = (key: keyof Cartridge) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Cartridge) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  const SortableHead = ({ 
    columnKey, 
    children, 
    className 
  }: { 
    columnKey: keyof Cartridge; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-muted/80 transition-colors ${className}`}
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon(columnKey)}
      </div>
    </TableHead>
  );

  return (
    <>
      <div className="rounded-md border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-16 hidden sm:table-cell">{t("Image")}</TableHead>
              <SortableHead columnKey="brand">{t("Brand")}</SortableHead>
              <SortableHead columnKey="model">{t("Model")}</SortableHead>
              <SortableHead columnKey="color">{t("Color")}</SortableHead>
              <SortableHead columnKey="barcode">{t("Barcode")}</SortableHead>
              <SortableHead columnKey="stock">{t("Stock")}</SortableHead>
              <SortableHead columnKey="reorderThreshold" className="hidden md:table-cell">
                {t("Threshold")}
              </SortableHead>
              <SortableHead columnKey="lastUpdated" className="hidden lg:table-cell">
                {t("Last Updated")}
              </SortableHead>
              <TableHead>
                <span className="sr-only">{t("Actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCartridges.length > 0 ? (
              sortedCartridges.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white border shadow-sm p-1">
                    {item.imageUrl ? (
                      <img
                        src={`/api/image-proxy?imageUrl=${encodeURIComponent(item.imageUrl)}`}
                        alt={`${item.brand} ${item.model}`}
                        width={48}
                        height={48}
                        className="h-full w-full rounded-sm object-contain mix-blend-multiply dark:mix-blend-normal"
                        data-ai-hint="ink cartridge"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground/30" />
                    )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                     <Badge variant="outline" className="font-normal">{item.brand}</Badge>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">{item.model}</TableCell>
                   <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                       <span className="capitalize">{item.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">{item.barcode}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <UpdateStockForm cartridge={item} />
                        {item.stock <= item.reorderThreshold && (
                            <Badge variant="destructive" className="h-5 px-1 rounded-sm">
                                <AlertTriangle className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline text-[10px]">{t("Low")}</span>
                            </Badge>
                        )}
                         {item.stock > item.reorderThreshold && (
                            <div className="text-primary/60">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {item.reorderThreshold}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {format(item.lastUpdated, "PPP")}
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
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8 opacity-50" />
                    <p>{t("No cartridges found.")}</p>
                  </div>
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
