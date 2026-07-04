import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Bisiklet Dünyası website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 4, 2026">
      <Section title="1. Acceptance">
        <p>
          By using this website ([Website URL]), operated by [Company Name], you
          agree to these Terms of Service. If you do not agree, please do not use
          the site.
        </p>
      </Section>
      <Section title="2. Products & Availability">
        <p>
          We sell new and used bicycles and related products. Product images may
          be representative; minor variations in color or detail may occur.
          Availability is not guaranteed and may change without notice.
        </p>
      </Section>
      <Section title="3. Accounts">
        <p>
          An account is optional. You are responsible for keeping your login
          credentials confidential and for activity under your account.
        </p>
      </Section>
      <Section title="4. Pricing & Payment">
        <p>
          Prices are shown in U.S. dollars (USD). Applicable sales tax is
          calculated at checkout. Prices may change without notice; the price
          that applies is the one shown at the time of your order. Payments are
          processed securely by Stripe.
        </p>
      </Section>
      <Section title="5. Intellectual Property">
        <p>
          Content, design, and marks on this site belong to [Company Name] and
          may not be used without permission.
        </p>
      </Section>
      <Section title="6. Limitation of Liability">
        <p>
          The site is provided &quot;as is&quot; without warranties of
          uninterrupted or error-free operation. To the fullest extent permitted
          by law, [Company Name] is not liable for indirect or consequential
          damages.
        </p>
      </Section>
      <Section title="7. Governing Law">
        <p>
          These terms are governed by the laws of the State of [State], USA.
          Disputes shall be subject to the courts located in [County/State].
        </p>
      </Section>
    </LegalPage>
  );
}
