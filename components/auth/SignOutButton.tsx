"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await signOutAction();
        });
      }}
      className="border border-black px-4 py-2 text-xs font-semibold tracking-[0.25em] transition hover:bg-black hover:text-white"
      disabled={isPending}
    >
      {isPending ? t("exiting") : t("signOut")}
    </button>
  );
}
