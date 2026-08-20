import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { findOrder } from '../lib/orders';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import config from '../config';

const statusSteps = [
  'Pending Payment',
  'Payment Verification',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    const result = await findOrder(orderId, contact);
    setOrder(result);
    setSearched(true);
    setLoading(false);
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Track Order — KLYVEN" description="Track your KLYVEN order status." />
      <p className="spec-tag text-signal mb-2">Order Status</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Track Order</h1>

      {!isSupabaseConfigured && (
        <p className="text-xs text-steel normal-case mb-6 border border-line px-4 py-3">
          Tracking is currently only available on the same device the order was placed on, since a
          database isn't connected yet. See README for how to connect Supabase for full cross-device tracking.
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mb-10">
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
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {searched && !order && (
        <p className="spec-tag text-signal">
          No order found for that Order ID and contact combination. Double-check both fields.
        </p>
      )}

      {order && (
        <div className="border border-line p-6">
          <div className="flex justify-between spec-tag mb-6">
            <span className="text-steel">Order ID</span>
            <span className="font-mono text-bone">{order.orderId}</span>
          </div>

          <div className="mb-8">
            <p className="spec-tag text-bone mb-4">{order.orderStatus}</p>
            <div className="flex gap-1">
              {statusSteps.map((step, i) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 ${i <= currentStepIndex ? 'bg-signal' : 'bg-line'}`}
                  title={step}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {order.items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="text-steel">{item.name} ({item.size}/{item.color}) x{item.qty}</span>
                <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="spec-tag text-steel space-y-2 border-t border-line pt-4">
            <div className="flex justify-between">
              <span>Order Date</span>
              <span className="text-bone">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className="text-bone">{order.paymentStatus}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span>Tracking Number</span>
                <span className="text-bone">{order.trackingNumber}</span>
              </div>
            )}
            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="block text-signal underline underline-offset-4">
                Track with Courier →
              </a>
            )}
          </div>

          <Link to="/return-request" className="block mt-6 spec-tag text-steel hover:text-bone">
            Need a return or replacement? →
          </Link>
        </div>
      )}
    </div>
  );
}
