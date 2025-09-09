"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import { initialCartridges, type Cartridge } from "@/lib/data";

type CartridgeDataContextType = {
  cartridges: Cartridge[];
  setCartridges: Dispatch<SetStateAction<Cartridge[]>>;
  addCartridge: (cartridge: Omit<Cartridge, "id" | "lastUpdated">) => void;
  updateCartridge: (id: string, updatedCartridge: Partial<Cartridge>) => void;
  deleteCartridge: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
};

const CartridgeDataContext = createContext<CartridgeDataContextType | undefined>(
  undefined
);

// Custom hook to persist state to localStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Reviver to correctly parse Date objects
      return item
        ? JSON.parse(item, (k, v) =>
            typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(v)
              ? new Date(v)
              : v
          )
        : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function CartridgeDataProvider({ children }: { children: ReactNode }) {
  const [cartridges, setCartridges] = useLocalStorage<Cartridge[]>(
    "cartridges",
    initialCartridges
  );

  const addCartridge = (cartridge: Omit<Cartridge, "id" | "lastUpdated">) => {
    const newCartridge: Cartridge = {
      ...cartridge,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
    };
    setCartridges((prev) => [...prev, newCartridge]);
  };

  const updateCartridge = (id: string, updatedCartridge: Partial<Cartridge>) => {
    setCartridges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updatedCartridge, lastUpdated: new Date() } : c
      )
    );
  };

  const deleteCartridge = (id: string) => {
    setCartridges((prev) => prev.filter((c) => c.id !== id));
  };
  
  const updateStock = (id: string, newStock: number) => {
    if (newStock < 0) return;
    updateCartridge(id, { stock: newStock });
  };

  return (
    <CartridgeDataContext.Provider
      value={{
        cartridges,
        setCartridges,
        addCartridge,
        updateCartridge,
        deleteCartridge,
        updateStock,
      }}
    >
      {children}
    </CartridgeDataContext.Provider>
  );
}

export const useCartridgeData = () => {
  const context = useContext(CartridgeDataContext);
  if (context === undefined) {
    throw new Error("useCartridgeData must be used within a CartridgeDataProvider");
  }
  return context;
};
