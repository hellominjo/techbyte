"use client";

import { useRef, useState } from "react";
import CategoryIcon from "@/app/ui/category-icon";
import Toast from "@/app/ui/toast";

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
      <Toast show={copied} message={text.linkCopied} />
    </div>
  );
}
