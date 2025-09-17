
import { Cartridge } from "./types";

export const initialCartridges: Cartridge[] = [
  {
    id: "1",
    brand: "HP",
    model: "63XL",
    color: "Black",
    stock: 5,
    reorderThreshold: 10,
    lastUpdated: new Date("2023-10-26T10:00:00Z"),
    imageUrl: "https://picsum.photos/100/100?random=1",
  },
  {
    id: "2",
    brand: "HP",
    model: "63",
    color: "Tri-Color",
    stock: 12,
    reorderThreshold: 10,
    lastUpdated: new Date("2023-10-25T14:30:00Z"),
    imageUrl: "https://picsum.photos/100/100?random=2",
  },
  {
    id: "3",
    brand: "Canon",
    model: "PG-245XL",
    color: "Black High-Yield",
    stock: 18,
    reorderThreshold: 15,
    lastUpdated: new Date("2023-10-24T09:00:00Z"),
    imageUrl: "https://picsum.photos/100/100?random=3",
  },
  {
    id: "4",
    brand: "Epson",
    model: "288",
    color: "Cyan",
    stock: 3,
    reorderThreshold: 5,
    lastUpdated: new Date("2023-10-27T11:00:00Z"),
    imageUrl: "https://picsum.photos/100/100?random=4",
  },
  {
    id: "5",
    brand: "Brother",
    model: "TN760",
    color: "Toner",
    stock: 8,
    reorderThreshold: 5,
    lastUpdated: new Date("2023-10-22T16:00:00Z"),
    imageUrl: "https://picsum.photos/100/100?random=5",
  },
];


export const sampleHistoricalData = `Date,CartridgeType,Usage
2023-09-01,HP 63XL,5
2023-09-02,HP 63,3
2023-09-03,Canon PG-245XL,2
2023-09-04,Epson 288,8
2023-09-05,Brother TN760,4
2023-09-08,HP 63XL,6
2023-09-09,HP 63,2
2023-09-12,Epson 288,7
2023-09-15,HP 63XL,5
2023-09-18,Brother TN760,3
2023-09-22,Canon PG-245XL,3
2023-09-25,HP 63XL,4
2023-09-28,Epson 288,6
2023-10-02,HP 63,4
2023-10-05,Brother TN760,5
2023-10-10,HP 63XL,7
2023-10-15,Canon PG-245XL,2
2023-10-20,Epson 288,9
2023-10-25,HP 63XL,6`;

export const sampleReorderThresholds = `CartridgeType,ReorderPoint
HP 63XL,10
HP 63,10
Canon PG-245XL,15
Epson 288,5
Brother TN760,5`;
