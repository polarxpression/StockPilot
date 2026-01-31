"use client";

import { RootLayout } from "@/components/layout/root-layout";
import InventoryClient from "@/components/inventory/inventory-client";

interface PageProps {
  pathname: string;
}

export function InventoryPage({ pathname }: PageProps) {
  return (
    <RootLayout pathname={pathname}>
      <InventoryClient />
    </RootLayout>
  );
}
