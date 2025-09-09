"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import type { Cartridge } from "@/lib/data";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-20">
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
      </form>
    </Form>
  );
}
