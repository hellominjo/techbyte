"use client";

import { useLayoutEffect } from "react";
import { THEME_STORAGE_KEY, getPreferredTheme } from "@/lib/theme";

export default function ThemeToggle({ label }) {
  // 개발 모드 Strict Mode 재마운트 시 <html> 속성이 초기화되므로 다시 적용 (프로덕션에서는 영향 없음)
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", getPreferredTheme());
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      {/* 라이트 모드: 달 아이콘 */}
      <svg
        className="size-5 dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
      {/* 다크 모드: 해 아이콘 */}
      <svg
        className="hidden size-5 dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}
