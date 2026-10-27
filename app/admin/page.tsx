import AdminShell from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/currency";
import { getAdminOrders, getAdminOverview, getAdminProducts } from "@/lib/server/admin";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function AdminOverviewPage() {
  const language = await getServerLanguage();
  const t = translations[language];
  const overview = await getAdminOverview();
  const orders = await getAdminOrders();
  const products = await getAdminProducts();
  const revenue = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <AdminShell
      title={t.adminOverviewTitle}
      description={t.adminOverviewCopy}
      language={language}
    >
      <section className="grid gap-6 md:grid-cols-4">
        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminOrders}</p>
          <p className="mt-3 text-3xl font-semibold">{overview.ordersCount}</p>
        </div>
        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminPending}</p>
          <p className="mt-3 text-3xl font-semibold">{overview.pendingOrdersCount}</p>
        </div>
        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminProducts}</p>
          <p className="mt-3 text-3xl font-semibold">{overview.productsCount}</p>
        </div>
        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminUsers}</p>
          <p className="mt-3 text-3xl font-semibold">{overview.usersCount}</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminLatestOrders}</p>
          <div className="mt-6 space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="border-b border-black/10 pb-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-neutral-500">
                      {order.firstName} {order.lastName ?? ""} / {order.status} /{" "}
                      {order.paymentStatus}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(order.totalAmount, language)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black p-6">
          <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminRevenueSnapshot}</p>
          <p className="mt-4 text-3xl font-semibold">{formatPrice(revenue, language)}</p>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            {t.adminPaidOrdersOnly}
          </p>

          <div className="mt-8 border-t border-black/10 pt-6">
            <p className="text-xs tracking-[0.3em] text-neutral-500">{t.adminActiveCatalog}</p>
            <p className="mt-3 text-2xl font-semibold">
              {products.filter((product) => product.isActive).length}
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
