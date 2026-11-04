"use client";

import { useEffect, useRef, useState } from "react";
import CategoryIcon from "@/app/ui/category-icon";
import Toast from "@/app/ui/toast";

// AI 서비스에 질문을 채워서 여는 주소 (q 파라미터)
const AI_LINKS = [
  { id: "chatgpt", url: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  { id: "claude", url: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
];

// 페이지 복사 / 인쇄 / AI에서 열기 분할 버튼
// - getMarkdown: 복사할 마크다운을 만드는 함수 (누를 때만 만들도록 함수로 받음)
// - prompt: AI 서비스에 채워 넣을 질문
export default function PageActions({ getMarkdown, prompt, text }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);
  const timer = useRef(null);

  // 바깥을 누르거나 Esc를 누르면 메뉴 닫기
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function copy() {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(getMarkdown());
      setCopied(true);
      // 연속 클릭 시 이전 타이머를 지워 토스트가 일찍 사라지지 않도록
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시
    }
  }

  function print() {
    setOpen(false);
    window.print();
  }

  const itemClass =
    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface";

  return (
    <div ref={rootRef} className="relative print:hidden">
      <div className="flex items-stretch overflow-hidden rounded-lg border border-line text-sm">
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors hover:bg-surface"
        >
          <CategoryIcon name={copied ? "check" : "copy"} className="size-4" />
          <span>{copied ? text.copied : text.copyPage}</span>
        </button>
        <button
          type="button"
          aria-label={text.more}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex items-center border-l border-line px-2 transition-colors hover:bg-surface"
        >
          <CategoryIcon name="chevronDown" className="size-4" />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-line bg-background p-1.5 shadow-lg"
        >
          <button type="button" role="menuitem" onClick={copy} className={itemClass}>
            <CategoryIcon name="copy" className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="block text-sm font-medium">{text.copyPage}</span>
              <span className="block text-xs text-muted">{text.copyPageDesc}</span>
            </span>
          </button>
          <button type="button" role="menuitem" onClick={print} className={itemClass}>
            <CategoryIcon name="printer" className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="block text-sm font-medium">{text.print}</span>
              <span className="block text-xs text-muted">{text.printDesc}</span>
            </span>
          </button>
          {AI_LINKS.map((ai) => (
            <a
              key={ai.id}
              role="menuitem"
              href={ai.url(prompt)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <CategoryIcon name="chat" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  {text.open[ai.id]}
                  <CategoryIcon name="external" className="size-3 text-muted" />
                </span>
                <span className="block text-xs text-muted">{text.askDesc}</span>
                <span className="sr-only"> ({text.newWindow})</span>
              </span>
            </a>
          ))}
        </div>
      )}

      <Toast show={copied} message={text.pageCopied} />
    </div>
  );
}
