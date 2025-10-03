export interface Cartridge {
  id: string;
  brand: string;
  model: string;
  color: string;
  stock: number;
  reorderThreshold: number;
  barcode?: string;
  lastUpdated: Date;
  imageUrl?: string;
}