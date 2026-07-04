import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Bisiklet Dünyası uses cookies.",
};

export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updated="July 4, 2026">
      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit our
          site. They help the site work and improve your experience.
        </p>
      </Section>
      <Section title="2. Cookies We Use">
        <ul className="list-disc pl-5">
          <li>
            <strong>Essential cookies:</strong> Required for core features like
            the cart and sessions (e.g., <code>bisiklet_cart</code>, session and
            language cookies).
          </li>
          <li>
            <strong>Preference cookies:</strong> Remember choices such as language
            and favorites (e.g., <code>lang</code>, <code>bisiklet_favs</code>).
          </li>
          <li>
            <strong>Analytics cookies:</strong> If enabled, used to understand
            site usage.
          </li>
        </ul>
      </Section>
      <Section title="3. Managing Cookies">
        <p>
          You can delete or block cookies in your browser settings. Note that
          disabling essential cookies may break features like the cart and login.
        </p>
      </Section>
      <Section title="4. Contact">
        <p>Questions? Contact us at [Email].</p>
      </Section>
    </LegalPage>
  );
}
