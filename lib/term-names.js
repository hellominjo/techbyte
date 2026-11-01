import { pick } from "@/lib/i18n";

// 용어 제목에 쓰는 이름 세 가지 (메인 목록, 상세 페이지 제목 공통)
// - name: 현재 언어의 용어 이름 (예: 클라우드)
// - badge: 다른 언어의 용어 이름. name과 같으면 null (예: Cloud)
// - sub: 영문 정식 명칭, 없으면 영문 용어 이름. name과 같으면 null (예: Application Programming Interface)
export function getTermNames(term, lang) {
  const name = pick(term.term, lang);
  const other = term.term[lang === "ko" ? "en" : "ko"];
  const sub = term.fullName?.en || term.term.en;

  return {
    name,
    badge: other && other !== name ? other : null,
    sub: sub && sub !== name ? sub : null,
  };
}
