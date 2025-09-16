"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { initialCartridges, type Cartridge } from "@/lib/data";

type CartridgeDataContextType = {
  cartridges: Cartridge[];
  addCartridge: (cartridge: Omit<Cartridge, "id" | "lastUpdated">) => Promise<void>;
  updateCartridge: (id: string, updatedCartridge: Partial<Omit<Cartridge, 'id' | 'lastUpdated'>>) => Promise<void>;
  deleteCartridge: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
};

const CartridgeDataContext = createContext<CartridgeDataContextType | undefined>(
  undefined
);

export function CartridgeDataProvider({ children }: { children: ReactNode }) {
  const [cartridges, setCartridges] = useState<Cartridge[]>([]);

  useEffect(() => {
    const cartridgesCollection = collection(db, "cartridges");

    const seedDatabase = async () => {
      const snapshot = await getDocs(cartridgesCollection);
      if (snapshot.empty) {
        console.log("Cartridges collection is empty, seeding with initial data...");
        const batch = writeBatch(db);
        initialCartridges.forEach((cartridge) => {
          const { id, ...data } = cartridge;
          const docRef = doc(db, "cartridges", id);
          batch.set(docRef, {
            ...data,
            lastUpdated: Timestamp.fromDate(data.lastUpdated),
          });
        });
        await batch.commit();
        console.log("Database seeded successfully.");
      }
    };

    seedDatabase();

    const unsubscribe = onSnapshot(cartridgesCollection, (snapshot) => {
      const cartridgesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JS Date
          lastUpdated: (data.lastUpdated as Timestamp)?.toDate() || new Date(),
        } as Cartridge;
      });
      setCartridges(cartridgesData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addCartridge = async (cartridge: Omit<Cartridge, "id" | "lastUpdated">) => {
    try {
      await addDoc(collection(db, "cartridges"), {
        ...cartridge,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding cartridge: ", error);
    }
  };

  const updateCartridge = async (id: string, updatedCartridge: Partial<Omit<Cartridge, 'id' | 'lastUpdated'>>) => {
    try {
      const cartridgeDoc = doc(db, "cartridges", id);
      await updateDoc(cartridgeDoc, {
        ...updatedCartridge,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating cartridge: ", error);
    }
  };

  const deleteCartridge = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cartridges", id));
    } catch (error) {
      console.error("Error deleting cartridge: ", error);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    await updateCartridge(id, { stock: newStock });
  };

  return (
    <CartridgeDataContext.Provider
      value={{
        cartridges,
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
