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

interface RestockReportTableProps {
  cartridges: Cartridge[];
}

export default function RestockReportTable({
  cartridges,
}: RestockReportTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="text-center">Current Stock</TableHead>
            <TableHead className="text-center">Reorder Threshold</TableHead>
            <TableHead className="text-center">Status</TableHead>
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
                <Badge variant="destructive">Low Stock</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
