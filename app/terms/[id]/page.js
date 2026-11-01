import { notFound } from "next/navigation";
import TermDetail from "@/app/ui/term-detail";
import {
  getAdjacentTerms,
  getCategories,
  getComparison,
  getKeywords,
  getRelatedTerms,
  getTerm,
  getTermTools,
  getTerms,
} from "@/lib/terms";

// data/terms에 없는 주소는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getTerms().map((term) => ({ id: term.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const term = getTerm(id);
  if (!term) return {};
  return {
    title: term.term.ko,
    description: term.description.ko,
    alternates: { canonical: `/terms/${id}` },
  };
}

export default async function TermPage({ params }) {
  const { id } = await params;
  const term = getTerm(id);
  if (!term) notFound();

  return (
    <TermDetail
      term={term}
      category={getCategories().find((item) => item.id === term.category)}
      keywords={getKeywords(term)}
      comparison={getComparison(term)}
      tools={getTermTools(term)}
      related={getRelatedTerms(term)}
      adjacent={getAdjacentTerms(term)}
    />
  );
}
