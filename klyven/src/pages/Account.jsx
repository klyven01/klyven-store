import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import config from '../config';

export default function Account() {
  const { user, loading, signOut, enabled } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setOrdersLoading(false);
      });
  }, [user]);

  if (!enabled) return <Navigate to="/login" replace />;
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
      <SEO title="My Account — KLYVEN" description="Your KLYVEN account and order history." />
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="spec-tag text-steel mb-1">Logged in as</p>
          <h1 className="font-display text-2xl text-bone">{user.email}</h1>
        </div>
        <button onClick={signOut} className="spec-tag text-steel hover:text-bone">
          Log Out
        </button>
      </div>

      <p className="spec-tag text-bone mb-4">Your Orders</p>
      {ordersLoading ? (
        <p className="spec-tag text-steel">Loading...</p>
      ) : orders.length === 0 ? (
        <div>
          <p className="spec-tag text-steel mb-4">No orders placed with this email yet.</p>
          <Link to="/shop" className="spec-tag text-signal">Shop DROP 01 →</Link>
        </div>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {orders.map((o) => (
            <div key={o.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-bone">{o.order_id}</p>
                <p className="spec-tag text-steel mt-1">{o.order_status}</p>
              </div>
              <p className="font-mono text-bone">{config.CURRENCY_SYMBOL}{o.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
