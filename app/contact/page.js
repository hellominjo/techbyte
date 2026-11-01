import ContactForm from "@/app/ui/contact-form";
import InfoPage from "@/app/ui/info-page";
import { getPage } from "@/lib/pages";

const page = getPage("contact");

export const metadata = { title: page.title.ko, alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <InfoPage page={page} />
      <ContactForm types={page.inquiryTypes ?? []} />
    </>
  );
}
