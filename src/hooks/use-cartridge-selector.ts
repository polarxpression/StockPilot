
"use client";

import { useMemo, useState } from "react";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";

export function useCartridgeSelector() {
  const { cartridges } = useCartridgeData();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const brands = useMemo(() => {
    const brandSet = new Set(cartridges.map((c) => c.brand));
    return Array.from(brandSet);
  }, [cartridges]);

  const models = useMemo(() => {
    if (!selectedBrand) return [];
    const modelSet = new Set(
      cartridges
        .filter((c) => c.brand === selectedBrand)
        .map((c) => c.model)
    );
    return Array.from(modelSet);
  }, [cartridges, selectedBrand]);

  return { brands, models, selectedBrand, setSelectedBrand };
}
