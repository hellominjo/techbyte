"use client";

import Link from "next/link";
import { useLang } from "@/app/ui/language";
import { pick } from "@/lib/i18n";

// 1페이지는 /read, 2페이지부터 /read/page/2
function pageHref(basePath, page) {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

// 목록 아래 페이지 번호: ← 이전  1 2 3  다음 →
function Pagination({ basePath, page, totalPages, t }) {
  const step = "inline-flex h-10 items-center px-3 text-sm transition-colors";
  return (
    <nav aria-label={t.pagination} className="mt-10 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={pageHref(basePath, page - 1)} className={`${step} text-muted hover:text-foreground`}>
          ← {t.prevPage}
        </Link>
      ) : (
        <span className={`${step} text-placeholder`}>← {t.prevPage}</span>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className="inline-flex size-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background"
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={pageHref(basePath, n)}
            className="inline-flex size-10 items-center justify-center rounded-full text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            {n}
          </Link>
        )
      )}
      {page < totalPages ? (
        <Link href={pageHref(basePath, page + 1)} className={`${step} text-muted hover:text-foreground`}>
          {t.nextPage} →
        </Link>
      ) : (
        <span className={`${step} text-placeholder`}>{t.nextPage} →</span>
      )}
    </nav>
  );
}

// 마크다운 글 목록 (쉽게 읽는 IT, 용어 가이드 공통). 영어 버전이 없는 글은 한국어로 표시
// 페이지가 2개 이상일 때만 아래에 페이지 번호 표시
export default function PostList({ section, basePath, posts, page = 1, totalPages = 1 }) {
  const { lang, t } = useLang();

  return (
    <div className="pt-10 sm:pt-16">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-4xl">
        {pick(section.title, lang)}
      </h1>
      <p className="mt-2 text-[15px] text-muted sm:mt-3 sm:text-lg">
        {pick(section.description, lang)}
      </p>

      {posts.length > 0 ? (
        <ul className="mt-10 border-t border-line">
          {posts.map((post) => {
            const meta = (lang === "en" && post.en) || post.ko;
            return (
              <li key={post.slug} className="border-b border-line">
                <Link href={`${basePath}/${post.slug}`} className="group block py-6">
                  <h2 className="text-xl font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {meta.title}
                  </h2>
                  {meta.description && (
                    <p className="mt-2 text-base leading-relaxed text-muted">{meta.description}</p>
                  )}
                  {meta.date && (
                    <time dateTime={meta.date} className="mt-2 block text-xs text-placeholder">
                      {meta.date}
                    </time>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-10 border-t border-line py-16 text-center text-muted">{t.noPosts}</p>
      )}

      {totalPages > 1 && (
        <Pagination basePath={basePath} page={page} totalPages={totalPages} t={t} />
      )}
    </div>
  );
}
