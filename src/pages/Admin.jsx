import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getLocalOrders } from '../lib/orders';
import config from '../config';

const STATUSES = [
  'Pending Payment',
  'Payment Verification',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

/**
 * V1 admin dashboard.
 *
 * Security note: this page is only truly protected when Supabase is
 * configured, because it uses real Supabase Authentication (email +
 * password you create yourself in the Supabase dashboard) rather than a
 * password typed into frontend code. Without Supabase, this page falls
 * back to a read-only view of orders saved in THIS browser only, and is
 * not meaningfully protected — do not rely on it for a real launch.
 * See README -> "How to add tracking" / "Admin" for setup steps.
 */
export default function Admin() {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured && session) fetchOrders();
    if (!isSupabaseConfigured) setOrders(getLocalOrders());
  }, [session]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword(loginForm);
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateOrder = async (orderRowId, fields) => {
    await supabase.from('orders').update(fields).eq('id', orderRowId);
    fetchOrders();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-16 md:py-24">
        <SEO title="Admin — KLYVEN" />
        <p className="spec-tag text-signal mb-6">
          Connect Supabase to unlock the full admin dashboard (see README). Showing local orders
          from this browser only, read-only.
        </p>
        <OrdersTable orders={orders.map(mapLocalToRow)} readOnly />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-sm mx-auto px-5 py-24">
        <SEO title="Admin Login — KLYVEN" />
        <h1 className="font-display text-2xl text-bone mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            className="input"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
            className="input"
          />
          {loginError && <p className="text-signal spec-tag">{loginError}</p>}
          <button type="submit" className="w-full spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white">
            Log In
          </button>
        </form>
        <p className="text-xs text-steel normal-case mt-6">
          Admin accounts are created in your Supabase dashboard under Authentication — there is no
          signup form here on purpose.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Admin — KLYVEN" />
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl md:text-3xl text-bone">Orders</h1>
        <button onClick={handleLogout} className="spec-tag text-steel hover:text-bone">
          Log Out
        </button>
      </div>
      {loading ? (
        <p className="spec-tag text-steel">Loading...</p>
      ) : (
        <OrdersTable orders={orders} onUpdate={updateOrder} />
      )}
    </div>
  );
}

function mapLocalToRow(o) {
  return {
    id: o.orderId,
    order_id: o.orderId,
    customer_name: o.customer.name,
    phone: o.customer.phone,
    email: o.customer.email,
    total: o.total,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    order_status: o.orderStatus,
    tracking_number: o.trackingNumber,
    tracking_url: o.trackingUrl,
  };
}

function OrdersTable({ orders, onUpdate, readOnly }) {
  if (orders.length === 0) return <p className="spec-tag text-steel">No orders yet.</p>;

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full text-left spec-tag">
        <thead>
          <tr className="border-b border-line text-steel">
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Order Status</th>
            <th className="p-3">Tracking #</th>
            <th className="p-3">Tracking URL</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-line/50 text-bone align-top">
              <td className="p-3 font-mono">{o.order_id}</td>
              <td className="p-3 normal-case">
                {o.customer_name}
                <br />
                <span className="text-steel text-[0.6rem]">{o.phone} / {o.email}</span>
              </td>
              <td className="p-3 font-mono">{config.CURRENCY_SYMBOL}{o.total}</td>
              <td className="p-3">
                {readOnly ? (
                  o.payment_status
                ) : (
                  <select
                    value={o.payment_status}
                    onChange={(e) => onUpdate(o.id, { payment_status: e.target.value })}
                    className="bg-void border border-line px-2 py-1"
                  >
                    {['Pending Payment', 'Payment Verification', 'Paid', 'Refunded'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </td>
              <td className="p-3">
                {readOnly ? (
                  o.order_status
                ) : (
                  <select
                    value={o.order_status}
                    onChange={(e) => onUpdate(o.id, { order_status: e.target.value })}
                    className="bg-void border border-line px-2 py-1"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </td>
              <td className="p-3">
                {readOnly ? (
                  o.tracking_number
                ) : (
                  <input
                    defaultValue={o.tracking_number}
                    onBlur={(e) => onUpdate(o.id, { tracking_number: e.target.value })}
                    className="bg-void border border-line px-2 py-1 w-28"
                  />
                )}
              </td>
              <td className="p-3">
                {readOnly ? (
                  o.tracking_url
                ) : (
                  <input
                    defaultValue={o.tracking_url}
                    onBlur={(e) => onUpdate(o.id, { tracking_url: e.target.value })}
                    className="bg-void border border-line px-2 py-1 w-40"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
