import SEO from '../components/SEO';
import config from '../config';

export default function ShippingPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Shipping Policy — KLYVEN" description="KLYVEN shipping timelines, charges and coverage." />
      <p className="spec-tag text-signal mb-2">Policy</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Shipping Policy</h1>

      <div className="prose-policy space-y-6 text-steel leading-relaxed">
        <p>
          {config.BRAND_NAME} currently ships across India. As a print-on-demand brand, every
          order is produced after it's placed, so please account for production time in addition
          to courier transit time.
        </p>
        <Section title="Processing Time">
          Orders are manually verified and sent into production within 1–2 business days of
          payment confirmation.
        </Section>
        <Section title="Delivery Time">
          Once shipped, most orders arrive within 5–9 business days depending on your location.
          Remote areas may take longer.
        </Section>
        <Section title="Shipping Charges">
          {`A flat shipping fee of ${config.CURRENCY_SYMBOL}${config.SHIPPING_CHARGE} applies to
          orders below ${config.CURRENCY_SYMBOL}${config.FREE_SHIPPING_THRESHOLD}. Orders at or
          above ${config.CURRENCY_SYMBOL}${config.FREE_SHIPPING_THRESHOLD} ship free.`}
        </Section>
        <Section title="Order Tracking">
          Once your order ships, you'll be able to look up its status any time on our Track Order
          page using your Order ID and the email or phone number used at checkout.
        </Section>
        <Section title="Delays">
          Occasionally, courier delays, weather, or high-demand drops can extend delivery times.
          We'll always keep you updated on your order status if this happens.
        </Section>
        <p className="text-sm">
          Questions about a specific order? Contact us at{' '}
          <a href={`mailto:${config.SUPPORT_EMAIL}`} className="text-bone underline underline-offset-4">
            {config.SUPPORT_EMAIL}
          </a>.
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
