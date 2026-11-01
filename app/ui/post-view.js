"use client";

import Link from "next/link";
import { useLang } from "@/app/ui/language";
import { pick } from "@/lib/i18n";

// 이전·다음 글 카드 (용어 상세의 이전·다음 용어와 같은 모양)
function AdjacentPosts({ prev, next, basePath, lang, t }) {
  const card = (post, label, align) => {
    const meta = (lang === "en" && post.en) || post.ko;
    return (
      <Link
        href={`${basePath}/${post.slug}`}
        className={`group block rounded-xl border border-line px-5 py-4 transition-colors hover:bg-surface ${align}`}
      >
        <span className="block text-xs text-muted">{label}</span>
        <span className="mt-1 block truncate text-[15px] font-bold tracking-tight">{meta.title}</span>
      </Link>
    );
  };

  return (
    <nav aria-label={`${t.prevPost} / ${t.nextPost}`} className="grid grid-cols-2 gap-3 print:hidden">
      {prev ? card(prev, `← ${t.prevPost}`, "text-left") : <span />}
      {next ? card(next, `${t.nextPost} →`, "text-right") : <span />}
    </nav>
  );
}

// 용어 태그 하나: 등록된 용어면 용어 페이지 링크, 아니면 글자만
function Chip({ chip, lang, className }) {
  const label = pick(chip.label, lang);
  return chip.href ? (
    <Link href={chip.href} className={`${className} transition-colors hover:bg-surface`}>
      {label}
    </Link>
  ) : (
    <span className={className}>{label}</span>
  );
}

// 본문 중간 [[terms]] 자리에 들어가는 용어 박스 (쉽게 읽는 IT의 '이야기 속 IT 개념')
function InlineTerms({ chips, label, lang }) {
  return (
    <section className="my-8 rounded-xl bg-surface px-5 py-4">
      <h2 className="text-sm font-bold">{label}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <li key={i}>
            <Chip
              chip={chip}
              lang={lang}
              className="inline-flex h-8 items-center rounded-full border border-line bg-background px-3 text-sm"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

// 마크다운 글 상세. 본문 HTML은 빌드할 때 content/*.md에서 변환된 것 (사이트 운영자가 작성한 내용)
export default function PostView({ section, basePath, post, adjacent }) {
  const { lang, t } = useLang();
  const content = (lang === "en" && post.en) || post.ko;
  const termsLabel = section.termsLabel ? pick(section.termsLabel, lang) : t.postTerms;
  const inline = content.htmlAfter !== null && content.chips.length > 0;

  return (
    <article className="pt-4 sm:pt-8">
      <Link
        href={basePath}
        className="text-[15px] text-muted transition-colors hover:text-foreground print:hidden"
      >
        ← {pick(section.title, lang)}
      </Link>

      <header className="mt-10">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight lg:text-4xl">
          {content.title}
        </h1>
        {content.description && (
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {content.description}
          </p>
        )}
        {content.date && (
          <time dateTime={content.date} className="mt-3 block text-xs text-placeholder">
            {content.date}
          </time>
        )}
      </header>

      <div className="mt-8 border-t border-line pt-8">
        <div className="markdown" dangerouslySetInnerHTML={{ __html: content.html }} />
        {content.htmlAfter !== null && (
          <>
            {inline && <InlineTerms chips={content.chips} label={termsLabel} lang={lang} />}
            <div className="markdown" dangerouslySetInnerHTML={{ __html: content.htmlAfter }} />
          </>
        )}
      </div>

      {/* 본문에 [[terms]]가 없으면 용어 태그를 본문 아래에 표시 */}
      {!inline && content.chips.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[15px] font-bold">{termsLabel}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {content.chips.map((chip, i) => (
              <li key={i}>
                <Chip
                  chip={chip}
                  lang={lang}
                  className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[13px]"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {adjacent && (adjacent.prev || adjacent.next) && (
        <div className="mt-14">
          <AdjacentPosts {...adjacent} basePath={basePath} lang={lang} t={t} />
        </div>
      )}
    </article>
  );
}
