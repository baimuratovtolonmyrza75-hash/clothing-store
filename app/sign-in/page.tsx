import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth/auth";
import { signInAction } from "@/app/(auth)/actions";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function SignInPage() {
  const user = await getCurrentUser();
  const language = await getServerLanguage();
  const t = translations[language];

  if (user) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-12 pt-36 text-black">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between border border-black p-8 md:p-12">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.35em] text-neutral-500">{t.authTitle}</p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              {t.authSignInHeadline}
            </h1>
            <p className="max-w-md text-sm leading-7 text-neutral-600">
              {t.authSignInCopy}
            </p>
          </div>

          <div className="mt-10 h-48 bg-[linear-gradient(135deg,#111_0%,#2b2b2b_35%,#fff_35%,#fff_100%)]" />
        </section>

        <section className="border border-black p-8 md:p-12">
          <div className="mb-8">
            <p className="text-xs tracking-[0.35em] text-neutral-500">{t.authTitle}</p>
            <h2 className="mt-3 text-2xl font-semibold">{t.authWelcomeBack}</h2>
          </div>
          <AuthForm mode="sign-in" action={signInAction} />
        </section>
      </div>
    </main>
  );
}
