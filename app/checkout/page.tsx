"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/currency";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kyrgyzstan",
  });

  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.address) {
      alert(t("fillAllFields"));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/order-confirmation");
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white text-black p-10">
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
    <main className="min-h-screen bg-white text-black p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-12">{t("checkoutTitle")}</h1>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{t("personalInfo")}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder={`${t("firstName")} *`}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t("lastName")}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="email"
                    name="email"
                    placeholder={`${t("email")} *`}
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("phone")}
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">{t("shippingAddress")}</h2>
                <input
                  type="text"
                  name="address"
                  placeholder={`${t("address")} *`}
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black mb-4"
                  required
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder={`${t("city")} *`}
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder={`${t("postalCode")} *`}
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border border-black px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>Kyrgyzstan</option>
                    <option>Kazakhstan</option>
                    <option>Uzbekistan</option>
                    <option>Russia</option>
                    <option>Canada</option>
                    <option>UK</option>
                    <option>Germany</option>
                  </select>
                </div>
              </div>

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
                ) : (
                  t("placeOrder")
                )}
              </button>
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
                          src={item.image[0]}
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
