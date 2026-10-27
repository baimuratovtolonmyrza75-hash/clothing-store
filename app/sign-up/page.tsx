import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth/auth";
import { signUpAction } from "@/app/(auth)/actions";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  const language = await getServerLanguage();
  const t = translations[language];

  if (user) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-12 pt-36 text-black">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-black p-8 md:p-12">
          <div className="mb-8">
            <p className="text-xs tracking-[0.35em] text-neutral-500">{t.authCreateAccount}</p>
            <h1 className="mt-3 text-2xl font-semibold">{t.authCreateProfile}</h1>
          </div>
          <AuthForm mode="sign-up" action={signUpAction} />
        </section>

        <section className="flex flex-col justify-between border border-black bg-neutral-950 p-8 text-white md:p-12">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.35em] text-neutral-400">{t.authAccount}</p>
            <h2 className="max-w-md text-4xl font-semibold leading-tight">
              {t.authMembershipHeadline}
            </h2>
            <p className="max-w-md text-sm leading-7 text-neutral-300">
              {t.authMembershipCopy}
            </p>
          </div>

          <div className="mt-10 border-t border-white/20 pt-6 text-sm text-neutral-300">
            {t.authEmailPasswordOnly}
          </div>
        </section>
      </div>
    </main>
  );
}
