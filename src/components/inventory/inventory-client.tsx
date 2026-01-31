"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddEditCartridgeDialog from "./add-edit-cartridge-dialog";
import InventoryTable from "./inventory-table";
import { useI18n } from "@/contexts/i18n-provider";
import { Input } from "@/components/ui/input";
import { filterCartridges } from "@/lib/search";

export default function InventoryClient() {
  const { cartridges } = useCartridgeData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useI18n();

  const filteredCartridges = filterCartridges(cartridges, searchTerm);

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
          <CardDescription>
            <Input
              placeholder={t("Search cartridges...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable cartridges={filteredCartridges} />
        </CardContent>
      </Card>
      <AddEditCartridgeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
