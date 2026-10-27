import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { getOrderByNumber } from "@/lib/server/orders";
import { translations } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/language";

type OrderConfirmationPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { order } = await searchParams;
  const placedOrder = order ? await getOrderByNumber(order) : null;
  const language = await getServerLanguage();
  const t = translations[language];

  if (!placedOrder) {
    return (
      <main className="min-h-screen bg-white text-black p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{t.orderNotFound}</p>
          <Link
            href="/"
            className="border border-black px-6 py-3 hover:bg-black hover:text-white transition"
          >
            {t.continueShopping}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black p-10 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-[scaleIn_0.6s_ease]">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2">{t.thanksForOrder}</h1>
          <p className="text-gray-600 text-lg">{t.orderSuccess}</p>
        </div>

        <div className="bg-gray-50 border border-black p-8 space-y-4 rounded">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t.orderNumber}</p>
            <p className="text-2xl font-bold font-mono">{placedOrder.orderNumber}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-1">{t.total}</p>
            <p className="text-3xl font-bold">{formatPrice(placedOrder.totalAmount, language)}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">{t.orderSummary}</p>
            <div className="space-y-2 text-left">
              {placedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-xs text-gray-600">
                      {t.size}: {item.size} | {t.quantity}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.lineTotal, language)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">{t.shipmentInfo}</p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/"
            className="w-full bg-black text-white py-4 font-semibold hover:bg-gray-800 transition rounded"
          >
            {t.continueButton}
          </Link>
          <Link
            href="/account"
            className="block w-full border border-black py-4 text-center font-semibold hover:bg-black hover:text-white transition rounded"
          >
            {t.authAccount}
          </Link>
        </div>
      </div>
    </main>
  );
}
