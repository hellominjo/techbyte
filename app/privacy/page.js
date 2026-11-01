import InfoPage from "@/app/ui/info-page";
import { getPage } from "@/lib/pages";

const page = getPage("privacy");

export const metadata = { title: page.title.ko, alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <InfoPage page={page} />;
}
