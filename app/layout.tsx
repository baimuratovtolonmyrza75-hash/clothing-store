import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import ToastProvider from "@/context/ToastContext";
import LanguageProvider from "@/context/LanguageContext";
import { getCurrentUser } from "@/lib/auth/auth";
import { getServerLanguage } from "@/lib/language";

export const metadata: Metadata = {
  title: "OIMO - Fashion Store",
  description: "Modern minimalist clothing store",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const language = await getServerLanguage();

  return (
    <html lang={language === "kg" ? "ky" : language}>
      <body>
        <CartProvider>
          <LanguageProvider initialLanguage={language}>
            <ToastProvider>
              <Navbar user={user} />
              {children}
            </ToastProvider>
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  );
}
