"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";
import type { Language } from "@/lib/i18n";

type OrderChannel = "telegram" | "whatsapp";

type OrderMessageItem = {
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const messageLabels: Record<Language, {
  greeting: string;
  items: string;
  subtotal: string;
  shipping: string;
  free: string;
  total: string;
  customer: string;
  firstName: string;
  phone: string;
  address: string;
}> = {
  kg: {
    greeting: "Саламатсызбы! Мен заказ бергим келет",
    items: "Товарлар",
    subtotal: "Товарлардын суммасы",
    shipping: "Жеткирүү",
    free: "Акысыз",
    total: "Жалпы сумма",
    customer: "Кардардын маалыматтары",
    firstName: "Аты",
    phone: "Телефон",
    address: "Дарек",
  },
  ru: {
    greeting: "Здравствуйте! Хочу оформить заказ",
    items: "Товары",
    subtotal: "Сумма товаров",
    shipping: "Доставка",
    free: "Бесплатно",
    total: "Итого",
    customer: "Данные покупателя",
    firstName: "Имя",
    phone: "Телефон",
    address: "Адрес",
  },
  en: {
    greeting: "Hello! I would like to place order",
    items: "Items",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    customer: "Customer details",
    firstName: "First name",
    phone: "Phone",
    address: "Address",
  },
};

function buildOrderMessage({
  orderNumber,
  items,
  totalAmount,
  customer,
  language,
}: {
  orderNumber: string;
  items: OrderMessageItem[];
  totalAmount: number;
  customer: {
    firstName: string;
    phone: string;
    address: string;
  };
  language: Language;
}) {
  const labels = messageLabels[language];
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return [
    `${labels.greeting} ${orderNumber}.`,
    "",
    `${labels.items}:`,
    ...items.map(
      (item) =>
        `• ${item.productName} — ${item.size}, ${item.quantity} × ${formatPrice(item.unitPrice, language)} = ${formatPrice(item.lineTotal, language)}`
    ),
    `${labels.subtotal}: ${formatPrice(subtotal, language)}`,
    `${labels.shipping}: ${labels.free}`,
    `${labels.total}: ${formatPrice(totalAmount, language)}`,
    "",
    `${labels.customer}:`,
    `${labels.firstName}: ${customer.firstName}`,
    `${labels.phone}: ${customer.phone}`,
    `${labels.address}: ${customer.address}`,
  ].join("\n");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { language, t } = useLanguage();
  const [orderChannel, setOrderChannel] = useState<OrderChannel>("telegram");

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError(t("fillAllFields"));
      return;
    }

    // Open a tab while the click is still a user gesture. Some browsers block
    // opening external messenger links after an awaited network request.
    const messengerWindow = window.open("about:blank", "_blank");
    if (messengerWindow) {
      messengerWindow.opener = null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cart: cart.map(({ id, size, quantity }) => ({ id, size, quantity })),
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        orderNumber?: string;
        totalAmount?: number;
        items?: OrderMessageItem[];
      };

      if (
        !response.ok ||
        !result.orderNumber ||
        typeof result.totalAmount !== "number" ||
        !result.items
      ) {
        messengerWindow?.close();
        setError(
          response.status === 409
            ? t("orderUnavailableError")
            : result.error ?? t("orderFailedError")
        );
        setIsLoading(false);
        return;
      }

      const message = buildOrderMessage({
        orderNumber: result.orderNumber,
        items: result.items,
        totalAmount: result.totalAmount,
        customer: formData,
        language,
      });
      const encodedMessage = encodeURIComponent(message);
      const telegramUsername = (
        process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? "sylnxxx"
      ).replace(/^@/, "").trim();
      const whatsappNumber = (
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "996995302801"
      ).replace(/\D/g, "");

      const contactUrl = orderChannel === "telegram"
        ? telegramUsername
          ? `https://t.me/${telegramUsername}?text=${encodedMessage}`
          : `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodedMessage}`
        : whatsappNumber
          ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
          : `https://wa.me/?text=${encodedMessage}`;

      clearCart();
      if (messengerWindow && !messengerWindow.closed) {
        messengerWindow.location.href = contactUrl;
      } else {
        window.location.assign(contactUrl);
      }
    } catch {
      messengerWindow?.close();
      setError(t("orderFailedError"));
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 pb-10 pt-28 text-black sm:px-10 sm:pt-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">{t("checkoutTitle")}</h1>
          <p className="text-gray-600 mb-8">{t("cartEmpty")}</p>
          <button
            onClick={() => router.push("/")}
            className="border border-black px-8 py-3 hover:bg-black hover:text-white transition"
          >
            {t("continueShopping")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-10 pt-28 text-black sm:px-10 sm:pt-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-12">{t("checkoutTitle")}</h1>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{t("personalInfo")}</h2>
                <div className="grid gap-4">
                  <input
                    type="text"
                    name="firstName"
                    maxLength={80}
                    autoComplete="name"
                    placeholder={`${t("firstName")} *`}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    maxLength={40}
                    autoComplete="tel"
                    placeholder={`${t("phone")} *`}
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">{t("shippingAddress")}</h2>
                <input
                  type="text"
                  name="address"
                  maxLength={200}
                  autoComplete="street-address"
                  placeholder={`${t("address")} *`}
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black mb-4"
                  required
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="text-xl font-semibold">{t("orderContactMethod")}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["telegram", "whatsapp"] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      aria-pressed={orderChannel === channel}
                      onClick={() => setOrderChannel(channel)}
                      className={`border px-4 py-4 text-left font-semibold transition ${
                        orderChannel === channel
                          ? "border-black bg-black text-white"
                          : "border-black hover:bg-neutral-100"
                      }`}
                    >
                      {channel === "telegram" ? t("orderTelegram") : t("orderWhatsApp")}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-600">{t("orderDraftNote")}</p>
              </fieldset>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 font-semibold text-lg transition ${
                  isLoading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("processing")}
                  </span>
                ) : orderChannel === "telegram" ? (
                  t("placeOrderTelegram")
                ) : (
                  t("placeOrderWhatsApp")
                )}
              </button>

              {error && (
                <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="md:sticky md:top-10 md:h-fit">
            <div className="border border-black p-6 space-y-6">
              <h2 className="text-xl font-semibold">{t("orderSummary")}</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between items-start gap-4 pb-4 border-b"
                  >
                    <div className="flex gap-3 flex-1">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={item.images[0] || "/oimo-logo.svg"}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {t("size")}: {item.size}
                        </p>
                        <p className="text-xs text-gray-600">
                          {t("quantity")}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatPrice(item.price * item.quantity, language)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>{t("subtotal")}:</span>
                  <span>{formatPrice(total, language)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("shipping")}:</span>
                  <span>{t("free")}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>{t("total")}:</span>
                  <span>{formatPrice(total, language)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
