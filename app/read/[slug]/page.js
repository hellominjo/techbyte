import { notFound } from "next/navigation";
import PostView from "@/app/ui/post-view";
import { SECTIONS, getAdjacentPosts, getPost, getPosts } from "@/lib/content";

const SECTION = "read";

// content/read에 없는 주소는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts(SECTION).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(SECTION, slug);
  if (!post) return {};
  return {
    title: post.ko.title,
    description: post.ko.description,
    alternates: { canonical: `/${SECTION}/${slug}` },
  };
}

export default async function ReadPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(SECTION, slug);
  if (!post) notFound();

  return (
    <PostView
      section={SECTIONS[SECTION]}
      basePath={`/${SECTION}`}
      post={post}
      adjacent={getAdjacentPosts(SECTION, slug)}
    />
  );
}
