export interface Cartridge {
  id: string;
  brand: string;
  model: string;
  color: string;
  stock: number;
  reorderThreshold: number;
  lastUpdated: Date;
  imageUrl?: string;
}