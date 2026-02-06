"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Package, AlertCircle } from "lucide-react";
import RestockReportTable from "./restock-report-table";
import ReportActions from "./report-actions";
import { useI18n } from "@/contexts/i18n-provider";
import ReportFilters from "./report-filters";
import { Cartridge } from "@/lib/types";

export default function DashboardClient() {
  const { cartridges } = useCartridgeData();
  const reportRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [filteredCartridges, setFilteredCartridges] = useState<Cartridge[]>([]);

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
    () =>
      cartridges.filter((item) => item.stock <= item.reorderThreshold),
    [cartridges]
  );

  const handleFilter = useCallback((filteredData: Cartridge[]) => {
    setFilteredCartridges(filteredData);
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Total Cartridge Types")}
            </CardTitle>
            <div className="p-2 bg-secondary rounded-full">
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTypes}</div>
            <p className="text-xs text-muted-foreground">
              {t("Different models in inventory")}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Total Stock Level")}
            </CardTitle>
            <div className="p-2 bg-secondary rounded-full">
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              {t("Sum of all cartridges in stock")}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-destructive/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Needs Reordering")}
            </CardTitle>
            <div className="p-2 bg-secondary rounded-full">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              {t("Items at or below threshold")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{t("Restock Report")}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {t("These items are below their reorder threshold.")}
              </p>
            </div>
            <ReportActions
              data={filteredCartridges}
              reportRef={reportRef}
              disabled={filteredCartridges.length === 0}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ReportFilters data={lowStockCartridges} onFilter={handleFilter} />
          <div ref={reportRef} className="mt-4">
            {filteredCartridges.length > 0 ? (
              <RestockReportTable cartridges={filteredCartridges} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center animate-in zoom-in-95 duration-300">
                <div className="rounded-full bg-secondary p-4 ring-1 ring-border shadow-sm">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t("All Good!")}</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                    {t("No items currently require restocking.")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
