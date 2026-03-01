import { Language } from "./i18n";

export function formatPrice(price: number, language: Language): string {
  const locales = {
    kg: "ky-KG",
    ru: "ru-KG",
    en: "en-KG",
  };

  return new Intl.NumberFormat(locales[language], {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(price);
}
