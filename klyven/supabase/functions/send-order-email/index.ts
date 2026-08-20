// Supabase Edge Function — sends the order confirmation email.
//
// This runs on Supabase's servers, NOT in the browser — so this is the
// correct, safe place to use a real email API secret key. It is never
// downloaded to the customer's browser.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Browsers send an OPTIONS "preflight" request before the real POST —
  // it must get a quick, successful response with CORS headers, or the
  // browser blocks the actual request entirely.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();

    if (!order?.customer?.email || !order?.orderId) {
      return new Response(JSON.stringify({ error: 'Missing order details' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPPORT_EMAIL = Deno.env.get('SUPPORT_EMAIL') || 'support@klyven.in';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const itemsHtml = order.items
      .map((i: any) => `<li>${i.name} (${i.size}/${i.color}) x${i.qty} — ₹${i.price * i.qty}</li>`)
      .join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Thank you for your order, ${order.customer.name.split(' ')[0]}!</h2>
        <p>Your order <strong>${order.orderId}</strong> has been received.</p>
        <p><strong>You'll receive your tracking details within 2–4 hours</strong> once your order is confirmed —
        we'll email you again the moment it ships.</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total: ₹${order.total}</strong></p>
        <p>Shipping to: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.pin}</p>
        <p>Payment status: ${order.paymentStatus}</p>
        <p>Questions? Reach us at ${SUPPORT_EMAIL}.</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `KLYVEN <${FROM_EMAIL}>`,
        to: order.customer.email,
        subject: `Order Confirmed — ${order.orderId}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
