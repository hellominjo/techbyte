"use client";

import Link from "next/link";
import CategoryIcon from "@/app/ui/category-icon";
import { useLang } from "@/app/ui/language";
import { pick, pickList } from "@/lib/i18n";
import { fillTemplate, siteValue } from "@/lib/site";

// 문단 안의 문의 이메일은 메일 보내기 링크로 표시
function Paragraph({ text, email }) {
  const index = email ? text.indexOf(email) : -1;
  if (index === -1) return <p>{text}</p>;
  return (
    <p>
      {text.slice(0, index)}
      <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
        {email}
      </a>
      {text.slice(index + email.length)}
    </p>
  );
}

// type 없음: 문단
function TextBlock({ section, lang, email }) {
  return (
    <div className="space-y-3 text-base leading-loose text-foreground/85">
      {pickList(section.body, lang).map((paragraph, i) => (
        <Paragraph key={i} text={fillTemplate(paragraph, lang)} email={email} />
      ))}
    </div>
  );
}

// type "cards": 아이콘 + 제목 + 짧은 설명 카드 그리드
function CardsBlock({ section, text }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {section.items.map((item, i) => (
        <li key={i} className="rounded-2xl border border-line p-4 sm:p-5">
          <CategoryIcon name={item.icon} className="size-6 text-foreground/75" />
          <h3 className="mt-3 text-[15px] font-bold tracking-tight">{text(item.title)}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted sm:text-sm">
            {text(item.text)}
          </p>
        </li>
      ))}
    </ul>
  );
}

// type "steps": 번호가 붙은 단계 목록
function StepsBlock({ section, text }) {
  return (
    <ol className="border-t border-line">
      {section.items.map((item, i) => (
        <li key={i} className="flex gap-4 border-b border-line py-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
            {i + 1}
          </span>
          <div className="pt-0.5">
            <h3 className="text-base font-bold tracking-tight">{text(item.title)}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted">{text(item.text)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// type "categories": categories.json의 분류를 메인 화면과 같은 아이콘 타일로 표시
function CategoriesBlock({ categories, lang }) {
  return (
    <ul
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` }}
    >
      {categories.map((item) => (
        <li
          key={item.id}
          className="flex flex-col items-center gap-2 rounded-2xl border border-line px-1 py-4"
        >
          <CategoryIcon name={item.icon} className="size-6 text-foreground/75" />
          <span className="text-[13px] font-medium leading-tight [overflow-wrap:anywhere] sm:text-sm">
            {item.shortName?.[lang] || pick(item.name, lang)}
          </span>
        </li>
      ))}
    </ul>
  );
}

// type "checklist": 체크 아이콘 목록
function ChecklistBlock({ section, text }) {
  return (
    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {section.items.map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-[15px]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line">
            <CategoryIcon name="check" className="size-3.5 text-foreground/75" />
          </span>
          {text(item)}
        </li>
      ))}
    </ul>
  );
}

// type "cta": 안내 문구 + 버튼 박스
function CtaBlock({ section, text }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] leading-relaxed text-foreground/85">{text(section.text)}</p>
      <Link
        href={section.link.href}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-bold text-background transition-opacity hover:opacity-85"
      >
        {text(section.link.label)} →
      </Link>
    </div>
  );
}

const BLOCKS = {
  cards: CardsBlock,
  steps: StepsBlock,
  categories: CategoriesBlock,
  checklist: ChecklistBlock,
  cta: CtaBlock,
};

export default function InfoPage({ page, categories = [] }) {
  const { lang } = useLang();
  const email = siteValue("contactEmail", lang);
  const text = (field) => fillTemplate(pick(field, lang), lang);

  return (
    <article className="pt-10 sm:pt-16">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-4xl">
        {text(page.title)}
      </h1>
      <div className="mt-8 space-y-12">
        {page.sections.map((section, i) => {
          const Block = BLOCKS[section.type] ?? TextBlock;
          return (
            <section key={i}>
              {section.heading && (
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight">
                  {section.icon && (
                    <CategoryIcon name={section.icon} className="size-5 shrink-0 text-foreground/75" />
                  )}
                  {text(section.heading)}
                </h2>
              )}
              <Block
                section={section}
                categories={categories}
                lang={lang}
                email={email}
                text={text}
              />
            </section>
          );
        })}
      </div>
    </article>
  );
}
