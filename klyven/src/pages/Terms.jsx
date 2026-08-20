import SEO from '../components/SEO';
import config from '../config';

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Terms & Conditions — KLYVEN" description="KLYVEN terms and conditions of use." />
      <p className="spec-tag text-signal mb-2">Policy</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Terms &amp; Conditions</h1>

      <div className="space-y-6 text-steel leading-relaxed">
        <p>
          By using this website and placing an order with {config.BRAND_NAME}, you agree to the
          terms below. This is a general starting template — for a legal review specific to your
          business, consult a professional before launch.
        </p>
        <Section title="Orders">
          Placing an order is an offer to buy. We confirm orders after verifying payment. We
          reserve the right to cancel any order — for example due to stock issues or suspected
          fraud — and will notify you if this happens.
        </Section>
        <Section title="Pricing">
          Prices are listed in {config.CURRENCY} and may change without notice. The price at the
          time you place your order is the price you pay.
        </Section>
        <Section title="Payments">
          We currently support {config.COD_ENABLED ? 'Cash on Delivery and ' : ''}manual UPI
          payment with manual verification. We never ask for your card, UPI PIN, or OTP — do not
          share these with anyone claiming to represent {config.BRAND_NAME}.
        </Section>
        <Section title="Product Accuracy">
          We try to represent colours and fit accurately, but slight variation is possible due to
          screen display and the nature of print-on-demand production.
        </Section>
        <Section title="Intellectual Property">
          All designs, graphics, and branding on this site belong to {config.BRAND_NAME} and may
          not be reproduced without permission.
        </Section>
        <Section title="Limitation of Liability">
          {config.BRAND_NAME} is not liable for indirect or incidental damages arising from use of
          this website or our products, to the extent permitted by law.
        </Section>
        <Section title="Contact">
          Questions about these terms can be sent to {config.SUPPORT_EMAIL}.
        </Section>
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
