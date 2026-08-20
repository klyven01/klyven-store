import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

/**
 * KLYVEN Help Assistant — a free, rule-based FAQ bot. It matches keywords
 * in what the person types against a fixed set of approved topics and
 * answers, and never invents order status, stock, or payment confirmation.
 * If nothing matches, it points to human support.
 *
 * This is NOT a general-purpose AI model — a real AI chatbot needs a paid
 * API (e.g. OpenAI, Anthropic, Google Gemini) and isn't free at scale. This
 * keyword-matching approach costs nothing to run. See README for how to
 * swap in a real AI API later if you want one.
 */
const FAQ = [
  {
    keywords: ['size', 'fit', 'measurement', 'chart'],
    answer:
      'Check our size guide on each product page (tap "Size Guide" next to the size selector). If you\'re between two sizes, compare your chest/length measurements to the chart — KLYVEN runs oversized by design.',
  },
  {
    keywords: ['ship', 'delivery', 'deliver', 'when will i get', 'how long'],
    answer:
      'Orders are processed within 1–2 business days, then shipped — most orders arrive in 5–9 business days depending on your location. Full details are on our Shipping Policy page.',
  },
  {
    keywords: ['return', 'exchange', 'refund'],
    answer:
      'Size exchanges are accepted within 3 days of delivery if the item is unworn with tags attached. See our Returns & Refunds page for the full policy.',
  },
  {
    keywords: ['cod', 'cash on delivery'],
    answer:
      `Yes, Cash on Delivery is available${config.COD_EXTRA_CHARGE > 0 ? ` (a small ${config.CURRENCY_SYMBOL}${config.COD_EXTRA_CHARGE} handling charge applies for COD orders)` : ''}. You can choose it at checkout.`,
  },
  {
    keywords: ['payment', 'upi', 'pay', 'qr'],
    answer:
      'We support manual UPI (scan the QR code or pay to our UPI ID) and Cash on Delivery. We never ask for your UPI PIN, OTP, or card details.',
  },
  {
    keywords: ['track', 'where is my order', 'order status'],
    answer: 'Please enter your Order ID and the email or phone number you checked out with on our Track Order page.',
  },
  {
    keywords: ['brand', 'about', 'who is klyven', 'story'],
    answer:
      `${config.BRAND_NAME} is a small, independent Indian streetwear brand — oversized, premium, print-on-demand, made in small drops. Read more on our About page.`,
  },
  {
    keywords: ['wash', 'care', 'iron', 'clean'],
    answer: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron directly over the print.',
  },
  {
    keywords: ['coupon', 'discount', 'offer', 'code'],
    answer: 'If we\'re running a promotion, you can enter a coupon code at checkout — the discount applies automatically once it\'s valid.',
  },
  {
    keywords: ['contact', 'support', 'help', 'human', 'talk to someone'],
    answer: `You can reach our support team at ${config.SUPPORT_EMAIL} or through the Contact page.`,
  },
];

const FALLBACK = `I'm not sure about that one — please contact KLYVEN support at ${config.SUPPORT_EMAIL} and we'll help directly.`;

function findAnswer(text) {
  const q = text.toLowerCase();
  const match = FAQ.find((f) => f.keywords.some((k) => q.includes(k)));
  return match ? match.answer : FALLBACK;
}

export default function HelpChatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! I'm the ${config.BRAND_NAME} help assistant. Ask me about sizing, shipping, returns, or payments.` },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const answer = findAnswer(text);
    setMessages((m) => [...m, { from: 'user', text }, { from: 'bot', text: answer }]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open help chat"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-bone text-void flex items-center justify-center btn-depth spec-tag text-lg"
      >
        {open ? '✕' : '?'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[90vw] max-w-sm h-[60vh] bg-ash border border-line flex flex-col">
          <div className="px-4 py-3 border-b border-line">
            <p className="spec-tag text-bone">{config.BRAND_NAME} Help</p>
            <p className="text-xs text-steel normal-case">Answers sizing, shipping, returns & payment questions.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                m.from === 'bot' ? 'bg-void text-bone mr-auto' : 'bg-signal text-white ml-auto'
              }`}>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-line p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="input flex-1 text-sm"
            />
            <button type="submit" className="spec-tag bg-bone text-void px-4 hover:bg-signal hover:text-white">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
