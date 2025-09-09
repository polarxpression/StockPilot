"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddEditCartridgeDialog from "./add-edit-cartridge-dialog";
import InventoryTable from "./inventory-table";
import { useI18n } from "@/contexts/i18n-provider";

export default function InventoryClient() {
  const { cartridges } = useCartridgeData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("Add Cartridge")}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("All Cartridges")}</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTable cartridges={cartridges} />
        </CardContent>
      </Card>
      <AddEditCartridgeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
