"use client";

import { useMemo, useRef } from "react";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Package, PackageWarning, AlertCircle } from "lucide-react";
import RestockReportTable from "./restock-report-table";
import ReportActions from "./report-actions";

export default function DashboardClient() {
  const { cartridges } = useCartridgeData();
  const reportRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const totalStock = cartridges.reduce((sum, item) => sum + item.stock, 0);
    const lowStockItems = cartridges.filter(
      (item) => item.stock <= item.reorderThreshold
    ).length;
    return {
      totalTypes: cartridges.length,
      totalStock,
      lowStockItems,
    };
  }, [cartridges]);

  const lowStockCartridges = useMemo(
    () => cartridges.filter((item) => item.stock <= item.reorderThreshold),
    [cartridges]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cartridge Types
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTypes}</div>
            <p className="text-xs text-muted-foreground">
              Different models in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Level
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Sum of all cartridges in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Reordering
            </CardTitle>
            <PackageWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items at or below threshold
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Restock Report</CardTitle>
              <p className="text-muted-foreground mt-1">
                These items are below their reorder threshold.
              </p>
            </div>
            <ReportActions
              data={lowStockCartridges}
              reportRef={reportRef}
              disabled={lowStockCartridges.length === 0}
            />
          </div>
        </CardHeader>
        <CardContent ref={reportRef}>
          {lowStockCartridges.length > 0 ? (
            <RestockReportTable cartridges={lowStockCartridges} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full bg-secondary p-4">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">All Good!</h3>
              <p className="text-muted-foreground">
                No items currently require restocking.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
