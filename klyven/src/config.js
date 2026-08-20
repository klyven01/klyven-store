/**
 * KLYVEN — SITE CONFIG
 * ---------------------------------------------------------------
 * This is the one file you should need to touch for day-to-day
 * business changes. No code knowledge required — just edit the
 * values on the right of each colon and save.
 *
 * Do NOT put real secrets (passwords, API secret keys) in this file.
 * This file is bundled into the public website JS, so anything here
 * is visible to anyone who visits the site. It's fine for things
 * like your support email or UPI ID (which you'd show customers
 * anyway) — it is NOT fine for passwords or private API keys.
 * Those go in Netlify's environment variables instead (see .env.example).
 * ---------------------------------------------------------------
 */

const config = {
  // ---- Brand ----
  BRAND_NAME: 'KLYVEN',
  TAGLINE: 'MOVE DIFFERENT.',

  // ---- Contact ----
  SUPPORT_EMAIL: 'support@klyven.in',
  SUPPORT_PHONE: '+91 90000 00000',
  INSTAGRAM_URL: 'https://instagram.com/klyven',

  // ---- Payments ----
  // 'razorpay' | 'manual_upi' | 'cod_only'
  // For V1 with no gateway connected yet, keep this as 'manual_upi'.
  PAYMENT_MODE: 'manual_upi',

  // Toggle Cash on Delivery on/off across the whole site.
  COD_ENABLED: true,

  // Manual UPI details — only shown to customers when PAYMENT_MODE is 'manual_upi'.
  UPI_ID: 'REPLACE_WITH_PARENT_OR_GUARDIAN_BUSINESS_UPI@bank',
  UPI_QR_IMAGE: '/upi-qr-placeholder.svg',

  // ---- Money ----
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
  SHIPPING_CHARGE: 79,
  FREE_SHIPPING_THRESHOLD: 1499,

  // Extra amount added ONLY for Cash on Delivery orders (covers handling
  // risk). Set to 0 to charge the exact same price for COD as online.
  COD_EXTRA_CHARGE: 20,

  // How many days after delivery a customer can request a return/exchange.
  RETURN_DAYS: 3,

  // ---- Order ID format ----
  ORDER_PREFIX: 'KLV',
};

export default config;
