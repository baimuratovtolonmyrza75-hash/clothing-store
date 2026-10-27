import AdminShell from "@/components/admin/AdminShell";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { formatPrice } from "@/lib/currency";
import { getAdminOrders } from "@/lib/server/admin";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

export default async function AdminOrdersPage() {
  const language = await getServerLanguage();
  const t = translations[language];
  const orders = await getAdminOrders();

  return (
    <AdminShell
      title={t.adminOrdersTitle}
      description={t.adminOrdersCopy}
      language={language}
    >
      <section className="space-y-6">
        {orders.map((order) => (
          <article key={order.id} className="border border-black p-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs tracking-[0.3em] text-neutral-500">{t.orderNumber}</p>
                    <h2 className="mt-2 text-xl font-semibold">{order.orderNumber}</h2>
                  </div>
                  <p className="text-lg font-semibold">{formatPrice(order.totalAmount, language)}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs tracking-[0.25em] text-neutral-500">{t.personalInfo}</p>
                    <p className="mt-2 text-sm">
                      {order.firstName} {order.lastName ?? ""}
                    </p>
                    {order.phone && (
                      <p className="text-sm text-neutral-600">{t.phone}: {order.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.25em] text-neutral-500">{t.shippingAddress}</p>
                    <p className="mt-2 text-sm">{order.address}</p>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4">
                  <p className="text-xs tracking-[0.25em] text-neutral-500">{t.orderSummary}</p>
                  <div className="mt-3 space-y-2">
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
              </div>

              <div className="border border-black/10 p-5">
                <p className="text-xs tracking-[0.25em] text-neutral-500">{t.adminStatusControl}</p>
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-neutral-600">
                    <p>{t.adminCurrentOrderStatus}: {order.status}</p>
                    <p>{t.adminCurrentPaymentStatus}: {order.paymentStatus}</p>
                  </div>
                  <OrderStatusForm
                    orderId={order.id}
                    status={order.status}
                    paymentStatus={order.paymentStatus}
                    action={updateOrderStatusAction}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
