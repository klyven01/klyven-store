import SEO from '../components/SEO';
import config from '../config';

export default function ReturnsPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Returns & Refunds — KLYVEN" description="KLYVEN returns, exchanges and refund policy." />
      <p className="spec-tag text-signal mb-2">Policy</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Returns, Exchanges &amp; Cancellations</h1>

      <div className="space-y-6 text-steel leading-relaxed">
        <p>
          Because every {config.BRAND_NAME} piece is made to order through print-on-demand, we
          have a more limited returns window than a standard retailer — please read this policy
          before ordering.
        </p>

        <Section title="Return Window">
          {`You can request a size exchange or return within ${config.RETURN_DAYS} day${config.RETURN_DAYS === 1 ? '' : 's'} of delivery. Requests made after this window can't be accepted.`}
        </Section>

        <Section title="Eligibility Conditions">
          To qualify for a return or exchange, the item must be:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Unworn and unwashed</li>
            <li>In original condition with all tags attached</li>
            <li>Reported within the return window above, with photos if damaged/defective</li>
          </ul>
        </Section>

        <Section title="Non-Returnable Cases">
          Because items are produced specifically for your order, we can't accept returns for
          change of mind, an incorrect size selected at checkout, or normal wear and tear.
        </Section>

        <Section title="Damaged or Incorrect Items">
          If your order arrives damaged, defective, or different from what you ordered, contact us
          within the return window with photos of the issue and we'll arrange a replacement or refund
          at no extra cost to you.
        </Section>

        <Section title="How to Start a Return">
          Go to our <a href="/return-request" className="text-bone underline underline-offset-4">Return / Replace</a> page,
          enter your Order ID and the email or phone number you checked out with, and submit your
          request. We'll confirm eligibility and next steps within 1–2 business days.
        </Section>

        <Section title="Order Cancellations">
          You can cancel an order free of charge as long as it hasn't yet entered production —
          usually within a few hours of placing it. Once an order has moved to "Processing" or
          later, it can no longer be cancelled since production has started. To request a
          cancellation, email {config.SUPPORT_EMAIL} with your Order ID immediately after ordering.
        </Section>

        <Section title="Refund Timeline">
          Approved refunds are processed to your original payment method within 5–7 business days
          of approval. Cash on Delivery orders are refunded via bank transfer or UPI.
        </Section>

        <p className="text-sm">
          Questions about a specific order? Email{' '}
          <a href={`mailto:${config.SUPPORT_EMAIL}`} className="text-bone underline underline-offset-4">
            {config.SUPPORT_EMAIL}
          </a>{' '}
          with your Order ID.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-xl text-bone mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
