"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  kg: {
    title: "АРХИВ",
    subtitle: "OIMO брендинин визуалдык тилин аныктаган тандалган коллекциялар.",
    lookbook: "ЛУКБУК",
    cta: "ДҮКӨНГӨ ӨТҮҮ",
    seasons: [
      {
        id: "AW25",
        title: "КҮЗ / КЫШ 2025",
        note: "Так силуэттер, калың катмарлар жана монохром текстуралар.",
      },
      {
        id: "SS25",
        title: "ЖАЗ / ЖАЙ 2025",
        note: "Жеңил пахта, таза базалык формалар, жумшак түстөр.",
      },
      {
        id: "CORE",
        title: "НЕГИЗГИ ЛИНИЯ",
        note: "Күнүмдүк гардероб үчүн туруктуу классикалык линия.",
      },
    ],
  },
  ru: {
    title: "АРХИВ",
    subtitle: "Избранные коллекции, формирующие визуальный язык бренда OIMO.",
    lookbook: "ПРЕВЬЮ ЛУКБУКА",
    cta: "ПЕРЕЙТИ В МАГАЗИН",
    seasons: [
      {
        id: "AW25",
        title: "ОСЕНЬ / ЗИМА 2025",
        note: "Четкие силуэты, плотные слои и монохромные текстуры.",
      },
      {
        id: "SS25",
        title: "ВЕСНА / ЛЕТО 2025",
        note: "Легкий хлопок, чистая база и спокойные цветовые акценты.",
      },
      {
        id: "CORE",
        title: "CORE ESSENTIALS",
        note: "Постоянная линия базовых вещей на каждый день.",
      },
    ],
  },
  en: {
    title: "ARCHIVE",
    subtitle: "Selected collections that define the visual language of OIMO.",
    lookbook: "LOOKBOOK PREVIEW",
    cta: "GO TO SHOP",
    seasons: [
      {
        id: "AW25",
        title: "AUTUMN / WINTER 2025",
        note: "Structured silhouettes, heavyweight layers, monochrome textures.",
      },
      {
        id: "SS25",
        title: "SPRING / SUMMER 2025",
        note: "Light cottons, sharp basics, quiet color accents.",
      },
      {
        id: "CORE",
        title: "CORE ESSENTIALS",
        note: "Permanent line of daily wardrobe staples.",
      },
    ],
  },
} as const;

export default function ArchivePage() {
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl tracking-[0.2em]">{copy.title}</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            {copy.subtitle}
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          {copy.seasons.map((season) => (
            <article key={season.id} className="border border-black p-6 space-y-3">
              <p className="text-xs tracking-[0.2em] text-gray-500">{season.id}</p>
              <h2 className="text-lg font-semibold">{season.title}</h2>
              <p className="text-sm text-gray-600">{season.note}</p>
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-xl tracking-[0.12em] mb-5">{copy.lookbook}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <figure key={product.id} className="space-y-2">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <figcaption className="text-xs md:text-sm tracking-wide">
                  {product.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-t border-black pt-8">
          <Link
            href="/shop"
            className="inline-block border border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white transition"
          >
            {copy.cta}
          </Link>
        </section>
      </div>
    </main>
  );
}
