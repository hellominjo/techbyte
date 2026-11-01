import siteConfig from "@/site.config";
import { SECTIONS, getPageCount, getPosts } from "@/lib/content";
import { getTerms } from "@/lib/terms";

// /sitemap.xml: 검색엔진이 모든 페이지를 찾을 수 있도록 주소 목록을 제공
export default function sitemap() {
  const base = siteConfig.siteUrl;
  const terms = getTerms();

  // 메인 페이지의 수정일은 가장 최근에 수정된 용어 날짜로 표시
  const latest = terms
    .map((term) => term.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return [
    { url: base, lastModified: latest, changeFrequency: "daily", priority: 1 },
    ...terms.map((term) => ({
      url: `${base}/terms/${term.id}`,
      lastModified: term.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    // 쉽게 읽는 IT, 용어 가이드: 목록 + 각 글
    ...Object.keys(SECTIONS).flatMap((section) => [
      { url: `${base}/${section}`, changeFrequency: "weekly", priority: 0.7 },
      // 목록 2페이지부터
      ...Array.from({ length: getPageCount(section) - 1 }, (_, i) => ({
        url: `${base}/${section}/page/${i + 2}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })),
      ...getPosts(section).map((post) => ({
        url: `${base}/${section}/${post.slug}`,
        lastModified: post.ko.date || undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      })),
    ]),
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
