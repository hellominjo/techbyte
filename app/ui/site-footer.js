"use client";

import Link from "next/link";
import { useLang } from "@/app/ui/language";
import { fillTemplate, siteValue } from "@/lib/site";

const LINKS = [
  { href: "/about", key: "about" },
  { href: "/privacy", key: "privacy" },
  { href: "/contact", key: "contact" },
];

// 텍스트 로고 (brandName)
function Logo({ name }) {
  return (
    <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
      {name}
    </Link>
  );
}

export default function SiteFooter() {
  const { lang, t } = useLang();
  const siteName = siteValue("siteName", lang);

  return (
    <footer className="flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between print:hidden">
      <div className="flex items-center gap-4">
        <Logo name={siteValue("siteName", lang)} />
        <p className="max-w-xs text-[12px] leading-relaxed text-">
          {fillTemplate(siteValue("footerIntro", lang), lang)}
        </p>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <nav className="flex flex-wrap items-center text-xs text-muted">
          {LINKS.map((link, i) => (
            <span key={link.key} className="flex items-center">
              {i > 0 && (
                <span aria-hidden="true" className="mx-3 h-3 w-px bg-foreground/20" />
              )}
              <Link href={link.href} className="transition-colors hover:text-foreground">
                {t.footer[link.key]}
              </Link>
            </span>
          ))}
        </nav>
        <p className="text-[11px] text-placeholder" suppressHydrationWarning>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
