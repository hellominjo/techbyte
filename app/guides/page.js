import PostList from "@/app/ui/post-list";
import { SECTIONS, getPostPage } from "@/lib/content";

const SECTION = "guides";

export const metadata = {
  title: SECTIONS[SECTION].title.ko,
  description: SECTIONS[SECTION].description.ko,
  alternates: { canonical: `/${SECTION}` },
};

// 1페이지. 2페이지부터는 app/guides/page/[page]
export default function GuidesPage() {
  return <PostList section={SECTIONS[SECTION]} basePath={`/${SECTION}`} {...getPostPage(SECTION, 1)} />;
}
