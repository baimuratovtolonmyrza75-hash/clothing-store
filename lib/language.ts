import { cookies } from "next/headers";
import type { Language } from "@/lib/i18n";

const supportedLanguages = new Set<Language>(["kg", "ru", "en"]);

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get("language")?.value;

  if (value && supportedLanguages.has(value as Language)) {
    return value as Language;
  }

  return "kg";
}
