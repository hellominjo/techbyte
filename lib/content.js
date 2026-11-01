import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { getTerm } from "@/lib/terms";

// 마크다운 글 메뉴. 글 파일: content/<메뉴 id>/<글 이름>.md (영어: <글 이름>.en.md)
// 서버에서만 실행됨 (빌드할 때 마크다운을 HTML로 변환)
export const SECTIONS = {
  read: {
    title: { ko: "쉽게 읽는 IT", en: "IT Insights" },
    description: {
      ko: "뉴스와 일상에서 만나는 IT 이야기를 쉬운 말로 풀어 드려요.",
      en: "IT stories from the news and everyday life, in plain words.",
    },
    // 용어 태그 영역 제목 (없으면 '이 글에서 배우는 용어')
    termsLabel: { ko: "이야기 속 IT 개념", en: "IT concepts in this story" },
  },
  guides: {
    title: { ko: "용어 가이드", en: "Term Guides" },
    description: {
      ko: "뉴스, 업무, 회의 등 일상에서 자주 만나는 IT 용어를 주제별로 묶어 쉽게 정리했어요.",
      en: "Key terms from the news, meetings and work, grouped by topic and explained simply.",
    },
  },
};

const CONTENT_DIR = path.join(process.cwd(), "content");

// 목록 한 페이지에 보여 줄 글 수 (1페이지: /read, 2페이지부터: /read/page/2)
export const POSTS_PER_PAGE = 5;

// 파일 맨 위 --- 사이의 "키: 값" 줄을 읽음 (title, description, date, order, terms)
// terms는 쉼표로 구분한 목록: 용어 id 또는 그냥 글자 (예: terms: llm, 토큰, rag)
function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: source };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key === "order") meta.order = Number(value);
    else if (key === "terms") meta.terms = value.split(",").map((item) => item.trim()).filter(Boolean);
    else meta[key] = value;
  }
  return { meta, body: source.slice(match[0].length) };
}

// '이 글에서 배우는 용어' 칩: 등록된 용어 id면 용어 페이지로 링크, 아니면 글자만
function toChips(terms = []) {
  return terms.map((item) => {
    const term = getTerm(item);
    return term ? { label: term.term, href: `/terms/${term.id}` } : { label: { ko: item } };
  });
}

// 본문에 [[terms]] 한 줄을 쓰면 그 자리에 용어 태그 박스가 들어감 (없으면 본문 아래에 표시)
const TERMS_MARKER = /<p>\[\[terms\]\]<\/p>\n?/;

function readLang(section, slug, suffix) {
  const file = path.join(CONTENT_DIR, section, `${slug}${suffix}.md`);
  if (!fs.existsSync(file)) return null;
  const { meta, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));
  const [html, htmlAfter = null] = marked.parse(body).split(TERMS_MARKER);
  return {
    title: meta.title ?? slug,
    description: meta.description ?? "",
    date: meta.date ?? "",
    order: meta.order,
    chips: toChips(meta.terms),
    html,
    htmlAfter,
  };
}

// 한 글의 한국어·영어 버전 (영어 파일이 없으면 en은 null)
function readPost(section, slug) {
  const ko = readLang(section, slug, "");
  if (!ko) return null;
  return { slug, ko, en: readLang(section, slug, ".en") };
}

// 메뉴의 글 목록: order가 큰 글이 먼저 (나중에 추가한 글이 위로).
// order가 없는 글은 그 뒤에 최신 날짜순
export function getPosts(section) {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.endsWith(".en.md") && !file.startsWith("_"))
    .map((file) => readPost(section, file.slice(0, -".md".length)))
    .sort((a, b) => {
      const ao = a.ko.order ?? -Infinity;
      const bo = b.ko.order ?? -Infinity;
      if (ao !== bo) return bo > ao ? 1 : -1;
      return b.ko.date.localeCompare(a.ko.date);
    });
}

export function getPost(section, slug) {
  return readPost(section, slug);
}

// 전체 페이지 수 (글이 없어도 1페이지)
export function getPageCount(section) {
  return Math.max(1, Math.ceil(getPosts(section).length / POSTS_PER_PAGE));
}

// n페이지의 글 목록 (요약만). 범위를 벗어나면 null
export function getPostPage(section, page) {
  const totalPages = getPageCount(section);
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    posts: getPosts(section).slice(start, start + POSTS_PER_PAGE).map(toPostSummary),
    page,
    totalPages,
  };
}

// 목록 순서 기준 이전·다음 글 (요약만). 처음/마지막이면 null
export function getAdjacentPosts(section, slug) {
  const posts = getPosts(section);
  const index = posts.findIndex((post) => post.slug === slug);
  const prev = posts[index - 1];
  const next = posts[index + 1];
  return {
    prev: prev ? toPostSummary(prev) : null,
    next: next ? toPostSummary(next) : null,
  };
}

// 목록에 필요한 항목만 (본문 HTML 제외)
export function toPostSummary(post) {
  const pickMeta = ({ title, description, date }) => ({ title, description, date });
  return { slug: post.slug, ko: pickMeta(post.ko), en: post.en ? pickMeta(post.en) : null };
}
