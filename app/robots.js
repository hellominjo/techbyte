import siteConfig from "@/site.config";

// /robots.txt: 모든 검색엔진의 수집을 허용하고 sitemap 위치를 알려 줌
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
