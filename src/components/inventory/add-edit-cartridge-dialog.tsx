
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartridgeData } from "@/contexts/cartridge-data-provider";
import { cartridgeSchema } from "@/lib/schemas";
import type { Cartridge } from "@/lib/types";
import { useI18n } from "@/contexts/i18n-provider";
import { useCartridgeSelector } from "@/hooks/use-cartridge-selector";

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
  const { brands, models, selectedBrand, setSelectedBrand } = useCartridgeSelector();
  const isEditMode = !!cartridge;
  const { t } = useI18n();

  const form = useForm<z.infer<typeof cartridgeSchema>>({
    resolver: zodResolver(cartridgeSchema),
    defaultValues: {
      brand: "",
      model: "",
      color: "",
      stock: 0,
      reorderThreshold: 10,
      barcode: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (cartridge) {
      form.reset(cartridge);
      setSelectedBrand(cartridge.brand);
    } else {
      form.reset({
        brand: "",
        model: "",
        color: "",
        stock: 0,
        reorderThreshold: 10,
        barcode: "",
        imageUrl: "",
      });
      setSelectedBrand(null);
    }
  }, [cartridge, open, form, setSelectedBrand]);

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
            {isEditMode ? t("Edit Cartridge") : t("Add New Cartridge")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("Update the details for this cartridge.")
              : t("Enter the details for the new cartridge.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Brand")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedBrand(value);
                        form.setValue("model", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a brand")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Model")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedBrand}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a model")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Color")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("e.g., Black")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Barcode")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("e.g., 123456789")} {...field} />
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
                  <FormLabel>{t("Image URL")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.png"
                      {...field}
                    />
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
                    <FormLabel>{t("Current Stock")}</FormLabel>
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
                    <FormLabel>{t("Reorder Threshold")}</FormLabel>
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
                {t("Cancel")}
              </Button>
              <Button type="submit">
                {isEditMode ? t("Save Changes") : t("Add Cartridge")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
