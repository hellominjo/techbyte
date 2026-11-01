import fs from "node:fs";
import path from "node:path";
import categoryData from "@/data/categories.json";
import toolData from "@/data/tools.json";

// 용어 데이터: data/terms/<분류 id>/<용어 id>.json
// - 폴더 이름 = 분류 (data/categories.json의 id), 파일 이름 = 주소의 id
// - 이름이 _로 시작하는 파일·폴더(예: _template.json)는 읽지 않음
// 서버에서만 실행됨 (빌드할 때 폴더를 읽어 정적 페이지 생성)
const TERMS_DIR = path.join(process.cwd(), "data", "terms");

let cache;

function readTermFile(category, file) {
  const id = file.slice(0, -".json".length);
  const where = `data/terms/${category}/${file}`;
  try {
    return { id, ...JSON.parse(fs.readFileSync(path.join(TERMS_DIR, category, file), "utf8")), category };
  } catch (error) {
    throw new Error(`${where} 파일을 읽을 수 없습니다: ${error.message}`);
  }
}

function loadTerms() {
  // 개발 중에는 파일을 추가·수정하면 바로 반영되도록 매번 새로 읽음
  if (cache && process.env.NODE_ENV === "production") return cache;

  const categoryIds = new Set(categoryData.categories.map((item) => item.id));
  const folders = fs
    .readdirSync(TERMS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);

  for (const folder of folders) {
    if (!categoryIds.has(folder)) {
      throw new Error(
        `data/terms/${folder} 폴더에 해당하는 분류가 data/categories.json에 없습니다.`
      );
    }
  }

  const terms = folders.flatMap((category) =>
    fs
      .readdirSync(path.join(TERMS_DIR, category))
      .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
      .map((file) => readTermFile(category, file))
  );

  // 주소가 겹치지 않도록 분류가 달라도 같은 id(파일 이름)는 허용하지 않음
  const seen = new Map();
  for (const term of terms) {
    if (seen.has(term.id)) {
      throw new Error(
        `용어 id "${term.id}"가 data/terms/${seen.get(term.id)}, data/terms/${term.category} 두 곳에 있습니다.`
      );
    }
    seen.set(term.id, term.category);
  }

  // order가 작은 순서. order가 없는 용어는 그 뒤에 한국어 이름 가나다순
  terms.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    return a.term.ko.localeCompare(b.term.ko, "ko");
  });

  cache = terms;
  return terms;
}

// 목록·카드에 필요한 항목만 (브라우저로 보내는 데이터 크기를 줄이기 위함)
export function toSummary(term) {
  const { id, category, term: name, fullName, description } = term;
  return { id, category, term: name, fullName, description };
}

export function getCategories() {
  return categoryData.categories;
}

export function getTerms() {
  return loadTerms();
}

export function getTerm(id) {
  return loadTerms().find((term) => term.id === id);
}

// comparison.target id를 실제 용어로 바꿈. 비교 데이터가 없거나 대상이 없으면 null
export function getComparison(term) {
  const target = term.comparison && getTerm(term.comparison.target);
  return target ? { target: toSummary(target), rows: term.comparison.rows } : null;
}

// 정렬 순서(order) 기준 이전·다음 용어. 처음/마지막이면 null
export function getAdjacentTerms(term) {
  const terms = loadTerms();
  const index = terms.findIndex((item) => item.id === term.id);
  const prev = terms[index - 1];
  const next = terms[index + 1];
  return {
    prev: prev ? toSummary(prev) : null,
    next: next ? toSummary(next) : null,
  };
}

// related의 id를 실제 용어 데이터로 바꿈. 없는 id는 건너뜀
export function getRelatedTerms(term) {
  return (term.related ?? []).flatMap(({ id, type }) => {
    const target = getTerm(id);
    return target ? [{ type, term: toSummary(target) }] : [];
  });
}

// keywords: 용어 id면 해당 용어로 링크, 아니면 적힌 글자 그대로 표시
// 문자열("llm", "검색 엔진") 또는 { "ko": "...", "en": "..." } 형태 모두 가능
export function getKeywords(term) {
  return (term.keywords ?? []).map((keyword) => {
    const target = typeof keyword === "string" ? getTerm(keyword) : null;
    if (target) return { id: target.id, label: target.term };
    return { label: typeof keyword === "string" ? { ko: keyword } : keyword };
  });
}

// tools의 id를 data/tools.json의 도구로 바꿈. note가 있으면 기본 설명 대신 사용
export function getTermTools(term) {
  return (term.tools ?? []).flatMap(({ id, note }) => {
    const tool = toolData.tools.find((item) => item.id === id);
    return tool ? [{ ...tool, description: note ?? tool.description }] : [];
  });
}
