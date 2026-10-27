import Link from "next/link";
import { translations, type Language } from "@/lib/i18n";

type AdminShellProps = {
  title: string;
  description: string;
  language: Language;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  description,
  language,
  children,
}: AdminShellProps) {
  const t = translations[language];
  const navItems = [
    { href: "/admin", label: t.adminOverview },
    { href: "/admin/orders", label: t.adminOrders },
    { href: "/admin/products", label: t.adminProducts },
  ];

  return (
    <main className="min-h-screen bg-white px-6 pb-12 pt-36 text-black">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-6 border border-black p-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.35em] text-neutral-500">{t.adminPanel}</p>
            <h1 className="text-4xl font-semibold">{title}</h1>
          </div>
          <div className="space-y-5">
            <p className="max-w-2xl text-sm leading-7 text-neutral-600">{description}</p>
            <nav className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
