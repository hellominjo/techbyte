"use client";

import Link from "next/link";
import { useLang } from "@/app/ui/language";
import PageActions from "@/app/ui/page-actions";
import { pick, pickList } from "@/lib/i18n";
import { siteValue } from "@/lib/site";
import { termToMarkdown } from "@/lib/term-markdown";
import { getTermNames } from "@/lib/term-names";

// "대규모 언어 모델 (LLM)" 형태. 정식 명칭이 없으면 용어 이름만
function displayName(term, lang) {
  const name = pick(term.term, lang);
  const full = term.fullName?.[lang];
  return full && full !== name ? `${full} (${name})` : name;
}

function SectionLabel({ children, className = "" }) {
  return (
    <h2 className={`text-[15px] font-bold text-accent ${className}`}>
      {children}
    </h2>
  );
}

// 배경색으로 영역만 구분하는 박스. 색은 className으로 지정 (쉽게 비유하면, 활용 예시)
function TintedBox({ label, className, children }) {
  return (
    <section className={`rounded-xl px-5 py-5 sm:px-6 ${className}`}>
      <h2 className="text-[15px] font-bold">{label}</h2>
      <div className="mt-3 text-base leading-loose text-foreground/85">{children}</div>
    </section>
  );
}

// 함께 보면 좋은 용어. 태블릿·모바일은 본문 아래, PC는 오른쪽 사이드바에 같은 모양으로 표시
function RelatedTerms({ related, lang, t, className = "" }) {
  return (
    <section className={className}>
      {/* 제목 검정, 관계 꼬리표 회색, 작은 글씨 (모든 화면 공통) */}
      <h2 className="border-b border-line pb-4 text-[15px] font-bold">{t.relatedTerms}</h2>
      <ul>
        {related.map(({ type, term: item }) => (
          <li key={item.id} className="border-b border-line last:border-b-0">
            <Link href={`/terms/${item.id}`} className="group block py-4">
              <span className="text-xs font-medium text-muted">
                {t.relation[type] ?? t.relation.related}
              </span>
              <h3 className="mt-1 text-base font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
                {displayName(item, lang)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {pick(item.description, lang)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 이전·다음 용어 카드. 정식 명칭이 있으면 정식 명칭으로 표시
function AdjacentTerms({ prev, next, lang, t }) {
  const card = (item, label, align) => (
    <Link
      href={`/terms/${item.id}`}
      className={`group block rounded-xl border border-line px-5 py-4 transition-colors hover:bg-surface ${align}`}
    >
      <span className="block text-xs text-muted">{label}</span>
      <span className="mt-1 block truncate text-[15px] font-bold tracking-tight">
        {item.fullName?.[lang] || pick(item.term, lang)}
      </span>
    </Link>
  );

  return (
    <nav aria-label={`${t.prevTerm} / ${t.nextTerm}`} className="grid grid-cols-2 gap-3 print:hidden">
      {prev ? card(prev, `← ${t.prevTerm}`, "text-left") : <span />}
      {next ? card(next, `${t.nextTerm} →`, "text-right") : <span />}
    </nav>
  );
}

export default function TermDetail({
  term,
  category,
  keywords,
  comparison,
  tools,
  related,
  adjacent,
}) {
  const { lang, t } = useLang();
  const names = getTermNames(term, lang);
  const analogy = pick(term.analogy, lang);
  const background = pickList(term.background, lang);
  const steps = pickList(term.howItWorks, lang);
  const usage = pickList(term.usage, lang);
  const details = pickList(term.details, lang);
  const examples = pickList(term.examples, lang);
  const misconceptions = term.misconceptions ?? [];

  const url = `${siteValue("siteUrl", lang)}/terms/${term.id}`;
  const aiPrompt = t.pageActions.prompt
    .replace("{name}", names.name)
    .replace("{summary}", pick(term.description, lang))
    .replace("{url}", url);
  const pageActions = (
    <PageActions
      text={t.pageActions}
      prompt={aiPrompt}
      getMarkdown={() => termToMarkdown({ term, comparison, related, lang, url })}
    />
  );

  return (
    <div className="pt-4 sm:pt-8">
      {/* 상단 줄: 왼쪽 뒤로 가기(모바일)·경로 표시(PC), 오른쪽 페이지 복사·인쇄·AI 버튼 */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        {/* 태블릿·모바일: 뒤로 가기 */}
        <Link
          href="/"
          className="text-[15px] text-muted transition-colors hover:text-foreground lg:hidden"
        >
          ← {t.backToList}
        </Link>

        {/* PC: 경로 표시. 두 칸 레이아웃 위에 두어 본문 배지와 사이드바 제목의 높이를 맞춤 */}
        <nav aria-label="breadcrumb" className="hidden items-center gap-2 text-sm text-muted lg:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            {t.breadcrumbHome}
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link href="/#categories" className="transition-colors hover:text-foreground">
                {pick(category.name, lang)}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{names.name}</span>
        </nav>

        {/* 태블릿·모바일: 상단 줄 오른쪽. PC는 제목 오른쪽에 표시 */}
        <div className="lg:hidden">{pageActions}</div>
      </div>

      {/* 연결 용어가 있을 때만 PC에서 본문 + 사이드바 두 칸 */}
      <div
        className={`lg:mt-8 ${
          related.length > 0
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14"
            : "lg:max-w-3xl"
        }`}
      >
        <article>
          {/* 제목: 메인 목록과 같은 규칙으로 이름 + 다른 언어 배지 + 아래 회색 줄 (lib/term-names.js) */}
          <header className="mt-10 lg:mt-0">
            {/* PC: 분류 배지 */}
            {category && (
              <span className="mb-4 hidden w-fit rounded-full bg-surface px-3 py-1 text-xs font-bold lg:block">
                {pick(category.name, lang)}
              </span>
            )}
            <div className="flex items-center justify-between gap-6">
              <div className="min-w-0">
                <h1 className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-[32px] font-bold leading-tight tracking-tight lg:text-4xl">
                    {names.name}
                  </span>
                  {names.badge && (
                    <span className="rounded-md border border-line px-2 py-0.5 font-mono text-sm text-muted">
                      {names.badge}
                    </span>
                  )}
                </h1>
                {names.sub && (
                  <p className="mt-2 text-sm text-placeholder sm:text-base">{names.sub}</p>
                )}
              </div>
              {/* PC: 제목 오른쪽 */}
              <div className="hidden shrink-0 lg:block">{pageActions}</div>
            </div>
          </header>

          <p className="mt-8 text-xl font-semibold leading-relaxed tracking-tight sm:text-2xl">
            {pick(term.description, lang)}
          </p>

          {analogy && (
            <div className="mt-8">
              <TintedBox label={t.analogy} className="bg-box-analogy">
                <p>{analogy}</p>
              </TintedBox>
            </div>
          )}

          {details.length > 0 && (
            <section className="mt-10">
              <SectionLabel>{t.details}</SectionLabel>
              <div className="mt-3 space-y-4 text-base leading-loose text-foreground/85">
                {details.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {background.length > 0 && (
            <section className="mt-10">
              <SectionLabel>{t.background}</SectionLabel>
              <div className="mt-3 space-y-4 text-base leading-loose text-foreground/85">
                {background.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {steps.length > 0 && (
            <section className="mt-10">
              <SectionLabel>{t.howItWorks}</SectionLabel>
              <ol className="mt-3 space-y-3 text-base leading-loose text-foreground/85">
                {steps.map((step, i) => (
                  <li key={i}>
                    <strong className="font-bold text-foreground">
                      {i + 1}. {step.title}
                    </strong>{" "}
                    {step.text}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {examples.length > 0 && (
            <div className="mt-10">
              <TintedBox label={t.examples} className="bg-box-examples">
                <ul>
                  {examples.map((example, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.85em] size-1 shrink-0 rounded-full bg-foreground/50"
                      />
                      {example}
                    </li>
                  ))}
                </ul>
              </TintedBox>
            </div>
          )}

          {comparison && (
            <section className="mt-10">
              <SectionLabel>
                {names.name} vs {pick(comparison.target.term, lang)}
              </SectionLabel>
              <table className="mt-4 w-full border-y border-line text-left text-[15px] leading-relaxed">
                <thead>
                  <tr>
                    <th className="w-24 py-3 pr-3 sm:w-32" />
                    <th className="py-3 pr-3 font-bold">{names.name}</th>
                    <th className="py-3 font-bold">{pick(comparison.target.term, lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, i) => (
                    <tr key={i} className="border-t border-line align-top">
                      <th scope="row" className="py-3 pr-3 text-sm font-medium text-muted">
                        {pick(row.label, lang)}
                      </th>
                      <td className="py-3 pr-3 text-foreground/85">{pick(row.values[0], lang)}</td>
                      <td className="py-3 text-foreground/85">{pick(row.values[1], lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {misconceptions.length > 0 && (
            <section className="mt-10">
              <SectionLabel>{t.misconceptions}</SectionLabel>
              <div className="mt-3 space-y-5 text-base leading-loose">
                {misconceptions.map((item, i) => (
                  <div key={i}>
                    <p className="font-bold">{pick(item.myth, lang)}</p>
                    <p className="mt-1 text-foreground/85">{pick(item.fact, lang)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 이렇게 쓰여요: 실제 장면 + 개발자와 대화할 때 쓰는 말. 점선 테두리 박스 */}
          {usage.length > 0 && (
            <section className="bg-foreground/5 p-6 mt-8">
              <h2 className="text-[15px] font-bold text-accent">{t.usage}</h2>
              <div className="mt-3 space-y-5 text-base leading-loose">
                {usage.map((item, i) => (
                  <div key={i}>
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-1 text-foreground/85">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {keywords.length > 0 && (
            <section className="mt-10">
              <SectionLabel>{t.keywords}</SectionLabel>
              <ul className="mt-4 flex flex-wrap gap-2">
                {keywords.map((keyword, i) => {
                  const label = pick(keyword.label, lang);
                  const chip = "inline-flex h-10 items-center rounded-full bg-surface px-4 text-[15px]";
                  return (
                    <li key={keyword.id ?? i}>
                      {keyword.id ? (
                        <Link
                          href={`/terms/${keyword.id}`}
                          className={`${chip} transition-colors hover:bg-surface-hover`}
                        >
                          {label}
                        </Link>
                      ) : (
                        <span className={`${chip} text-muted`}>{label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 태블릿·모바일: 본문 아래 목록. PC는 오른쪽 사이드바에 표시 */}
          {related.length > 0 && (
            <RelatedTerms related={related} lang={lang} t={t} className="mt-14 lg:hidden" />
          )}

          {/* '함께 보면 좋은 용어' PC 사이드바와 같은 글씨 스타일 + 바로가기 버튼 */}
          {tools.length > 0 && (
            <section className="mt-14">
              <h2 className="border-b border-line pb-4 text-[15px] font-bold">{t.tools}</h2>
              <ul>
                {tools.map((tool) => (
                  <li key={tool.id} className="border-b border-line last:border-b-0">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
                          {tool.name}
                          <span className="sr-only"> ({t.newWindow})</span>
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {pick(tool.description, lang)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm text-muted transition-colors group-hover:border-foreground/30 group-hover:text-foreground">
                        {t.visit} ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(adjacent.prev || adjacent.next) && (
            <div className="mt-14">
              <AdjacentTerms prev={adjacent.prev} next={adjacent.next} lang={lang} t={t} />
            </div>
          )}

          {term.updatedAt && (
            <p className="mt-5 text-xs text-muted">
              {t.updatedAt} <time dateTime={term.updatedAt}>{term.updatedAt}</time>
            </p>
          )}
        </article>

        {related.length > 0 && (
          <aside className="hidden lg:block">
            <RelatedTerms related={related} lang={lang} t={t} className="sticky top-6" />
          </aside>
        )}
      </div>
    </div>
  );
}
