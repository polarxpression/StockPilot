
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
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportFiltersProps {
  data: Cartridge[];
  onFilter: (filteredData: Cartridge[]) => void;
}

export default function ReportFilters({ data, onFilter }: ReportFiltersProps) {
  const { t } = useI18n();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const brands = useMemo(
    () => [...new Set(data.map((item) => item.brand))].sort(),
    [data]
  );
  const colors = useMemo(
    () => [...new Set(data.map((item) => item.color))].sort(),
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

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
  };

  const hasFilters = selectedBrands.length > 0 || selectedColors.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-2 mr-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{t("Filter by:")}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {t("Brands")}
            {selectedBrands.length > 0 && (
              <Badge variant="secondary" className="ml-2 px-1 rounded-sm h-5 font-normal">
                {selectedBrands.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
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
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {t("Colors")}
             {selectedColors.length > 0 && (
              <Badge variant="secondary" className="ml-2 px-1 rounded-sm h-5 font-normal">
                {selectedColors.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
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

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 lg:px-3"
        >
          {t("Reset")}
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
