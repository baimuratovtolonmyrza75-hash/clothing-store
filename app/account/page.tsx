import { requireUser } from "@/lib/auth/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import { formatPrice } from "@/lib/currency";
import { getOrdersByUser } from "@/lib/server/orders";
import Link from "next/link";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function AccountPage() {
  const user = await requireUser();
  const orders = await getOrdersByUser(user.id);
  const language = await getServerLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-white px-6 pb-12 pt-36 text-black">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 border border-black p-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.35em] text-neutral-500">{t.authAccount}</p>
            <h1 className="text-4xl font-semibold">{t.accountWelcome}, {user.name ?? user.email}</h1>
            <p className="text-sm text-neutral-600">
              {t.accountConnected}
            </p>
          </div>
          <SignOutButton />
        </div>

        {user.role === "ADMIN" && (
          <div className="border border-black bg-black p-6 text-white">
            <p className="text-xs tracking-[0.35em] text-white/70">{t.accountAdminAccess}</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/80">
                {t.accountAdminCopy}
              </p>
              <Link
                href="/admin"
                className="border border-white px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-black"
              >
                {t.accountOpenAdmin}
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-black p-6">
            <p className="text-xs tracking-[0.3em] text-neutral-500">{t.emailLabel}</p>
            <p className="mt-3 text-lg font-medium">{user.email}</p>
          </div>
          <div className="border border-black p-6">
            <p className="text-xs tracking-[0.3em] text-neutral-500">{t.roleLabel}</p>
            <p className="mt-3 text-lg font-medium">{user.role}</p>
          </div>
          <div className="border border-black p-6">
            <p className="text-xs tracking-[0.3em] text-neutral-500">{t.statusLabel}</p>
            <p className="mt-3 text-lg font-medium">{t.accountAuthenticated}</p>
          </div>
        </div>

        <section className="border border-black p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-neutral-500">{t.adminOrders}</p>
              <h2 className="mt-3 text-2xl font-semibold">{t.accountRecentOrders}</h2>
            </div>
            <p className="text-sm text-neutral-500">{orders.length} {t.accountTotal}</p>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-neutral-600">
              {t.accountNoOrders}
            </p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="border border-black/10 p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-neutral-500">
                        {order.status}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatPrice(order.totalAmount, language)}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <p>
                          {item.productName} / {item.size} / x{item.quantity}
                        </p>
                        <p>{formatPrice(item.lineTotal, language)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
