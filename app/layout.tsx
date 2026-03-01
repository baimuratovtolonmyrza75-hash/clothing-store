import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import ToastProvider from "@/context/ToastContext";
import LanguageProvider from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "OIMO - Fashion Store",
  description: "Modern minimalist clothing store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <LanguageProvider>
            <ToastProvider>
              <Navbar />
              {children}
            </ToastProvider>
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  );
}