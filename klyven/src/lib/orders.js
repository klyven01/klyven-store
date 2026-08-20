import { supabase, isSupabaseConfigured } from './supabaseClient';
import config from '../config';

const LOCAL_ORDERS_KEY = 'klyven_orders_v1';
const LOCAL_COUNTER_KEY = 'klyven_order_counter_v1';

function readLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeLocalOrders(orders) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Generates an order ID like KLV-2026-0001.
 * With Supabase configured, the counter lives in the database (see
 * supabase/schema.sql -> order_seq) so numbering stays correct across
 * every visitor. Without Supabase, it falls back to a counter stored in
 * this browser only — fine for testing, not for a real multi-customer
 * launch (see README).
 */
async function nextOrderId() {
  const year = new Date().getFullYear();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('next_order_number');
    if (!error && data) {
      return `${config.ORDER_PREFIX}-${year}-${String(data).padStart(4, '0')}`;
    }
  }

  const current = Number(localStorage.getItem(LOCAL_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(LOCAL_COUNTER_KEY, String(current));
  return `${config.ORDER_PREFIX}-${year}-${String(current).padStart(4, '0')}`;
}

/**
 * Submits the hidden static Netlify Form as a backup notification channel.
 * This does NOT replace order storage — it just makes sure you get an
 * email/notification from Netlify the moment an order comes in, even
 * before you check the admin dashboard. See README -> "How orders reach me".
 */
async function notifyViaNetlifyForm(order) {
  try {
    const body = new URLSearchParams({
      'form-name': 'klyven-order-backup',
      orderId: order.orderId,
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email,
      address: `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.pin}`,
      items: order.items.map((i) => `${i.name} (${i.size}/${i.color}) x${i.qty}`).join(' | '),
      amount: String(order.total),
      paymentMethod: order.paymentMethod,
    });
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  } catch {
    // Non-fatal — the order is still saved via createOrder's primary path.
  }
}

/**
 * Calls the `send-order-email` Supabase Edge Function so the customer gets
 * an automatic confirmation email. Silently does nothing if Supabase isn't
 * configured or the function isn't deployed yet — order creation never
 * fails because of this. See README -> "Order confirmation emails".
 */
async function sendConfirmationEmail(order) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.functions.invoke('send-order-email', { body: { order } });
  } catch {
    // Non-fatal — the order is already saved. Most likely the function
    // isn't deployed yet (see README setup steps).
  }
}

/**
 * Creates an order. Tries Supabase first (so it's visible in the admin
 * dashboard from any device); always also writes to localStorage as a
 * same-device safety copy for the order-success/track-order pages; and
 * always pings the Netlify Form backup so you get a notification.
 */
export async function createOrder({ customer, items, subtotal, shipping, codExtra = 0, discount = 0, couponCode = '', total, paymentMethod }) {
  const orderId = await nextOrderId();

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    shipping,
    codExtra,
    discount,
    couponCode,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'Pending Payment' : 'Payment Verification',
    orderStatus: 'Pending Payment',
    trackingNumber: '',
    trackingUrl: '',
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('orders').insert([
      {
        order_id: order.orderId,
        customer_name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pin: customer.pin,
        items,
        subtotal,
        shipping,
        discount,
        coupon_code: couponCode,
        total,
        payment_method: paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        tracking_number: '',
        tracking_url: '',
      },
    ]);
    if (error) {
      console.error('Supabase order insert failed, order still saved locally:', error.message);
    }
  }

  const local = readLocalOrders();
  local.unshift(order);
  writeLocalOrders(local);

  notifyViaNetlifyForm(order);
  sendConfirmationEmail(order);

  return order;
}

/**
 * Looks up an order by Order ID + email OR phone (for the Track Order page).
 */
export async function findOrder(orderId, contact) {
  const normalizedContact = contact.trim().toLowerCase();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId.trim())
      .maybeSingle();

    if (!error && data) {
      const matches =
        data.email?.toLowerCase() === normalizedContact ||
        data.phone?.replace(/\s+/g, '') === contact.trim().replace(/\s+/g, '');
      if (matches) return mapSupabaseOrder(data);
      return null;
    }
  }

  const local = readLocalOrders();
  return (
    local.find(
      (o) =>
        o.orderId === orderId.trim() &&
        (o.customer.email.toLowerCase() === normalizedContact ||
          o.customer.phone.replace(/\s+/g, '') === contact.trim().replace(/\s+/g, ''))
    ) || null
  );
}

function mapSupabaseOrder(row) {
  return {
    orderId: row.order_id,
    createdAt: row.created_at,
    customer: {
      name: row.customer_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pin: row.pin,
    },
    items: row.items,
    subtotal: row.subtotal,
    shipping: row.shipping,
    discount: row.discount,
    couponCode: row.coupon_code,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    trackingNumber: row.tracking_number,
    trackingUrl: row.tracking_url,
  };
}

export function getLocalOrders() {
  return readLocalOrders();
}
