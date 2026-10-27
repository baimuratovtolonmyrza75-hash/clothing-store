"use client";

import Link from "next/link";
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

export default function MenuDrawer({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  user: AuthUser | null;
}) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white text-black z-50 transform transition-all duration-500 ease-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button className="p-6 text-xl" onClick={() => setOpen(false)}>
        X
      </button>

      <div className="h-[calc(100%-72px)] flex flex-col">
        <div className="flex flex-col gap-8 p-10 text-2xl tracking-widest">
          <Link href="/shop" onClick={() => setOpen(false)}>SHOP</Link>
          <Link href="/archive" onClick={() => setOpen(false)}>ARCHIVE</Link>
          <Link href="/about" onClick={() => setOpen(false)}>ABOUT</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>CONTACT</Link>
          <Link href={user ? "/account" : "/sign-in"} onClick={() => setOpen(false)}>
            {user ? "ACCOUNT" : "SIGN IN"}
          </Link>
        </div>

        <div className="mt-auto p-6 border-t border-black/10 flex items-center gap-3">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 border border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-10 h-10 border border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            <TikTokIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
