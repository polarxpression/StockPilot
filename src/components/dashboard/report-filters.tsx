
"use client";

import { useState, useEffect, useMemo } from "react";
import { Cartridge } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/contexts/i18n-provider";

interface ReportFiltersProps {
  data: Cartridge[];
  onFilter: (filteredData: Cartridge[]) => void;
}

export default function ReportFilters({ data, onFilter }: ReportFiltersProps) {
  const { t } = useI18n();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const brands = useMemo(
    () => [...new Set(data.map((item) => item.brand))],
    [data]
  );
  const colors = useMemo(
    () => [...new Set(data.map((item) => item.color))],
    [data]
  );

  useEffect(() => {
    const filteredData = data.filter((item) => {
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const colorMatch =
        selectedColors.length === 0 || selectedColors.includes(item.color);
      return brandMatch && colorMatch;
    });
    onFilter(filteredData);
  }, [selectedBrands, selectedColors, data, onFilter]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{t("Brands")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {brands.map((brand) => (
            <DropdownMenuCheckboxItem
              key={brand}
              checked={selectedBrands.includes(brand)}
              onSelect={() => handleBrandChange(brand)}
            >
              {brand}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{t("Colors")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {colors.map((color) => (
            <DropdownMenuCheckboxItem
              key={color}
              checked={selectedColors.includes(color)}
              onSelect={() => handleColorChange(color)}
            >
              {color}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
