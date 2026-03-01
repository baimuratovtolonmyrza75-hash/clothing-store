"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";

export default function CartDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { language, t } = useLanguage();

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold">{t("cart")}</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl hover:opacity-60 transition"
          >
            X
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">{t("cartEmpty")}</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="border-b pb-6">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden">
                      <Image
                        src={item.image[0]}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {t("size")}: {item.size}
                      </p>
                      <p className="font-semibold mt-2">
                        {formatPrice(item.price, language)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => decreaseQty(item.id, item.size)}
                      className="px-2 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id, item.size)}
                      className="px-2 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="ml-auto text-xs text-red-600 hover:text-red-800"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t p-6 space-y-4 z-10">
            <div className="flex justify-between text-lg font-semibold">
              <span>{t("total")}:</span>
              <span>
                {formatPrice(
                  cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                  language
                )}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition font-semibold"
            >
              {t("checkout")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
