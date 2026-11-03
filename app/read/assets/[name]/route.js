import { getAsset, getAssetNames } from "@/lib/content";

const SECTION = "read";

// content/read/assets에 없는 파일은 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getAssetNames(SECTION).map((name) => ({ name }));
}

// content/read/assets/<파일명> → /read/assets/<파일명>
export async function GET(_request, { params }) {
  const { name } = await params;
  const asset = getAsset(SECTION, name);
  if (!asset) return new Response("Not found", { status: 404 });
  return new Response(asset.body, { headers: { "Content-Type": asset.type } });
}
