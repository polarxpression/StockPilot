"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import { cartridgeSchema } from "@/lib/schemas";
import type { Cartridge } from "@/lib/data";

interface AddEditCartridgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartridge?: Cartridge;
}

export default function AddEditCartridgeDialog({
  open,
  onOpenChange,
  cartridge,
}: AddEditCartridgeDialogProps) {
  const { addCartridge, updateCartridge } = useCartridgeData();
  const isEditMode = !!cartridge;

  const form = useForm<z.infer<typeof cartridgeSchema>>({
    resolver: zodResolver(cartridgeSchema),
    defaultValues: {
      name: "",
      model: "",
      stock: 0,
      reorderThreshold: 0,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (cartridge) {
      form.reset(cartridge);
    } else {
      form.reset({
        name: "",
        model: "",
        stock: 0,
        reorderThreshold: 10,
        imageUrl: "",
      });
    }
  }, [cartridge, form, open]);

  const onSubmit = (values: z.infer<typeof cartridgeSchema>) => {
    if (isEditMode) {
      updateCartridge(cartridge.id, values);
    } else {
      addCartridge(values);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Cartridge" : "Add New Cartridge"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this cartridge."
              : "Enter the details for the new cartridge."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Black Ink" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HP 63XL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reorderThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Save Changes" : "Add Cartridge"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
