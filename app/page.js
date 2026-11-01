import Glossary from "@/app/ui/glossary";
import { getPopularTerms, getTermsPerPage, getTodayTerm } from "@/lib/home";
import { getCategories, getTerms, toSummary } from "@/lib/terms";

// 1시간마다 페이지를 다시 만들어 날짜가 바뀌면 오늘의 용어도 바뀜
export const revalidate = 3600;

export const metadata = { alternates: { canonical: "/" } };

// 목록·검색에 필요한 항목만 넘겨 브라우저로 보내는 데이터를 줄임 (용어 본문은 상세 페이지에서만)
export default function Home() {
  const todayTerm = getTodayTerm();

  return (
    <Glossary
      categories={getCategories()}
      terms={getTerms().map(toSummary)}
      todayTerm={todayTerm ? toSummary(todayTerm) : null}
      popularTerms={getPopularTerms().map(toSummary)}
      pageSize={getTermsPerPage()}
    />
  );
}
