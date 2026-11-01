"use client";

import { useLang } from "@/app/ui/language";

export default function MarkdownInfoPage({ content, className = "" }) {
  const { lang } = useLang();
  const html = (lang === "en" && content.en) || content.ko;

  return (
    <article className="pt-10 sm:pt-16">
      <div
        className={`markdown info-page-markdown ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
