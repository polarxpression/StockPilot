"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";

import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import type { Cartridge } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const stockSchema = z.object({
  stock: z.coerce.number().int().min(0),
});

export default function UpdateStockForm({
  cartridge,
}: {
  cartridge: Cartridge;
}) {
  const { updateStock } = useCartridgeData();

  const form = useForm<{ stock: number }>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      stock: cartridge.stock,
    },
  });

  useEffect(() => {
    form.reset({ stock: cartridge.stock });
  }, [cartridge.stock, form]);

  const onSubmit = useCallback((values: { stock: number }) => {
    if (values.stock !== cartridge.stock) {
      updateStock(cartridge.id, values.stock);
    }
  }, [cartridge.id, cartridge.stock, updateStock]);

  const handleBlur = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentStock = form.getValues("stock");
    const newStock = currentStock + 1;
    form.setValue("stock", newStock, { shouldDirty: true });
    onSubmit({ stock: newStock });
  };
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentStock = form.getValues("stock");
    const newStock = Math.max(0, currentStock - 1);
    form.setValue("stock", newStock, { shouldDirty: true });
    onSubmit({ stock: newStock });
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1">
         <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={form.watch("stock") <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  className="h-8 w-16 text-center"
                  {...field}
                  onBlur={handleBlur}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
