import { supabase, isSupabaseConfigured } from './supabaseClient';
import { findOrder } from './orders';
import config from '../config';

const RETURN_STATUSES = ['Requested', 'Under Review', 'Approved', 'Rejected', 'Completed'];

async function nextRequestNumber() {
  const year = new Date().getFullYear();
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('next_return_number');
    if (!error && data) return `RET-${year}-${String(data).padStart(4, '0')}`;
  }
  // Fallback (only used if Supabase isn't configured — same limitation as
  // order IDs without a database, see lib/orders.js).
  return `RET-${year}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

/**
 * Verifies the Order ID + email/phone actually match a real order before
 * allowing a return/replace request — this is what stops a stranger from
 * filing a request against an order that isn't theirs.
 */
export async function verifyOrderForReturn(orderId, contact) {
  if (!isSupabaseConfigured) {
    return { valid: false, message: 'Returns aren\u2019t available yet — connect Supabase to enable them.' };
  }
  const order = await findOrder(orderId, contact);
  if (!order) {
    return { valid: false, message: 'No order found for that Order ID and contact combination.' };
  }
  return { valid: true, order };
}

/**
 * Calls the `send-return-email` Edge Function so the customer gets a
 * "we'll call you in 2–4 hours" confirmation and you get a notification.
 * Silently does nothing if the function isn't deployed — the request is
 * already saved either way.
 */
async function sendReturnEmails(request) {
  try {
    await supabase.functions.invoke('send-return-email', { body: { request } });
  } catch {
    // Non-fatal.
  }
}

/**
 * Submits a return/replace request. Call verifyOrderForReturn() first —
 * this function trusts that the order was already verified.
 */
export async function submitReturnRequest({ order, requestType, itemsDescription, reason }) {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Returns aren\u2019t available yet — connect Supabase to enable them.' };
  }

  const requestNumber = await nextRequestNumber();

  const { error } = await supabase.from('return_requests').insert([
    {
      request_number: requestNumber,
      order_id: order.orderId,
      customer_name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      request_type: requestType,
      items_description: itemsDescription,
      reason,
    },
  ]);

  if (error) {
    return { success: false, message: 'Could not submit your request. Please try again or email ' + config.SUPPORT_EMAIL + '.' };
  }

  sendReturnEmails({
    requestNumber,
    orderId: order.orderId,
    customerName: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    requestType,
    itemsDescription,
    reason,
  });

  return { success: true, requestNumber };
}

/** Looks up existing return/replace requests for a customer (Order ID + email/phone). */
export async function findReturnRequests(orderId, contact) {
  if (!isSupabaseConfigured) return [];
  const normalized = contact.trim().toLowerCase();

  const { data, error } = await supabase
    .from('return_requests')
    .select('*')
    .eq('order_id', orderId.trim())
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.filter(
    (r) =>
      r.email?.toLowerCase() === normalized ||
      r.phone?.replace(/\s+/g, '') === contact.trim().replace(/\s+/g, '')
  );
}

export { RETURN_STATUSES };
