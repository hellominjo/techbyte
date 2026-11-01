import MarkdownInfoPage from "@/app/ui/markdown-info-page";
import { getMarkdownPage } from "@/lib/pages";

const content = getMarkdownPage("privacy");

export const metadata = { title: "개인정보처리방침", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <MarkdownInfoPage content={content} />;
}
