"use client";

import { useEffect, useSyncExternalStore } from "react";
import { UI_TEXT } from "@/lib/i18n";

const STORAGE_KEY = "lang";
const listeners = new Set();

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}

// 서버 렌더링은 항상 한국어
function getServerSnapshot() {
  return "ko";
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function setLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
  listeners.forEach((listener) => listener());
}

// 페이지를 이동해도 선택한 언어가 유지됨
export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang, t: UI_TEXT[lang] };
}
