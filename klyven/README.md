# KLYVEN — Store Documentation

Everything you need to run, edit, and grow this website — written for someone
with no coding background. Read this before you touch anything.

---

## 0. Feature status — what's real vs. what needs more setup

Being upfront about this matters more than sounding impressive. Here's
exactly where things stand:

**✅ Fully working (no extra setup):**
Home, Shop with search/filters/sort, Product pages, Size chart (S–XXXXL,
editable), per-product custom colours, Cart, Checkout, Wishlist
(saved per-browser), 3D hover/depth styling, all legal pages, mobile/tablet/
desktop responsive layout, FAQ help chatbot (rule-based, free).

**✅ Working once you connect Supabase (free, ~10 min setup, section 7):**
Order storage & admin dashboard, coupon codes, customer login/signup/
password reset, product reviews, cross-device order tracking.

**✅ Working once you connect Resend (free tier, section 9d):**
Automatic order confirmation emails to customers + you.

**⚠️ Partially built — needs a real payment gateway to go further:**
Manual UPI (QR + UPI ID, verified by you) and COD work today. A real
"customer clicks pay and it's instantly verified" flow needs Razorpay or
similar (section 12) — that's genuine backend work, not a config change.

**❌ Not included in this build (would need significant additional work):**
- A visual admin UI for adding/editing products with image upload — for now,
  products are added by editing `src/data/products.js` directly (section 3).
  This is deliberate: a full drag-and-drop product CMS is a large, separate
  project.
- Email verification on signup, and forgot-password *emails* specifically —
  Supabase Auth supports both, but you need to enable/configure them in your
  Supabase dashboard (Authentication → Settings) rather than in this code.
- A real AI chatbot (the built-in one is free rule-based keyword matching,
  not a language model — see section 9f for how to upgrade it).
- WhatsApp order notifications — official WhatsApp Business API requires a
  Meta Business verification and isn't free; not built here (section 9d
  covers email, which is free).
- Coupon usage limits, per-customer limits, and product/category-specific
  coupons — the coupon system supports percentage-off, min order value, and
  expiry only. Usage-limit logic would need extra database rules.
- Analytics/tracking dashboards — none wired up. Adding Google Analytics or
  Plausible is a small script tag if you want it later.

Nothing above is hidden or silently broken — this list is the honest map of
what you're getting today.

---


## 1. What files were created

```
klyven/
├── index.html              Page shell, SEO tags, hidden Netlify form definitions
├── netlify.toml             Netlify build + routing config
├── package.json             Project dependencies
├── .env.example              Template for secret/config values (copy to .env)
├── src/
│   ├── config.js             ← THE FILE YOU'LL EDIT MOST. Brand name, UPI ID, shipping fees, etc.
│   ├── data/products.js      ← Your product catalog + size guide
│   ├── context/CartContext.jsx   Shopping cart logic (don't need to touch)
│   ├── lib/
│   │   ├── supabaseClient.js  Connects to your database (if configured)
│   │   └── orders.js          Creates + looks up orders
│   ├── components/            Reusable UI pieces (header, footer, product card, etc.)
│   └── pages/                 One file per page (Home, Shop, Cart, Checkout, Admin, etc.)
├── public/                   Static files served as-is: favicon, robots.txt, sitemap.xml,
│                              and where you'll drop product photos
└── supabase/schema.sql       Database setup script (see section 7)
```

You will realistically only ever need to open **`src/config.js`** and
**`src/data/products.js`**, and drop images into **`public/`**.

---

## 2. How the website works

- It's a normal website (built with React) that runs entirely in the visitor's
  browser — there's no server you have to manage.
- Product info lives in `src/data/products.js`, not a database. That keeps V1
  free and simple.
- When someone orders, the order is saved to **Supabase** (a free database) if
  you've connected it, and always backed up in the browser's local storage and
  as a Netlify Forms submission (so you always get notified even before you
  check Supabase).
- Cart contents are saved in the shopper's own browser, so it survives a
  refresh but is private to them.
- The `/admin` page lets you see and update orders (requires Supabase — see
  section 7).

---

## 3. How to add a new T-shirt

Open `src/data/products.js`. Copy one existing product object and paste it at
the end of the `products` array, then edit the fields:

```js
{
  id: 'drop-01-design-06',       // must be unique, used in the URL
  sku: 'KLV-D01-006',
  name: 'DROP 01 — DESIGN 06',
  price: 1899,
  compareAtPrice: null,          // set a number to show a "was" price, or null
  description: 'Write your product description here.',
  images: { front: '/products/design-06-front.jpg', back: '/products/design-06-back.jpg' },
  sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
  colorsAvailable: ['Jet Black', 'Bone White'],
  inStock: true,
  fabric: '...',
  fit: '...',
  care: '...',
},
```

Save the file — that's it, the product now appears in Shop, Best Sellers, and
has its own product page automatically.

## 4. How to change price

In `src/data/products.js`, find the product and change its `price` (and
`compareAtPrice` if you want a strikethrough "was" price). Save the file.

## 5. How to change size

- Sizes now go from S to XXXXL (4XL) across the whole store.
- To edit the sizes a *specific product* is offered in, change its
  `sizesAvailable` array.
- To edit the *size chart numbers* (chest/length/shoulder/sleeve), open
  `src/data/products.js` and edit the `sizeGuide.rows` array. These are
  currently placeholder values — replace with your real measurements before
  launch.

## 5b. How to set colours per product

Every product has its own `colors` array — you're never limited to a fixed
palette. Add as many or as few as that specific product actually comes in:

```js
colors: [
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Olive', hex: '#5C5A3E' },
],
```

`hex` is just the colour code — search "hex color picker" online, pick a
colour, and copy its code. `colorPalette` near the top of the file is just a
starter list you can copy from; it doesn't limit what you can use.

## 6. How to replace product images

1. Put your photo files into the `public/products/` folder (create it if it
   doesn't exist) — e.g. `public/products/design-01-front.jpg`.
2. In `src/data/products.js`, set that product's `images.front` /
   `images.back` to the matching path, e.g. `'/products/design-01-front.jpg'`.
3. Until you do this, the site shows a generated placeholder block labeled
   with the SKU, so nothing looks broken.

Same process for the homepage hero image/video and the "About" / editorial
images — those are marked `PlaceholderImage label="... // REPLACE"` inside
`src/pages/Home.jsx` and `src/pages/About.jsx`. Swap the `<PlaceholderImage
src={...}>` prop for a real image path once you have one, or replace with a
plain `<img>`/`<video>` tag for the hero if you want a video background.

---

## 7. How orders reach me

You have two layers, and can use either or both:

**Layer 1 — Always on, zero setup: Netlify Forms + local backup.**
Every order also submits a hidden Netlify Form. Go to your Netlify dashboard
→ your site → **Forms** tab to see submissions and turn on email
notifications (Site settings → Forms → Form notifications → Email
notification). This is enough to *know* an order came in, but it's not a
proper searchable database.

**Layer 2 — Recommended: Supabase (free tier).** This gives you the real
`/admin` dashboard, order status updates, and Track Order that works from any
device. Setup:

1. Create a free project at [supabase.com](https://supabase.com).
2. In your Supabase project, go to **SQL Editor** → paste in the entire
   contents of `supabase/schema.sql` from this project → **Run**.
3. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public** key.
4. In Netlify: **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
5. Redeploy the site. Orders now save to Supabase automatically, and
   `/admin` becomes a real dashboard.
6. Create your own admin login: Supabase dashboard → **Authentication →
   Users → Add User** (use your own email + a strong password). Use that to
   log in at `yoursite.com/admin`.

Without Supabase, orders still work (thanks to the local + Netlify Forms
backup) but you can't see them all in one place from any device — you'd be
relying on Netlify Forms and manually noting details down.

---

## 8. How payment verification works

For V1, no payment gateway is connected — this is intentional and stated
clearly to customers. The manual UPI flow works like this:

1. Customer selects "Pay Securely via UPI" at checkout.
2. They see your UPI ID and QR code (set in `src/config.js` →
   `UPI_ID` / `UPI_QR_IMAGE`) and pay manually using any UPI app.
3. They enter the transaction/reference ID from their UPI app and confirm
   they've paid.
4. The order is created with payment status **"Payment Verification"** — it
   is *not* automatically marked as paid.
5. **You check your UPI app for a matching payment**, then go to `/admin` and
   change the order's payment status to "Paid" once you've confirmed it
   manually. This manual check is your fraud protection for V1.

Cash on Delivery orders skip this — payment status starts as "Pending
Payment" and you'd mark it "Paid" after the courier confirms delivery/payment.

## 9. How to add tracking

Once Supabase is connected: go to `/admin`, log in, find the order, and type
the tracking number and tracking URL directly into the table — it saves
automatically when you click away from the field. The customer can then see
this on the Track Order page. (Automatic tracking emails aren't wired up in
V1 — see the note on transactional email below.)

### Connecting transactional email (order confirmations, tracking updates)
V1 doesn't send emails automatically — you'll need a transactional email
service, which requires a small server-side function (never put an email
API's secret key in frontend code). A beginner-friendly free-tier option:

1. Sign up for [Resend](https://resend.com) (or Brevo, another free option).
2. Create a **Netlify Function** (a small serverless file in
   `netlify/functions/send-order-email.js`) that receives the order details
   and calls the Resend API using a `RESEND_API_KEY` stored in Netlify's
   environment variables (never in your React code).
3. Call that function from `src/lib/orders.js` right after `createOrder`
   succeeds.

This is a "when you're ready" step, not required to launch.

---

## 9b. How to add discount coupons (e.g. "SALE20" for 20% off)

Coupons need Supabase connected (section 7). Once it is:

1. Go to your Supabase project → **Table Editor → coupons**.
2. Click **Insert row** and fill in:
   - `code`: e.g. `SALE20` (customers will type this — it's matched
     automatically in uppercase, so case doesn't matter)
   - `percent_off`: e.g. `20` for 20% off
   - `active`: `true` (set to `false` any time to disable a coupon
     without deleting it)
   - `expires_at`: optional — leave blank for no expiry
   - `min_order_value`: optional — e.g. `999` to require a minimum cart size
3. Save. The coupon works immediately at checkout — no redeploy needed.

To end a sale, just set `active` to `false` on that row.

## 9c. Customer login

Also needs Supabase (section 7). Once connected, a **Login** link appears in
the header automatically. Customers can create an account and see their past
orders (matched by the email they used at checkout) on their **My Account**
page. This is entirely separate from the `/admin` login — customer accounts
can never access the admin dashboard.

## 9d. Order confirmation emails

By default, no emails send automatically — this needs one extra piece
because sending email requires a real secret key, which must never live in
frontend code. Setup:

1. Sign up for a free [Resend](https://resend.com) account, verify a sending
   domain (or use their test domain while developing), and get an API key.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) on your
   computer and log in (`supabase login`).
3. From the project folder, run:
   ```
   supabase functions deploy send-order-email --project-ref YOUR_PROJECT_REF
   supabase secrets set RESEND_API_KEY=your_real_key --project-ref YOUR_PROJECT_REF
   supabase secrets set SUPPORT_EMAIL=support@yourdomain.com --project-ref YOUR_PROJECT_REF
   ```
   (Your project ref is in Supabase → Project Settings → General.)
4. That's it — every new order now automatically emails the customer a
   confirmation that says their tracking details will follow within 2–4
   hours. The email code lives in
   `supabase/functions/send-order-email/index.ts` if you want to customize
   the wording.

If you skip this setup, orders still work exactly as before — customers just
won't get an automatic email (you can still email them manually from the
order details in `/admin`).

## 9e. A note on security

No website — including large, well-funded stores — is ever "100% secure";
what matters is following solid practices and not overstating what's in
place. Here's what this build actually does:

- **In transit**: Netlify/Cloudflare serve the site over HTTPS automatically,
  encrypting data between the customer's browser and the server.
- **Database access**: Supabase's Row Level Security (RLS) policies (in
  `supabase/schema.sql`) restrict exactly what an anonymous visitor vs. a
  logged-in admin can read or change — a shopper can create an order but
  can't edit anyone else's order or see admin-only data.
- **Payments**: card numbers, CVV, UPI PINs, and OTPs are never collected or
  stored anywhere in this codebase — payments are either manual UPI
  (verified by you) or handled entirely by a real gateway if you connect one
  later (section 12).
- **Admin access**: protected by real Supabase Authentication, not a
  password typed into the code.

What this does **not** include: a security audit, penetration testing, or
protections like rate-limiting/fraud-detection that large platforms build
over years. As you grow, consider a professional security review.

## 9f. Product reviews

Needs Supabase (section 7). Once connected, customers can leave a star
rating + comment on any product page, and it shows immediately (reviews are
approved by default — see `supabase/schema.sql`, table `reviews`, column
`approved`, if you want to moderate before publishing: set the default to
`false` and approve rows manually in Table Editor).

## 9g. Wishlist

Works immediately, no setup — saved in the shopper's own browser (not
shared across devices, since it doesn't need a backend). The heart icon on
any product card or the product page toggles it; `/wishlist` shows saved items.

## 9h. COD extra charge

Set in `src/config.js` → `COD_EXTRA_CHARGE` (e.g. `20` for ₹20 extra on Cash
on Delivery orders — set to `0` to charge the same price as online). This
applies to the whole order, not per-product; per-product COD fees would need
a small extension to the checkout total calculation.

## 9i. Help chatbot (free, rule-based)

The chat bubble in the bottom-right answers a fixed set of approved topics
(sizing, shipping, returns, COD, payment, tracking, brand story, care,
coupons, contact) by matching keywords — see `src/components/HelpChatbot.jsx`
to edit the questions/answers. It never invents order status or stock info,
and always falls back to "contact support" for anything outside its list.

**Upgrading to a real AI chatbot later**: this needs a paid API (OpenAI,
Anthropic, or Google Gemini — Gemini has a free tier with limits). You'd
replace the `findAnswer()` function with a call to a Supabase Edge Function
(same pattern as `send-order-email`) that calls the AI API server-side, so
the API key stays secret. This is a meaningful upgrade, not a config change.

## 9j. Return / Replace requests

A full, secure return/replace flow — needs Supabase (section 7). Customers go
to `/return-request`, enter their **Order ID + email/phone** (this is
verified against the real order — a stranger can't file a request against
an order that isn't theirs), then choose Return or Replace, describe the
item(s), and give a reason. Each request gets its own ID (e.g.
`RET-2026-0001`).

You manage requests in `/admin` under **"Return / Replace Requests"** —
update status through: Requested → Under Review → Approved → Rejected →
Completed. Linked from the Returns Policy page, Track Order page, and footer.

## 10. How to deploy (Netlify, Vercel, or Cloudflare Pages)

> **Important — avoid a common upload mistake:** when you upload this
> project to GitHub, upload the *contents* of the `klyven` folder (i.e.
> `package.json`, `src`, `public`, etc. should sit directly in your repo's
> root) — not the `klyven` folder itself. If GitHub's file list shows a
> `klyven` folder that you have to click into to find `package.json`, your
> deploy platform won't find it. If you're setting this up fresh, the
> simplest way is: extract the zip, open the `klyven` folder, select
> everything *inside* it (Ctrl+A / Cmd+A), and drag those files/folders
> into GitHub's upload box — not the outer folder.

> If you're on Vercel or Cloudflare Pages instead of Netlify (e.g. because
> Netlify's free plan ran out of monthly credits), the steps are the same —
> connect the same GitHub repo, set Framework Preset to **Vite**, Build
> command to `npm run build`, and output directory to `dist`. The
> `public/_redirects` file in this project already handles the routing
> Cloudflare needs (equivalent to `netlify.toml` on Netlify and `vercel.json`
> on Vercel), so all three platforms work without extra config.

### Deploying on Netlify

1. Push this project to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** → connect your
   GitHub repo.
3. Build settings (should auto-detect from `netlify.toml`, but confirm):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add your environment variables (Site settings → Environment variables) —
   at minimum the Supabase ones from section 7 if you're using it.
5. Click **Deploy**. Netlify gives you a URL like `klyven.netlify.app`.
6. To enable the contact/newsletter/order-backup forms, no extra setup is
   needed — Netlify auto-detects the hidden forms in `index.html` on deploy.

## 11. How to connect a custom domain later

In Netlify: **Site settings → Domain management → Add a domain**. Follow
Netlify's instructions to point your domain's DNS to Netlify (either by
changing nameservers or adding the DNS records Netlify shows you). Netlify
issues a free HTTPS certificate automatically once it's connected.

## 12. How to connect a legitimate payment gateway later

The architecture is already set up for this:

1. Change `PAYMENT_MODE` in `src/config.js` from `'manual_upi'` to
   `'razorpay'`.
2. Sign up with Razorpay (or another RBI-approved gateway) and get your
   **Key ID** (public) and **Key Secret** (private).
3. Put the Key ID in Netlify env vars as `VITE_RAZORPAY_KEY_ID` — this one is
   safe in frontend code, it's designed to be public.
4. The **Key Secret must never go in frontend code.** You'll need a small
   server-side piece (a Netlify Function) that creates the payment order and
   verifies the payment signature using the secret, called from the Checkout
   page instead of the current manual-UPI block.
5. This is genuine backend work — budget time for it or bring in a developer
   when you're ready to go live with real online payments.

## 13. How to maintain the website

- **Weekly**: check `/admin` (or Netlify Forms) for new orders and update
  their status as they move through fulfilment.
- **Per drop**: update `src/data/products.js` with new products, prices, and
  stock; upload new images to `public/products/`.
- **Occasionally**: update `src/config.js` if your support email, Instagram,
  shipping fee, or UPI ID changes.
- **Dependencies**: every few months, a developer (or you, if comfortable)
  can run `npm outdated` and `npm update` to keep packages current.

## 14. How to backup orders

- If using Supabase: **Table Editor → orders → Export** (CSV) lets you
  download your full order history any time. Supabase also keeps automatic
  backups on paid tiers — for extra safety, export a CSV monthly yourself.
- If not using Supabase: your only records are Netlify Forms submissions
  (Netlify dashboard → Forms → export/download) — this is a strong reason to
  set up Supabase before you launch for real.

For fulfilment, every order's customer name, phone, email, address, product,
size, colour, quantity, and Order ID are all visible together in `/admin` (or
in a Netlify Forms submission) so you can copy them straight to your
print-on-demand supplier.

## 15. What you should NEVER put in frontend code

Frontend code (anything in `src/`, and especially anything with a `VITE_`
prefix in environment variables) is downloaded and readable by anyone who
visits your site. Never put here:

- Payment gateway **secret keys** (only the public Key ID is safe)
- Database admin/service-role keys (only the Supabase **anon** key is safe —
  it's designed to be public and is protected by the RLS policies in
  `supabase/schema.sql`)
- Email service API keys (Resend, Brevo, etc.)
- Admin passwords — use Supabase Authentication instead, never a hardcoded
  password in code
- Customers' card numbers, CVV, UPI PIN, OTPs, or banking passwords — this
  site never asks for these, and you never should either

---

## Quick local setup (for a developer)

```bash
npm install
cp .env.example .env    # fill in Supabase values if you have them
npm run dev              # starts local dev server
npm run build             # builds the production site into /dist
```
