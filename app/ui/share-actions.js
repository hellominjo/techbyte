"use client";

import { useState } from "react";
import CategoryIcon from "@/app/ui/category-icon";

// 둥근 아이콘 버튼: 인쇄 / 링크 공유(클립보드에 링크 복사)
export default function ShareActions({ url, text, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시
    }
  }

  const button =
    "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-surface-hover hover:text-foreground";

  return (
    <div className={`flex items-center gap-2 print:hidden ${className}`}>
      {/* 복사 알림은 버튼 왼쪽에 잠깐 표시 */}
      <span aria-live="polite" className="text-sm text-muted">
        {copied && text.linkCopied}
      </span>
      <button type="button" onClick={() => window.print()} aria-label={text.print} title={text.print} className={button}>
        <CategoryIcon name="printer" className="size-[18px]" />
      </button>
      <button type="button" onClick={share} aria-label={text.copyLink} title={text.copyLink} className={button}>
        <CategoryIcon name={copied ? "check" : "share"} className="size-[18px]" />
      </button>
    </div>
  );
}
