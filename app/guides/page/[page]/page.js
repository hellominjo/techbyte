import { notFound } from "next/navigation";
import PostList from "@/app/ui/post-list";
import { SECTIONS, getPageCount, getPostPage } from "@/lib/content";

const SECTION = "guides";

// 2페이지부터 생성 (1페이지는 /guides). 없는 페이지 번호는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: getPageCount(SECTION) - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  return {
    title: `${SECTIONS[SECTION].title.ko} (${page}페이지)`,
    description: SECTIONS[SECTION].description.ko,
    alternates: { canonical: `/${SECTION}/page/${page}` },
  };
}

export default async function GuidesListPage({ params }) {
  const { page } = await params;
  const data = getPostPage(SECTION, Number(page));
  if (!data || data.page === 1) notFound();

  return <PostList section={SECTIONS[SECTION]} basePath={`/${SECTION}`} {...data} />;
}
