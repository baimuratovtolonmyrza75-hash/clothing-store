"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  kg: {
    studio: "OIMO STUDIO",
    title: "БИЗ ЖӨНҮНДӨ",
    intro:
      "OIMO минимализм жана күнүмдүк ыңгайлуулукка негизделген заманбап кийим бренди.",
    values: [
      {
        title: "Дизайн Биринчи",
        text: "Таза силуэт, туура пропорция жана сезонго көз карандысыз форма.",
      },
      {
        title: "Сапаттуу Материал",
        text: "Узак колдонууга ылайык бекем кездеме жана сапаттуу тигиш.",
      },
      {
        title: "Тынч Эстетика",
        text: "Ашыкча элементсиз, өзүнө ишенген минималдуу стиль.",
      },
    ],
    approachTitle: "БИЗДИН ЫКМА",
    approachText:
      "Ар бир чыгарылыш өлчөм, форма жана материал сыноосунан өтөт. Артыкча деталдарды алып салабыз.",
    slowerTitle: "САЛМАКТУУ МОДА",
    slowerText:
      "Биз аз сандагы, бирок так ойлонулган коллекцияларды чыгарабыз. Бул сапатты жогорулатат.",
    cta: "КОЛЛЕКЦИЯНЫ КӨРҮҮ",
  },
  ru: {
    studio: "OIMO STUDIO",
    title: "О БРЕНДЕ",
    intro:
      "OIMO — современный бренд одежды с фокусом на минимализм и функциональность.",
    values: [
      {
        title: "Дизайн В Приоритете",
        text: "Чистый крой, выверенные пропорции и вещи вне одного сезона.",
      },
      {
        title: "Качественные Материалы",
        text: "Прочные ткани и аккуратная отделка для долгой носки.",
      },
      {
        title: "Сдержанная Эстетика",
        text: "Минимум лишнего, максимум формы и характера.",
      },
    ],
    approachTitle: "НАШ ПОДХОД",
    approachText:
      "Каждый релиз начинается с тестов посадки и материалов. Мы убираем лишние детали и оставляем только важное.",
    slowerTitle: "БОЛЕЕ ОСОЗНАННАЯ МОДА",
    slowerText:
      "Мы делаем меньше, но точнее: небольшие дропы вместо массовых циклов производства.",
    cta: "СМОТРЕТЬ КОЛЛЕКЦИЮ",
  },
  en: {
    studio: "OIMO STUDIO",
    title: "ABOUT",
    intro:
      "OIMO is a modern clothing label focused on minimal aesthetics and everyday functionality.",
    values: [
      {
        title: "Design First",
        text: "Clean cuts, balanced proportions, and garments beyond one season.",
      },
      {
        title: "Quality Materials",
        text: "Durable fabrics and precise finishing for long-term wear.",
      },
      {
        title: "Minimal Expression",
        text: "Quiet branding and confident silhouettes over fast trends.",
      },
    ],
    approachTitle: "OUR APPROACH",
    approachText:
      "Every release starts with fit and material testing. We remove unnecessary details and keep only what matters.",
    slowerTitle: "SLOWER FASHION",
    slowerText:
      "We release fewer but more focused drops instead of high-volume cycles.",
    cta: "DISCOVER COLLECTION",
  },
} as const;

export default function AboutPage() {
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 pt-24 pb-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-xs tracking-[0.25em] text-gray-500">{copy.studio}</p>
          <h1 className="text-3xl md:text-5xl tracking-[0.12em]">{copy.title}</h1>
          <p className="text-sm md:text-lg text-gray-700 max-w-3xl leading-relaxed">
            {copy.intro}
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          {copy.values.map((value) => (
            <article key={value.title} className="border border-black p-6 space-y-3">
              <h2 className="text-lg font-semibold">{value.title}</h2>
              <p className="text-sm text-gray-600">{value.text}</p>
            </article>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-8 border-t border-black pt-10">
          <div className="space-y-3">
            <h2 className="text-xl tracking-[0.08em]">{copy.approachTitle}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {copy.approachText}
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl tracking-[0.08em]">{copy.slowerTitle}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {copy.slowerText}
            </p>
          </div>
        </section>

        <section className="pt-2">
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
