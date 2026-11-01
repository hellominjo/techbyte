import home from "@/data/home.json";
import { getTerm, getTerms } from "@/lib/terms";

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 오늘의 용어: home.json의 todayTerm에 id를 적으면 그 용어로 고정,
// 비워 두면 한국 시간 기준으로 날짜가 바뀔 때마다 정렬 순서(order)대로 돌아가며 선택
export function getTodayTerm(now = Date.now()) {
  const pinned = home.todayTerm && getTerm(home.todayTerm);
  if (pinned) return pinned;

  const terms = getTerms();
  const dayIndex = Math.floor((now + KST_OFFSET_MS) / DAY_MS);
  return terms[dayIndex % terms.length];
}

// 전체 용어 목록에 처음 보여 줄 개수 (더보기를 누를 때마다 같은 개수씩 추가)
export function getTermsPerPage() {
  return home.termsPerPage > 0 ? home.termsPerPage : 10;
}

// 많이 찾는 용어: home.json의 popularTerms 순서대로. data/terms에 없는 id는 건너뜀
export function getPopularTerms() {
  return home.popularTerms.map(getTerm).filter(Boolean);
}
