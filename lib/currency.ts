import { Language } from "./i18n";

export function formatPrice(price: number, language: Language): string {
  const rounded = Math.round(price);
  const grouped = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (language === "en") {
    return `${grouped} KGS`;
  }

  return `${grouped} сом`;
}
