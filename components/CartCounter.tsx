"use client";

import { useCart } from "../context/CartContext";

export default function CartCounter() {
  const { cart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (total === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 text-xs bg-white text-black w-5 h-5 flex items-center justify-center rounded-full">
      {total}
    </span>
  );
}
