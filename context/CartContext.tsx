"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================
   TYPES
========================= */

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string[];
  description: string;
};

export type CartItem = Product & {
  size: string;
  quantity: number;
};

type CartType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number, size: string) => void;
  increaseQty: (id: number, size: string) => void;
  decreaseQty: (id: number, size: string) => void;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

/* =========================
   CONTEXT
========================= */

const CartContext = createContext<CartType | null>(null);

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

    const saved = localStorage.getItem("cart");
    if (!saved) {
      hasLoadedRef.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(saved) as CartItem[];
      setTimeout(() => {
        setCart(parsed);
        hasLoadedRef.current = true;
      }, 0);
    } catch {
      hasLoadedRef.current = true;
    }
  }, []);

  /* =========================
     SAVE
  ========================== */
  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedRef.current) return;

    localStorage.setItem("cart", JSON.stringify(cart));
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
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* =========================
     REMOVE
  ========================== */
  const removeFromCart = (id: number, size: string) => {
    setCart(prev =>
      prev.filter(item => !(item.id === id && item.size === size))
    );
  };

  /* =========================
     INCREASE
  ========================== */
  const increaseQty = (id: number, size: string) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* =========================
     DECREASE
  ========================== */
  const decreaseQty = (id: number, size: string) => {
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
