"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";

export default function ProductPage() {
  const params = useParams();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [size, setSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.image.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    if (!size) {
      showToast(t("selectSizeError"), "error");
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      addToCart({ ...product, size });
      openCart();
      setIsAdding(false);
      setShowConfirm(true);
      showToast(t("added"), "success");

      setTimeout(() => setShowConfirm(false), 2000);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 pt-32 pb-10">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
            <div className="relative w-full h-full">
              <Image
                src={product.image[currentImageIndex]}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
              />
            </div>
          </div>

          {product.image.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
              >
                {"<"}
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
              >
                {">"}
              </button>
            </>
          )}

          {product.image.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {product.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentImageIndex ? "bg-black" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center md:sticky md:top-10 md:h-fit">
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>

          <p className="text-lg mb-6">{formatPrice(product.price, language)}</p>

          <p className="mb-8 text-sm text-gray-600">{product.description}</p>

          <div className="flex gap-3 mb-8">
            {["S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`border px-5 py-2 transition ${
                  size === s
                    ? "bg-black text-white"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!size || isAdding}
            className={`border border-black px-8 py-4 font-semibold transition disabled:opacity-40 relative overflow-hidden ${
              isAdding ? "bg-black text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("adding")}
              </span>
            ) : (
              t("addToCart")
            )}
          </button>

          {showConfirm && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg animate-[slideDown_0.3s_ease]">
              {t("added")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
