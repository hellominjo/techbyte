// 사이트 전반에 쓰이는 기본 정보
const siteConfig = {
  // 실제 서비스 주소 (끝에 / 없이). sitemap.xml, robots.txt, 검색엔진용 대표 주소(canonical)에 쓰임
  siteUrl: "https://zerofound.io",
  authorUrl: "https://zerofound.studio",
  // 서비스 이름
  siteName: { ko: "ZEROFOUND", en: "ZEROFOUND" },
  tagline: { ko: "TECHBYTE", en: "TECHBYTE" },
  brandName: "TECHBYTE",
  // 소개 문구
  footerIntro: {
    ko: "{{brandName}}는 IT 용어를 쉽고 정확하게 정리하는 서비스입니다.",
    en: "{{brandName}} explains IT terms simply and accurately.",
  },
  // 검색 결과 노출  설명
  description: {
    ko: "전공자가 아니어도 한 번에 이해할 수 있게 IT 용어를 설명합니다.",
    en: "IT terms explained so anyone can understand them at a glance.",
  },
  // 문의 이메일
  contactEmail: "hello@zerofound.io",
  mainSite: {
    label: { ko: "ZEROFOUND로 이동", en: "Go to ZEROFOUND" },
    url: "",
  },
  // 개인정보처리방침
  retentionPeriod: { ko: "1년", en: "1 year" },
  effectiveDate: { ko: "2026년 11월 1일", en: "November 1, 2026" },
};

export default siteConfig;
