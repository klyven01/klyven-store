import SEO from '../components/SEO';
import config from '../config';

export default function ReturnsPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Returns & Refunds — KLYVEN" description="KLYVEN returns, exchanges and refund policy." />
      <p className="spec-tag text-signal mb-2">Policy</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Returns &amp; Refunds</h1>

      <div className="space-y-6 text-steel leading-relaxed">
        <p>
          Because every {config.BRAND_NAME} piece is made to order through print-on-demand, we
          have a more limited returns window than a standard retailer — please read this policy
          before ordering.
        </p>
        <Section title="Size Exchanges">
          Wrong size? Let us know within 3 days of delivery. Items must be unworn, unwashed, and
          have all tags attached. Exchanges are subject to stock availability for your requested size.
        </Section>
        <Section title="Damaged or Incorrect Items">
          If your order arrives damaged, defective, or different from what you ordered, contact us
          within 3 days of delivery with photos of the issue and we'll arrange a replacement or refund.
        </Section>
        <Section title="Non-Returnable Cases">
          Because items are produced specifically for your order, we can't accept returns for
          change of mind, incorrect size selected at checkout, or normal wear and tear.
        </Section>
        <Section title="Refund Timeline">
          Approved refunds are processed to your original payment method within 5–7 business days
          of approval. COD orders are refunded via bank transfer or UPI.
        </Section>
        <p className="text-sm">
          To start a return or exchange, email{' '}
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
      <p>{children}</p>
    </div>
  );
}
