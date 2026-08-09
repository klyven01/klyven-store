import SEO from '../components/SEO';
import config from '../config';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Privacy Policy — KLYVEN" description="How KLYVEN collects, uses and protects your data." />
      <p className="spec-tag text-signal mb-2">Policy</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Privacy Policy</h1>

      <div className="space-y-6 text-steel leading-relaxed">
        <p>
          This policy explains what information {config.BRAND_NAME} collects when you use our
          website and place an order, and how we use it. This is a general template — for a legal
          review specific to your business, consult a professional before launch.
        </p>
        <Section title="Information We Collect">
          When you place an order, we collect your name, phone number, email address, and shipping
          address. When you subscribe to our newsletter or contact us, we collect your email and
          any message you send.
        </Section>
        <Section title="What We Never Collect">
          We never ask for or store your card number, CVV, UPI PIN, banking password, or OTP
          anywhere on this website.
        </Section>
        <Section title="How We Use Your Information">
          Your details are used only to process and deliver your order, verify payment, provide
          customer support, and — if you've opted in — send you updates about new drops.
        </Section>
        <Section title="Third Parties">
          We share order details with our print-on-demand supplier and courier partner only as
          needed to fulfil and deliver your order. If we connect a payment gateway in the future,
          payment processing will be handled directly and securely by that provider.
        </Section>
        <Section title="Data Storage">
          Order information is stored securely and is only accessible to the {config.BRAND_NAME}{' '}
          team for order fulfilment and support purposes.
        </Section>
        <Section title="Your Rights">
          You can request a copy of your data, or ask us to delete it, at any time by emailing{' '}
          {config.SUPPORT_EMAIL}.
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
