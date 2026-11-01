import MarkdownInfoPage from "@/app/ui/markdown-info-page";
import { getMarkdownPage } from "@/lib/pages";

const content = getMarkdownPage("about");

export const metadata = { title: "서비스 소개", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <MarkdownInfoPage content={content} className="about-page-markdown" />;
}
