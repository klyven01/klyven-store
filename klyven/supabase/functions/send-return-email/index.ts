// Supabase Edge Function — sends TWO emails when a return/replace request
// is submitted: a "thank you, we'll call you in 2–4 hours" email to the
// customer, and a notification email to the store owner.
//
// Runs on Supabase's servers, not the browser — safe place for the real
// email API key.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { request } = await req.json();

    if (!request?.email || !request?.requestNumber) {
      return new Response(JSON.stringify({ error: 'Missing request details' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPPORT_EMAIL = Deno.env.get('SUPPORT_EMAIL') || 'support@klyven.in';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
    const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') || SUPPORT_EMAIL;

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const customerHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Thank you, ${request.customerName.split(' ')[0]}!</h2>
        <p>We've received your <strong>${request.requestType}</strong> request
        <strong>${request.requestNumber}</strong> for order <strong>${request.orderId}</strong>.</p>
        <p><strong>We'll call you within 2–4 hours</strong> at ${request.phone} to confirm the details
        and next steps.</p>
        <p>Item(s): ${request.itemsDescription}</p>
        <p>Reason: ${request.reason}</p>
        <p>Questions in the meantime? Reach us at ${SUPPORT_EMAIL}.</p>
      </div>
    `;

    const ownerHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>New ${request.requestType} request</h2>
        <p><strong>${request.requestNumber}</strong> for order <strong>${request.orderId}</strong></p>
        <p>Customer: ${request.customerName} — ${request.phone} — ${request.email}</p>
        <p>Item(s): ${request.itemsDescription}</p>
        <p>Reason: ${request.reason}</p>
        <p>Review and update status in your Admin dashboard.</p>
      </div>
    `;

    const [customerRes, ownerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `KLYVEN <${FROM_EMAIL}>`,
          to: request.email,
          subject: `We've got your request — ${request.requestNumber}`,
          html: customerHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `KLYVEN <${FROM_EMAIL}>`,
          to: OWNER_EMAIL,
          subject: `New ${request.requestType} request — ${request.requestNumber}`,
          html: ownerHtml,
        }),
      }),
    ]);

    if (!customerRes.ok || !ownerRes.ok) {
      const errText = await (customerRes.ok ? ownerRes : customerRes).text();
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
