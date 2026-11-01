"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import CategoryIcon from "@/app/ui/category-icon";
import { useLang } from "@/app/ui/language";
import { pick } from "@/lib/i18n";
import { getTermNames } from "@/lib/term-names";

const ALL = "all";

// 용어 이름 + 다른 언어 이름 배지 + 아래 회색 줄 (규칙은 lib/term-names.js)
function TermName({ term, lang }) {
  const { name, badge, sub } = getTermNames(term, lang);

  return (
    <>
      <h2 className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-xl font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
          {name}
        </span>
        {badge && (
          <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-xs text-muted">
            {badge}
          </span>
        )}
      </h2>
      {sub && <p className="mt-1 text-xs text-placeholder">{sub}</p>}
    </>
  );
}

export default function Glossary({ categories, terms, todayTerm, popularTerms, pageSize }) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // 검색어·분류가 바뀌면 처음 개수로 되돌림
  function changeQuery(value) {
    setQuery(value);
    setVisibleCount(pageSize);
  }

  function changeCategory(id) {
    setCategory(id);
    setVisibleCount(pageSize);
  }

  const allTermsRef = useRef(null);

  function scrollToAllTerms() {
    allTermsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function jumpToCategory(id) {
    changeCategory(id);
    scrollToAllTerms();
  }

  // 분류별 용어 수 (PC 분야별 카드)
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const item of terms) counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, [terms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((item) => {
      if (category !== ALL && item.category !== category) return false;
      if (!q) return true;
      const haystack = [
        item.term.ko,
        item.term.en,
        item.fullName?.ko,
        item.fullName?.en,
        item.description.ko,
        item.description.en,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [terms, query, category]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;
  const chips = [{ id: ALL, name: { ko: t.all, en: t.all } }, ...categories];
  // "어려운 IT 용어, 쉽게 풀어 드려요" → ["어려운 IT 용어", "쉽게 풀어 드려요"]
  const commaIndex = t.title.indexOf(",");
  const titleLines =
    commaIndex === -1
      ? [t.title]
      : [t.title.slice(0, commaIndex), t.title.slice(commaIndex + 1).trim()];

  return (
    <>
      <section className="pt-10 sm:pt-16 lg:pt-20">
        {/* PC 전용: 용어 수 */}
        <p className="mb-4 hidden text-sm text-muted lg:block">
          {t.termCount.replace("{count}", terms.length)} · {t.languageName}
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-[40px] lg:text-5xl">
          {/* 태블릿·모바일은 첫 번째 쉼표 뒤에서 줄바꿈 */}
          {titleLines.length > 1 ? (
            <>
              {titleLines[0]},<br className="lg:hidden" /> {titleLines[1]}
            </>
          ) : (
            t.title
          )}
        </h1>
        <p className="mt-5 text-[15px] text-muted sm:mt-5 sm:text-lg">
          {t.subtitle}
        </p>
      </section>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          scrollToAllTerms();
        }}
        className="mt-10 flex gap-3 lg:max-w-3xl"
      >
        <div className="relative flex-1">
          <label htmlFor="term-search" className="sr-only">
            {t.searchLabel}
          </label>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-6 size-5 -translate-y-1/2 text-foreground/70"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="term-search"
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-14 w-full rounded-full bg-surface pr-6 pl-14 text-base outline-none placeholder:text-placeholder"
          />
        </div>
        {/* PC 전용: 검색 버튼 (누르면 결과 위치로 이동) */}
        <button
          type="submit"
          className="hidden h-14 shrink-0 items-center rounded-full bg-foreground px-8 text-[15px] font-bold text-background transition-opacity hover:opacity-85 lg:inline-flex"
        >
          {t.search}
        </button>
      </form>

      {/* PC 전용: 검색창 아래 많이 찾는 용어 */}
      {popularTerms.length > 0 && (
        <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
          <span className="mr-1 text-sm text-muted">{t.popularTerms}</span>
          {popularTerms.map((item) => (
            <Link
              key={item.id}
              href={`/terms/${item.id}`}
              className="inline-flex h-8 items-center rounded-full bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              {pick(item.term, lang)}
            </Link>
          ))}
        </div>
      )}

      <section id="categories" className="scroll-mt-4">
        {/* 태블릿·모바일: 분류 아이콘 타일. 누르면 전체 용어의 해당 탭을 선택하고 그 위치로 스크롤 */}
        <ul
          className="mt-4 grid gap-2 lg:hidden"
          style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` }}
        >
          {categories.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => jumpToCategory(item.id)}
                className="flex w-full flex-col items-center gap-2 rounded-2xl border border-line px-1 py-4 transition-colors hover:bg-surface"
              >
                <CategoryIcon name={item.icon} className="size-6 text-foreground/75" />
                {/* 좁은 타일용 짧은 이름(shortName)이 있으면 우선 사용 */}
                <span className="text-[13px] font-medium leading-tight [overflow-wrap:anywhere] sm:text-sm">
                  {item.shortName?.[lang] || pick(item.name, lang)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* PC: 분야별 카드 */}
        <div className="mt-16 hidden lg:block">
          <h2 className="text-xl font-bold tracking-tight">{t.categoriesHeading}</h2>
          <ul className="mt-5 grid grid-cols-4 gap-3">
            {categories.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => jumpToCategory(item.id)}
                  className="block w-full rounded-xl border border-line p-5 text-left transition-colors hover:bg-surface"
                >
                  <CategoryIcon name={item.icon} className="size-5 text-foreground/75" />
                  <span className="mt-3 block text-base font-bold tracking-tight">
                    {pick(item.name, lang)}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {t.termCount.replace("{count}", categoryCounts[item.id] ?? 0)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="all-terms" ref={allTermsRef} className="scroll-mt-4">
        {/* 검색 중에는 결과에 집중하도록 숨김 */}
        {!query.trim() && (
          <h2 className="mt-14 text-xl font-bold tracking-tight">{t.allTerms}</h2>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group">
        {chips.map((chip) => {
          const active = chip.id === category;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={active}
              onClick={() => changeCategory(chip.id)}
              className={`h-11 rounded-full px-5 text-[15px] transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "bg-surface text-foreground/80 hover:bg-surface-hover"
              }`}
            >
              {pick(chip.name, lang)}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-8 border-t border-line md:grid md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="border-b border-line">
              <Link href={`/terms/${item.id}`} className="group block py-6">
                <TermName term={item} lang={lang} />
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {pick(item.description, lang)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border-t border-line py-16 text-center text-muted">
          {t.empty}
        </p>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + pageSize)}
          className="mt-8 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-line text-[15px] font-medium transition-colors hover:bg-surface"
        >
          {t.loadMore}
          <span className="text-muted">
            ({visible.length}/{filtered.length})
          </span>
        </button>
      )}

     {todayTerm && (
        <Link
          href={`/terms/${todayTerm.id}`}
          className="group mt-8 block bg-surface px-6 py-4 transition-colors hover:bg-surface-hover sm:mt-10"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold tracking-tight">{t.todayTerm}</h3>
            <span
              aria-hidden="true"
              className="text-muted transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed sm:line-clamp-1">
            <strong className="mr-2 font-bold text-accent">{pick(todayTerm.term, lang)}</strong>
            <span className="text-muted">{pick(todayTerm.description, lang)}</span>
          </p>
        </Link>
      )}

      {/* 태블릿·모바일: 페이지 맨 아래(푸터 위)에 표시. PC는 검색창 아래에 표시 */}
      {popularTerms.length > 0 && (
        <section className="mt-16 lg:hidden">
          <h2 className="text-xl font-bold tracking-tight">{t.popularTerms}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {popularTerms.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/terms/${item.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[15px] transition-colors hover:bg-surface"
                >
                  {pick(item.term, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
