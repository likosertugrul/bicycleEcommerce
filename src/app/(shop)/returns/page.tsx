import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Order cancellation, return, and refund policy for Bisiklet Dünyası.",
};

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Refunds" updated="July 4, 2026">
      <Section title="1. Order Cancellation">
        <p>
          If your order has not shipped, you may cancel it by contacting us at
          [Email] or [Phone]. Paid, cancelled orders are refunded to the original
          payment method.
        </p>
      </Section>
      <Section title="2. Return Window">
        <p>
          You may return most new items within 30 days of delivery. Items must be
          unused, undamaged, in resalable condition, and include all accessories
          and original packaging.
        </p>
      </Section>
      <Section title="3. How to Return">
        <ul className="list-disc pl-5">
          <li>Contact us to start a return and receive instructions.</li>
          <li>Ship the item back (return shipping cost per policy below).</li>
          <li>Once received and inspected, we issue your refund.</li>
        </ul>
      </Section>
      <Section title="4. Refunds">
        <p>
          Approved refunds are issued to the original payment method, typically
          within 10 business days after we receive the returned item. Original
          shipping charges may be non-refundable unless the return is due to our
          error.
        </p>
      </Section>
      <Section title="5. Defective or Damaged Items">
        <p>
          If an item arrives defective or damaged, contact us within 7 days and we
          will cover return shipping and send a replacement or refund. Please
          inspect your package on delivery.
        </p>
      </Section>
      <Section title="6. Used Bicycles">
        <p>
          Used items are sold based on the condition described on the product
          page. Returns for used bikes are evaluated against the described
          condition; please review details and photos before purchasing.
        </p>
      </Section>
    </LegalPage>
  );
}
