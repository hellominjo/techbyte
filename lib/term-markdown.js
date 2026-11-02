import { pick, pickList, UI_TEXT } from "@/lib/i18n";
import { getTermNames } from "@/lib/term-names";

// 용어 상세 내용을 마크다운으로 변환 (페이지 복사 → AI에 붙여 넣기용)
export function termToMarkdown({ term, comparison, related = [], lang, url }) {
  const t = UI_TEXT[lang];
  const names = getTermNames(term, lang);
  const lines = [];
  const section = (title, body) => {
    if (body.length === 0) return;
    lines.push("", `## ${title}`, "", ...body);
  };

  lines.push(`# ${names.name}${names.badge ? ` (${names.badge})` : ""}`);
  if (names.sub) lines.push("", names.sub);
  lines.push("", `> ${pick(term.description, lang)}`);

  const definition = pick(term.definition, lang).trim();
  section(t.definition, definition ? [definition] : []);
  const analogy = pick(term.analogy, lang);
  section(t.analogy, analogy ? [analogy] : []);
  section(t.details, pickList(term.details, lang).flatMap((p, i) => (i ? ["", p] : [p])));
  section(t.background, pickList(term.background, lang).flatMap((p, i) => (i ? ["", p] : [p])));
  section(
    t.howItWorks,
    pickList(term.howItWorks, lang).map((step, i) => `${i + 1}. **${step.title}**: ${step.text}`)
  );
  section(t.examples, pickList(term.examples, lang).map((item) => `- ${item}`));

  if (comparison) {
    const other = pick(comparison.target.term, lang);
    section(`${names.name} vs ${other}`, [
      `| | ${names.name} | ${other} |`,
      "| --- | --- | --- |",
      ...comparison.rows.map(
        (row) =>
          `| ${pick(row.label, lang)} | ${pick(row.values[0], lang)} | ${pick(row.values[1], lang)} |`
      ),
    ]);
  }

  section(
    t.misconceptions,
    (term.misconceptions ?? []).flatMap((item, i) => [
      ...(i ? [""] : []),
      `**${pick(item.myth, lang)}**`,
      pick(item.fact, lang),
    ])
  );
  section(
    t.usage,
    pickList(term.usage, lang).flatMap((item, i) => [
      ...(i ? [""] : []),
      `**${item.title}**`,
      item.text,
    ])
  );
  section(
    t.relatedTerms,
    related.map(({ type, term: item }) => {
      const label = t.relation[type] ?? t.relation.related;
      return `- ${pick(item.term, lang)} (${label}): ${pick(item.description, lang)}`;
    })
  );

  lines.push("", "---", "", url);
  return lines.join("\n");
}
