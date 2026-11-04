import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { themeInitScript } from "@/lib/theme";
import { brandInitScript } from "@/lib/brand";
import { siteValue } from "@/lib/site";
import SiteHeader from "@/app/ui/site-header";
import SiteFooter from "@/app/ui/site-footer";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  // 900: techbyte 서브도메인 로고
  weight: ["400", "500", "700", "900"],
});

//${siteValue("tagline", "ko")}
const siteTitle = `${siteValue("siteName", "ko")}`;

export const metadata = {
  // canonical 등 상대 주소의 기준 도메인
  metadataBase: new URL(siteValue("siteUrl", "ko")),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteValue("description", "ko"),
  other: {
    "google-adsense-account": "ca-pub-9255417524209137",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      data-theme="light"
      suppressHydrationWarning
      className={`${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script id="brand-init" strategy="beforeInteractive">
          {brandInitScript}
        </Script>
        {/* 태블릿·모바일은 좁은 단일 칼럼, PC(lg 이상)는 넓은 레이아웃 */}
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 sm:px-8 lg:max-w-6xl lg:px-10">
          <SiteHeader />
          <main className="flex-1 pb-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
      {/* Google tag (gtag.js) */}
      <GoogleAnalytics gaId="G-89E2E9CLHR" />
    </html>
  );
}
