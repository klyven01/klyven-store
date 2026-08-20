import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { verifyOrderForReturn, submitReturnRequest, findReturnRequests } from '../lib/returns';
import config from '../config';

const REASONS = [
  'Wrong size',
  'Item damaged/defective',
  'Different from what I ordered',
  'Quality issue',
  'Other',
];

export default function ReturnRequest() {
  const [step, setStep] = useState('verify'); // verify | form | done | status
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [requestType, setRequestType] = useState('return');
  const [itemsDescription, setItemsDescription] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [requestNumber, setRequestNumber] = useState('');

  const [existingRequests, setExistingRequests] = useState([]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await verifyOrderForReturn(orderId, contact);
    if (!result.valid) {
      setError(result.message);
      setLoading(false);
      return;
    }
    setOrder(result.order);
    const requests = await findReturnRequests(orderId, contact);
    setExistingRequests(requests);
    setItemsDescription(
      result.order.items.map((i) => `${i.name} (${i.size}/${i.color}) x${i.qty}`).join(', ')
    );
    setStep('form');
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const finalReason = reason === 'Other' ? customReason.trim() : reason;
    if (!finalReason) {
      setError('Please provide a reason.');
      setLoading(false);
      return;
    }
    const result = await submitReturnRequest({ order, requestType, itemsDescription, reason: finalReason });
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setRequestNumber(result.requestNumber);
    setStep('done');
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <SEO title="Return / Replace — KLYVEN" />
        <p className="spec-tag text-steel">
          Returns aren't available yet — connect Supabase to enable them (see README).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO
        title="Request a Return or Replace — KLYVEN"
        description="Start a return or replacement request for your KLYVEN order."
      />
      <p className="spec-tag text-signal mb-2">Support</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-4">Return / Replace</h1>
      <p className="text-steel mb-10">
        Eligible within {config.RETURN_DAYS} day{config.RETURN_DAYS === 1 ? '' : 's'} of delivery — see our{' '}
        <Link to="/returns-policy" className="text-bone underline underline-offset-4">
          Returns Policy
        </Link>{' '}
        for full details.
      </p>

      {step === 'verify' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block">
            <span className="spec-tag text-steel block mb-1.5">Order ID</span>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={`${config.ORDER_PREFIX}-2026-0001`}
              required
              className="input"
            />
          </label>
          <label className="block">
            <span className="spec-tag text-steel block mb-1.5">Email or Mobile Number</span>
            <input value={contact} onChange={(e) => setContact(e.target.value)} required className="input" />
          </label>
          {error && <p className="text-signal spec-tag">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Find My Order'}
          </button>
        </form>
      )}

      {step === 'form' && order && (
        <div>
          <div className="border border-line p-4 mb-6">
            <p className="spec-tag text-steel mb-1">Order</p>
            <p className="font-mono text-bone">{order.orderId}</p>
          </div>

          {existingRequests.length > 0 && (
            <div className="border border-signal p-4 mb-6">
              <p className="spec-tag text-signal mb-2">Existing request(s) for this order</p>
              {existingRequests.map((r) => (
                <div key={r.id} className="text-sm text-steel flex justify-between py-1">
                  <span className="font-mono">{r.request_number}</span>
                  <span>{r.status}</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="spec-tag text-bone block mb-2">Request Type</span>
              <div className="flex gap-3">
                {['return', 'replace'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRequestType(t)}
                    className={`spec-tag px-4 py-2 border capitalize ${
                      requestType === t ? 'bg-bone text-void border-bone' : 'border-line text-steel'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="spec-tag text-steel block mb-1.5">Item(s)</span>
              <textarea
                value={itemsDescription}
                onChange={(e) => setItemsDescription(e.target.value)}
                rows={2}
                className="input"
              />
            </label>

            <div>
              <span className="spec-tag text-bone block mb-2">Reason</span>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="input">
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {reason === 'Other' && (
                <input
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Tell us more"
                  className="input mt-3"
                />
              )}
            </div>

            {error && <p className="text-signal spec-tag">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : `Submit ${requestType === 'return' ? 'Return' : 'Replace'} Request`}
            </button>
          </form>
        </div>
      )}

      {step === 'done' && (
        <div className="text-center border border-line p-8">
          <p className="spec-tag text-signal mb-3">Request Submitted</p>
          <p className="font-mono text-bone text-lg mb-4">{requestNumber}</p>
          <p className="text-steel text-sm leading-relaxed">
            We'll review your request and reach out at the email/phone on your order within 1–2
            business days. You can contact {config.SUPPORT_EMAIL} with this request number for updates.
          </p>
        </div>
      )}
    </div>
  );
}
