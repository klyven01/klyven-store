import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Validates a coupon code against the Supabase `coupons` table.
 * Returns { valid: true, percentOff, code } or { valid: false, message }.
 *
 * Without Supabase connected, coupons can't be validated (there's nowhere
 * to store them) — checkout will show a clear message telling the shopper
 * coupons aren't available yet, instead of silently failing.
 */
export async function validateCoupon(rawCode, subtotal) {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, message: 'Enter a coupon code.' };

  if (!isSupabaseConfigured) {
    return {
      valid: false,
      message: 'Coupons aren\u2019t available yet — connect Supabase to enable them (see README).',
    };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) {
    return { valid: false, message: 'Invalid or expired coupon code.' };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, message: 'This coupon has expired.' };
  }

  if (data.min_order_value && subtotal < data.min_order_value) {
    return {
      valid: false,
      message: `This coupon needs a minimum order of ₹${data.min_order_value}.`,
    };
  }

  return { valid: true, percentOff: Number(data.percent_off), code };
}
