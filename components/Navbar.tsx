"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CartDrawer from "./CartDrawer";
import MenuDrawer from "./MenuDrawer";
import CartCounter from "./CartCounter";
import type { AuthUser } from "@/lib/auth/auth";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-none">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
      <path d="M14.5 4h2.1c.3 1.7 1.6 3.1 3.4 3.3v2.2a7 7 0 0 1-3.3-1v6.1a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8.1 1.2.2v2.3a2.9 2.9 0 1 0 1.8 2.7V4Z" />
    </svg>
  );
}

export default function Navbar({ user }: { user: AuthUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, isCartOpen, openCart, closeCart } = useCart();
  const { language, setLanguage } = useLanguage();

  const isOpen = menuOpen || isCartOpen;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-sm font-semibold tracking-wider"
        >
          MENU
        </button>

        <Link
          href="/"
          className="cursor-pointer hover:opacity-60 transition"
        >
          <Image
            src="/oimo-logo.svg"
            alt="OIMO logo"
            width={104}
            height={104}
            className="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24"
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href={user ? "/account" : "/sign-in"}
            className="text-sm font-semibold tracking-wider"
          >
            {user ? "ACCOUNT" : "SIGN IN"}
          </Link>

          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setLanguage("kg")}
              className={`px-2 py-1 border rounded-md ${
                language === "kg"
                  ? "bg-black text-white"
                  : "border-black hover:bg-black hover:text-white"
              } transition`}
            >
              KG
            </button>
            <button
              onClick={() => setLanguage("ru")}
              className={`px-2 py-1 border rounded-md ${
                language === "ru"
                  ? "bg-black text-white"
                  : "border-black hover:bg-black hover:text-white"
              } transition`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 border rounded-md ${
                language === "en"
                  ? "bg-black text-white"
                  : "border-black hover:bg-black hover:text-white"
              } transition`}
            >
              EN
            </button>
          </div>

          <button
            onClick={openCart}
            className="text-sm font-semibold tracking-wider relative"
          >
            CART
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 text-xs bg-white text-black w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <a
          href="https://www.instagram.com/sylnnxx?igsh=dTU4bWc5Z2xldXo0"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-10 h-10 border border-black rounded-full flex items-center justify-center bg-white hover:bg-black hover:text-white transition"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://www.tiktok.com/@sylnnxx?_r=1&_t=ZS-94HCpl0b2ge"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="w-10 h-10 border border-black rounded-full flex items-center justify-center bg-white hover:bg-black hover:text-white transition"
        >
          <TikTokIcon />
        </a>
      </div>

      <div className="relative">
        <CartCounter />
      </div>

      <div
        onClick={() => {
          setMenuOpen(false);
          closeCart();
        }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <MenuDrawer open={menuOpen} setOpen={setMenuOpen} user={user} />
      <CartDrawer
        open={isCartOpen}
        setOpen={(v) => (v ? openCart() : closeCart())}
      />
    </>
  );
}
