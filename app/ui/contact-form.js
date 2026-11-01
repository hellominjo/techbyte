"use client";

import { useState } from "react";
import { useLang } from "@/app/ui/language";
import { pick } from "@/lib/i18n";
import { siteValue } from "@/lib/site";

// 메일 주소(mailto) 길이 제한을 넘지 않도록 내용 글자 수를 제한
const MESSAGE_MAX = 1500;

const fieldClass =
  "w-full rounded-xl border border-line bg-transparent px-4 text-base outline-none placeholder:text-placeholder transition-colors focus:border-foreground/40";

// 서버로 전송하지 않고, 방문자의 메일 앱을 작성된 내용으로 열어 줌
export default function ContactForm({ types }) {
  const { lang, t } = useLang();
  const text = t.contactForm;
  const email = siteValue("contactEmail", lang);
  const [type, setType] = useState(types[0]?.id ?? "");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const typeName = pick(types.find((item) => item.id === type)?.name, lang);
    const title = form.get("subject").trim();
    const message = form.get("message").trim();
    const subject = typeName ? `[${typeName}] ${title}` : title;
    const body = typeName ? `${text.type}: ${typeName}\n\n${message}` : message;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <section className="mt-10">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="contact-subject" className="text-[15px] font-bold">
            {text.subject}
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            maxLength={100}
            placeholder={text.subjectPlaceholder}
            className={`${fieldClass} mt-2 h-12`}
          />
        </div>

        {types.length > 0 && (
          <div>
            <label htmlFor="contact-type" className="text-[15px] font-bold">
              {text.type}
            </label>
            <div className="relative mt-2">
              <select
                id="contact-type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`${fieldClass} h-12 cursor-pointer appearance-none pr-11`}
              >
                {types.map((item) => (
                  <option key={item.id} value={item.id}>
                    {pick(item.name, lang)}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="contact-message" className="text-[15px] font-bold">
            {text.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={8}
            maxLength={MESSAGE_MAX}
            placeholder={text.messagePlaceholder}
            className={`${fieldClass} mt-2 resize-y py-3 leading-relaxed`}
          />
        </div>

        <div>
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-foreground px-8 text-[15px] font-bold text-background transition-opacity hover:opacity-85 sm:w-auto"
          >
            {text.submit}
          </button>
          {submitted && (
            <p role="status" className="mt-5 ml-2 text-sm leading-relaxed text-muted">
              {text.sent}{" "}
              <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
                {email}
              </a>
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
