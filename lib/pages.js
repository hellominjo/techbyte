import data from "@/data/pages.json";

export function getPage(id) {
  return data[id];
}
