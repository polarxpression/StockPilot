"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";

import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import type { Cartridge } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

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

  const onSubmit = (values: { stock: number }) => {
    updateStock(cartridge.id, values.stock);
  };
  
  const handleBlur = () => {
    form.handleSubmit(onSubmit)();
  };

  const adjustStock = (amount: number) => {
    const currentStock = form.getValues("stock");
    const newStock = Math.max(0, currentStock + amount);
    form.setValue("stock", newStock, { shouldDirty: true });
    updateStock(cartridge.id, newStock);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 w-32">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => adjustStock(-1)}
          disabled={form.getValues("stock") <= 0}
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
                  className="h-8 text-center"
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
          className="h-8 w-8 shrink-0"
          onClick={() => adjustStock(1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
