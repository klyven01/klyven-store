import { Link, useLocation, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import config from '../config';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/track-order" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24 text-center">
      <SEO title="Order Placed — KLYVEN" description="Your KLYVEN order has been placed." />
      <p className="spec-tag text-signal mb-4">Order Received</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-4">Thank you, {order.customer.name.split(' ')[0]}.</h1>
      <p className="text-steel mb-8">
        Your order <span className="font-mono text-bone">{order.orderId}</span> has been placed.
        {order.paymentMethod === 'upi'
          ? ' We will confirm your order once we verify your UPI payment.'
          : ' Pay in cash when your order arrives.'}
      </p>

      <div className="border border-line text-left p-6 mb-10">
        <div className="flex justify-between spec-tag mb-4">
          <span className="text-steel">Order ID</span>
          <span className="font-mono text-bone">{order.orderId}</span>
        </div>
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
              <span className="text-steel">{item.name} ({item.size}/{item.color}) x{item.qty}</span>
              <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between spec-tag text-bone border-t border-line pt-4">
          <span>Total</span>
          <span className="font-mono">{config.CURRENCY_SYMBOL}{order.total}</span>
        </div>
      </div>

      <p className="text-sm text-steel normal-case mb-10">
        A confirmation with your order details has been sent — keep your Order ID and the email or
        phone number you checked out with, you'll need them to track your order.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/track-order" className="spec-tag border border-bone text-bone px-6 py-3 hover:bg-ash">
          Track This Order
        </Link>
        <Link to="/shop" className="spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
