import InventoryClient from "./_components/inventory-client";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Manage your cartridge inventory and reorder thresholds.
        </p>
      </header>
      <InventoryClient />
    </div>
  );
}
