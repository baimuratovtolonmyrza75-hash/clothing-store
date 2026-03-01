"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";

export default function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="w-full">
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-100">
          <Image
            src={product.image[0]}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <p className="transition-opacity group-hover:opacity-70">{product.name}</p>
          <p>{formatPrice(product.price, language)}</p>
        </div>
      </div>
    </Link>
  );
}
