import siteConfig from "@/site.config";
import { pick } from "@/lib/i18n";

// site.config.js의 값을 해당 언어 문자열로 꺼냄 (언어 구분이 없는 값은 그대로)
export function siteValue(key, lang) {
  const value = siteConfig[key];
  return typeof value === "object" ? pick(value, lang) : value;
}

// "{{siteName}}" 같은 자리표시자를 site.config.js 값으로 바꿈. 없는 키는 그대로 둠
export function fillTemplate(text, lang) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in siteConfig ? siteValue(key, lang) : match
  );
}
