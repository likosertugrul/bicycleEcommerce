import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bisiklet Dünyası collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 4, 2026">
      <Section title="1. Who We Are">
        <p>
          This Privacy Policy explains how [Company Name] (&quot;we&quot;, &quot;us&quot;)
          collects and uses your information when you use our website
          ([Website URL]). Contact: [Address], [Email], [Phone].
        </p>
      </Section>
      <Section title="2. Information We Collect">
        <ul className="list-disc pl-5">
          <li>Contact details: name, email, phone, shipping address.</li>
          <li>Order information: products, amounts, order history.</li>
          <li>Technical data: IP address, device, and cookie data.</li>
          <li>Payment is processed by our payment provider (Stripe); we do not store full card numbers.</li>
        </ul>
      </Section>
      <Section title="3. How We Use Your Information">
        <p>
          To process and deliver orders, provide customer support, comply with
          legal obligations, prevent fraud, and improve our services.
        </p>
      </Section>
      <Section title="4. Sharing">
        <p>
          We share data only as needed with service providers such as payment
          processors (Stripe), shipping carriers, and hosting providers, or when
          required by law.
        </p>
      </Section>
      <Section title="5. Your Rights">
        <p>
          Depending on your state (e.g., California/CCPA), you may have the right
          to access, correct, delete, or opt out of the sale/sharing of your
          personal information. We do not sell your personal information. To make
          a request, contact [Email].
        </p>
      </Section>
      <Section title="6. Data Retention & Security">
        <p>
          We keep personal data only as long as necessary for the purposes above
          or as required by law, and apply reasonable safeguards to protect it.
        </p>
      </Section>
      <Section title="7. Children">
        <p>
          Our services are not directed to children under 13, and we do not
          knowingly collect their data.
        </p>
      </Section>
      <Section title="8. Changes">
        <p>We may update this policy; the current version is posted on this page.</p>
      </Section>
    </LegalPage>
  );
}
