"use client";

import { useRef, useState } from "react";
import CategoryIcon from "@/app/ui/category-icon";

// 둥근 아이콘 버튼: 인쇄 / 링크 공유(클립보드에 링크 복사)
export default function ShareActions({ url, text, className = "" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  async function share() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // 연속 클릭 시 이전 타이머를 지워 토스트가 일찍 사라지지 않도록
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시
    }
  }

  const button =
    "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-surface-hover hover:text-foreground";

  return (
    <div className={`flex items-center gap-2 print:hidden ${className}`}>
      <button type="button" onClick={() => window.print()} aria-label={text.print} title={text.print} className={button}>
        <CategoryIcon name="printer" className="size-[18px]" />
      </button>
      <button type="button" onClick={share} aria-label={text.copyLink} title={text.copyLink} className={button}>
        <CategoryIcon name={copied ? "check" : "share"} className="size-[18px]" />
      </button>
      {/* 복사 알림 토스트: 화면 하단 가운데에 잠깐 표시 */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4 transition-all duration-300 ${
          copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="rounded-full bg-foreground px-4 py-2.5 text-sm text-background shadow-lg">
          {text.linkCopied}
        </span>
      </div>
      {/* 스크린 리더용 알림 */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied && text.linkCopied}
      </span>
    </div>
  );
}
