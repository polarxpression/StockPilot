"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
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
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import InventoryTableActions from "./inventory-table-actions";
import AddEditCartridgeDialog from "./add-edit-cartridge-dialog";
import UpdateStockForm from "./update-stock-form";
import { Package } from "lucide-react";

interface InventoryTableProps {
  cartridges: Cartridge[];
}

export default function InventoryTable({ cartridges }: InventoryTableProps) {
  const { deleteCartridge } = useCartridgeData();
  const [editingCartridge, setEditingCartridge] = useState<
    Cartridge | undefined
  >(undefined);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 hidden sm:table-cell">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="hidden md:table-cell">
                Threshold
              </TableHead>
              <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartridges.length > 0 ? (
              cartridges.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
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
                    <div className="flex items-center gap-2">
                       {item.name}
                       {item.stock <= item.reorderThreshold && (
                        <Badge variant="destructive" className="hidden sm:inline-flex">Low</Badge>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.model}</TableCell>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No cartridges found.
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
