"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, ProductSizeValue } from "@/lib/types";

type CartType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size: ProductSizeValue) => void;
  increaseQty: (id: string, size: ProductSizeValue) => void;
  decreaseQty: (id: string, size: ProductSizeValue) => void;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

/* =========================
   CONTEXT
========================= */

const CartContext = createContext<CartType | null>(null);

function normalizeLegacyCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate = item as {
    id?: unknown;
    slug?: unknown;
    name?: unknown;
    price?: unknown;
    image?: unknown;
    images?: unknown;
    description?: unknown;
    size?: unknown;
    quantity?: unknown;
    sizes?: unknown;
  };

  const images = Array.isArray(candidate.images)
    ? candidate.images
    : Array.isArray(candidate.image)
      ? candidate.image
      : [];

  if (
    (typeof candidate.id !== "string" && typeof candidate.id !== "number") ||
    typeof candidate.name !== "string" ||
    typeof candidate.price !== "number" ||
    !Number.isSafeInteger(candidate.price) ||
    candidate.price < 0 ||
    typeof candidate.description !== "string" ||
    typeof candidate.size !== "string" ||
    typeof candidate.quantity !== "number" ||
    !Number.isSafeInteger(candidate.quantity) ||
    candidate.quantity < 1 ||
    candidate.quantity > 99 ||
    images.some((entry) => typeof entry !== "string")
  ) {
    return null;
  }

  const normalizedSize = candidate.size as ProductSizeValue;

  if (!["S", "M", "L", "XL"].includes(normalizedSize)) {
    return null;
  }

  return {
    id: String(candidate.id),
    slug:
      typeof candidate.slug === "string"
        ? candidate.slug
        : String(candidate.name).toLowerCase().replace(/\s+/g, "-"),
    name: candidate.name,
    price: candidate.price,
    description: candidate.description,
    images,
    sizes: Array.isArray(candidate.sizes)
      ? (candidate.sizes.filter((entry): entry is ProductSizeValue =>
          typeof entry === "string" && ["S", "M", "L", "XL"].includes(entry)
        ) as ProductSizeValue[])
      : ["S", "M", "L", "XL"],
    size: normalizedSize,
    quantity: candidate.quantity,
  };
}

/* =========================
   PROVIDER
========================= */

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("cart");
      if (!saved) {
        hasLoadedRef.current = true;
        return;
      }

      const parsed = JSON.parse(saved) as unknown[];
      const normalized = Array.isArray(parsed)
        ? parsed
            .map((item) => normalizeLegacyCartItem(item))
            .filter((item): item is CartItem => item !== null)
        : [];

      const restoreTimer = window.setTimeout(() => {
        setCart(normalized);
        hasLoadedRef.current = true;
      }, 0);
      return () => window.clearTimeout(restoreTimer);
    } catch {
      hasLoadedRef.current = true;
    }
  }, []);

  /* =========================
     SAVE
  ========================== */
  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedRef.current) return;

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // Keep checkout usable if browser storage is unavailable or full.
    }
  }, [cart]);

  /* =========================
     TOTAL ITEMS
  ========================== */
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  /* =========================
     ADD TO CART
     (id + size !!!)
  ========================== */
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const exist = prev.find(
        i => i.id === product.id && i.size === product.size
      );

      if (exist) {
        return prev.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* =========================
     REMOVE
  ========================== */
  const removeFromCart = (id: string, size: ProductSizeValue) => {
    setCart(prev =>
      prev.filter(item => !(item.id === id && item.size === size))
    );
  };

  /* =========================
     INCREASE
  ========================== */
  const increaseQty = (id: string, size: ProductSizeValue) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
          : item
      )
    );
  };

  /* =========================
     DECREASE
  ========================== */
  const decreaseQty = (id: string, size: ProductSizeValue) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart: () => setCart([]),
        totalItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
