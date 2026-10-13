"use client";

import Link from "next/link";
import { useState } from "react";

type MobileMenuItem = {
  label: string;
  href: string;
};

export default function MobileMenu({ items }: { items: MobileMenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-[#f8fafc]"
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>
      {isOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute right-0 top-12 z-40 w-56 rounded-xl border border-line bg-white p-2 shadow-[0_12px_32px_rgba(16,26,46,0.14)]">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate transition-colors hover:bg-blue-pale hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}