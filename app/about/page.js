import InfoPage from "@/app/ui/info-page";
import { getPage } from "@/lib/pages";
import { getCategories } from "@/lib/terms";

const page = getPage("about");

export const metadata = { title: page.title.ko, alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <InfoPage page={page} categories={getCategories()} />;
}
