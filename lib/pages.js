import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import data from "@/data/contact.json";
import { fillTemplate } from "@/lib/site";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export function getPage(id) {
  return data[id];
}

export function getMarkdownPage(id) {
  const readLanguage = (lang, suffix) => {
    const file = path.join(PAGES_DIR, `${id}${suffix}.md`);
    return fillTemplate(marked.parse(fs.readFileSync(file, "utf8")), lang);
  };

  return {
    ko: readLanguage("ko", ""),
    en: readLanguage("en", ".en"),
  };
}
