"use client";

// 알림 토스트: show가 true인 동안 화면 하단 가운데에 표시
export default function Toast({ show, message }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4 transition-all duration-300 print:hidden ${
          show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="rounded-full bg-foreground px-4 py-2.5 text-sm text-background shadow-lg">
          {message}
        </span>
      </div>
      {/* 스크린 리더용 알림 */}
      <span role="status" aria-live="polite" className="sr-only">
        {show && message}
      </span>
    </>
  );
}
