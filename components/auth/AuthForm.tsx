"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type AuthActionState } from "@/app/(auth)/actions";
import { useLanguage } from "@/context/LanguageContext";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  action: (
    state: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();
  const { t } = useLanguage();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white py-4 font-semibold tracking-[0.25em] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t("authPleaseWait") : mode === "sign-in" ? t("authSignIn") : t("authCreateAccount")}
    </button>
  );
}

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, { error: null });
  const { t } = useLanguage();

  return (
    <form action={formAction} className="space-y-5">
      {mode === "sign-up" && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs tracking-[0.3em] text-neutral-500">
            {t("authName")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-black px-4 py-4 outline-none transition focus:bg-neutral-50"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs tracking-[0.3em] text-neutral-500">
          {t("authEmailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border border-black px-4 py-4 outline-none transition focus:bg-neutral-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-xs tracking-[0.3em] text-neutral-500">
          {t("authPassword")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          required
          className="w-full border border-black px-4 py-4 outline-none transition focus:bg-neutral-50"
        />
      </div>

      {state.error && (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton mode={mode} />

      <p className="text-sm text-neutral-600">
        {mode === "sign-in" ? `${t("authNoAccount")} ` : `${t("authHasAccount")} `}
        <Link
          href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
          className="font-semibold text-black underline underline-offset-4"
        >
          {mode === "sign-in" ? t("authCreateOne") : t("authSignIn")}
        </Link>
      </p>
    </form>
  );
}
