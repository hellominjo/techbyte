"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "@/app/logo.png";
import CategoryIcon from "@/app/ui/category-icon";
import ThemeToggle from "@/app/ui/theme-toggle";
import { setLang, useLang } from "@/app/ui/language";
import siteConfig from "@/site.config";
import { pick } from "@/lib/i18n";
import { siteValue } from "@/lib/site";

const LANGUAGES = [
  { code: "ko", label: "KO" },
  { code: "en", label: "EN" },
];

// KO | EN 두 칸 토글. 선택된 언어는 검은 배경
function LanguageSwitch({ lang, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-full border border-line p-1"
    >
      {LANGUAGES.map(({ code, label: text }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={`h-7 rounded-full px-3 text-xs font-bold tracking-wide transition-colors ${
              active ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

// 헤더 메뉴 (PC는 가로 메뉴, 모바일·태블릿은 햄버거 메뉴 안에 표시)
const MENU = [
  { href: "/read", key: "read" },
  { href: "/guides", key: "guides" },
];

export default function SiteHeader() {
  const { lang, t } = useLang();
  const mainSite = siteConfig.mainSite ?? {};
  const tagline = siteValue("tagline", lang);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Esc로 햄버거 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="print:hidden">
      <div className="flex h-14 items-center justify-between sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] tracking-tight sm:text-base"
        >
          <Image
            src={logo}
            alt=""
            width={20}
            height={20}
            preload
            className="size-7 dark:ring-1 dark:ring-white/15 techbyte:hidden"
          />
          {/* 기본(zerofound.io): ZEROFOUND TECHBYTE */}
          <span className="mt-0.5 text-[19px] font-bold tracking-tight techbyte:hidden">
            {siteValue("siteName", lang)}
          </span>
          <span className="py-0.5 text-xs font-medium text-foreground/85 tracking-tight techbyte:hidden">
            {siteValue("tagline", lang)}
          </span>
          {/* techbyte 서브도메인: TECHBYTE by ZEROFOUND (tagline과 siteName 자리를 바꿈).
              tagline을 반으로 나눠 뒤쪽(BYTE)만 파란색 */}
          <span className="mt-0.5 hidden text-[21px] font-bold techbyte:inline">
            {tagline.slice(0, Math.ceil(tagline.length / 2))}
            <span className="text-(--brand-blue)">{tagline.slice(Math.ceil(tagline.length / 2))}</span>
          </span>
          <span className="hidden py-0.5 text-xs font-medium text-foreground/85 tracking-tight techbyte:inline">
            by {siteValue("siteName", lang)}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* PC 전용 메뉴 */}
          <nav className="mr-4 hidden items-center gap-6 text-sm text-muted lg:flex">
            {MENU.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`transition-colors hover:text-foreground ${
                  isActive(item.href) ? "font-bold text-foreground" : ""
                }`}
              >
                {t.nav[item.key]}
              </Link>
            ))}
            {mainSite.url && (
              <a
                href={mainSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {pick(mainSite.label, lang)} ↗
              </a>
            )}
          </nav>
          {/* 640px 미만은 공간이 좁아 언어 선택을 햄버거 메뉴 안으로 */}
          <div className="hidden sm:block">
            <LanguageSwitch lang={lang} label={t.language} />
          </div>
          <ThemeToggle label={t.toggleTheme} />
          {/* 모바일·태블릿 햄버거 버튼 */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.menuClose : t.menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground lg:hidden"
          >
            <CategoryIcon name={menuOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {/* 모바일·태블릿 햄버거 메뉴 (헤더 아래로 펼쳐짐) */}
      {menuOpen && (
        <nav id="mobile-menu" className="border-y border-line pb-4 lg:hidden">
          <ul>
            {MENU.map((item) => (
              <li key={item.key} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-4 text-base transition-colors hover:text-foreground ${
                    isActive(item.href) ? "font-bold text-foreground" : "text-foreground/80"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {mainSite.url && (
              <li className="border-b border-line">
                <a
                  href={mainSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-4 text-base text-foreground/80 transition-colors hover:text-foreground"
                >
                  {pick(mainSite.label, lang)}
                  <span aria-hidden="true" className="text-muted">↗</span>
                </a>
              </li>
            )}
          </ul>
          <div className="mt-4 flex items-center justify-between sm:hidden">
            <span className="text-sm text-muted">{t.language}</span>
            <LanguageSwitch lang={lang} label={t.language} />
          </div>
        </nav>
      )}
    </header>
  );
}
