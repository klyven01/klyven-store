import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/orders';
import { validateCoupon } from '../lib/coupons';
import config from '../config';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pin: '',
  paymentMethod: config.PAYMENT_MODE === 'manual_upi' ? 'upi' : 'cod',
  upiTxnId: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [upiConfirmed, setUpiConfirmed] = useState(false);

  const [upiTab, setUpiTab] = useState('qr');
  const [upiCopied, setUpiCopied] = useState(false);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(config.UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // Clipboard API can fail on some browsers/permissions — non-fatal.
    }
  };

  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, percentOff }
  const [couponMessage, setCouponMessage] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const shipping = subtotal >= config.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : config.SHIPPING_CHARGE;
  const codExtra = form.paymentMethod === 'cod' ? config.COD_EXTRA_CHARGE : 0;
  const discount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  const total = Math.max(0, subtotal + shipping + codExtra - discount);

  const handleApplyCoupon = async () => {
    setCheckingCoupon(true);
    setCouponMessage('');
    const result = await validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setCoupon({ code: result.code, percentOff: result.percentOff });
      setCouponMessage(`Applied — ${result.percentOff}% off.`);
    } else {
      setCoupon(null);
      setCouponMessage(result.message);
    }
    setCheckingCoupon(false);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput('');
    setCouponMessage('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="spec-tag text-steel mb-4">Your cart is empty.</p>
        <Link to="/shop" className="spec-tag text-signal">Shop DROP 01 →</Link>
      </div>
    );
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!/^[0-9]{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.state.trim()) e.state = 'State is required.';
    if (!/^[0-9]{6}$/.test(form.pin.trim())) e.pin = 'Enter a valid 6-digit PIN code.';
    if (form.paymentMethod === 'upi' && !form.upiTxnId.trim()) {
      e.upiTxnId = 'Enter the UPI transaction / reference ID after paying.';
    }
    if (form.paymentMethod === 'upi' && !upiConfirmed) {
      e.upiConfirmed = 'Please confirm you have completed the UPI payment.';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pin: form.pin.trim(),
          upiTxnId: form.paymentMethod === 'upi' ? form.upiTxnId.trim() : '',
        },
        items,
        subtotal,
        shipping,
        codExtra,
        discount,
        couponCode: coupon?.code || '',
        total,
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err) {
      setErrors({ submit: 'Something went wrong placing your order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <SEO title="Checkout — KLYVEN" description="Complete your KLYVEN order." />
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Checkout</h1>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-12">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="spec-tag text-bone mb-2">Contact & Shipping</legend>
            <Field label="Full Name" error={errors.name}>
              <input value={form.name} onChange={update('name')} className="input" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mobile Number" error={errors.phone}>
                <input value={form.phone} onChange={update('phone')} className="input" inputMode="numeric" placeholder="10-digit number" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input value={form.email} onChange={update('email')} className="input" type="email" />
              </Field>
            </div>
            <Field label="Complete Address" error={errors.address}>
              <textarea value={form.address} onChange={update('address')} className="input" rows={3} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" error={errors.city}>
                <input value={form.city} onChange={update('city')} className="input" />
              </Field>
              <Field label="State" error={errors.state}>
                <input value={form.state} onChange={update('state')} className="input" />
              </Field>
              <Field label="PIN Code" error={errors.pin}>
                <input value={form.pin} onChange={update('pin')} className="input" inputMode="numeric" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="spec-tag text-bone mb-2">Payment Method</legend>

            {config.PAYMENT_MODE === 'razorpay' && (
              <label className="flex items-center gap-3 border border-line px-4 py-3 opacity-50 cursor-not-allowed">
                <input type="radio" disabled />
                <span className="spec-tag text-steel">Online Payment — Coming Soon (gateway not yet connected)</span>
              </label>
            )}

            {(config.PAYMENT_MODE === 'manual_upi') && (
              <label className={`flex items-center gap-3 border px-4 py-3 cursor-pointer ${form.paymentMethod === 'upi' ? 'border-signal' : 'border-line'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === 'upi'}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: 'upi' }))}
                />
                <span className="spec-tag text-bone">Pay Securely via UPI</span>
              </label>
            )}

            {config.COD_ENABLED && (
              <label className={`flex items-center gap-3 border px-4 py-3 cursor-pointer ${form.paymentMethod === 'cod' ? 'border-signal' : 'border-line'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: 'cod' }))}
                />
                <span className="spec-tag text-bone">
                  Cash on Delivery
                  {config.COD_EXTRA_CHARGE > 0 && (
                    <span className="text-steel"> (+{config.CURRENCY_SYMBOL}{config.COD_EXTRA_CHARGE} handling)</span>
                  )}
                </span>
              </label>
            )}

            {form.paymentMethod === 'upi' && (
              <div className="border border-line p-5 mt-2 space-y-5">
                <div className="flex gap-2 border-b border-line pb-4">
                  <button
                    type="button"
                    onClick={() => setUpiTab('qr')}
                    className={`spec-tag flex-1 py-2 border ${upiTab === 'qr' ? 'border-bone text-bone' : 'border-line text-steel'}`}
                  >
                    Scan QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiTab('id')}
                    className={`spec-tag flex-1 py-2 border ${upiTab === 'id' ? 'border-bone text-bone' : 'border-line text-steel'}`}
                  >
                    Pay via UPI ID
                  </button>
                </div>

                {upiTab === 'qr' ? (
                  <div className="text-center">
                    <div className="w-44 h-44 bg-ash border border-line flex items-center justify-center mx-auto">
                      <img src={config.UPI_QR_IMAGE} alt="UPI QR code" className="w-full h-full object-contain p-3" onError={(e) => (e.target.style.display = 'none')} />
                    </div>
                    <p className="text-xs text-steel normal-case mt-3">Scan with any UPI app — GPay, PhonePe, Paytm, etc.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="spec-tag text-steel mb-2">Pay to this UPI ID</p>
                    <div className="flex items-center justify-center gap-3">
                      <p className="font-mono text-bone text-lg">{config.UPI_ID}</p>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="spec-tag text-steel hover:text-bone border border-line px-3 py-1"
                      >
                        {upiCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-steel normal-case mt-3">
                      Open any UPI app, choose "Pay to UPI ID", paste this ID, and pay {config.CURRENCY_SYMBOL}{total}.
                    </p>
                  </div>
                )}

                <Field label="UPI Transaction / Reference ID" error={errors.upiTxnId}>
                  <input value={form.upiTxnId} onChange={update('upiTxnId')} className="input" placeholder="e.g. 123456789012" />
                </Field>

                <label className="flex items-start gap-3 text-sm text-steel normal-case">
                  <input
                    type="checkbox"
                    checked={upiConfirmed}
                    onChange={(e) => setUpiConfirmed(e.target.checked)}
                    className="mt-1"
                  />
                  I have completed the UPI payment of {config.CURRENCY_SYMBOL}{total} and entered the correct reference ID above.
                </label>
                {errors.upiConfirmed && <p className="text-signal spec-tag">{errors.upiConfirmed}</p>}

                <p className="spec-tag text-signal">
                  Your order will be confirmed after payment verification.
                </p>
                <p className="text-xs text-steel normal-case">
                  We will never ask you for your UPI PIN, card PIN, CVV, OTP or any password. Do not
                  share these with anyone claiming to be KLYVEN.
                </p>
              </div>
            )}
          </fieldset>

          {errors.submit && <p className="text-signal spec-tag">{errors.submit}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-depth w-full spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
          >
            {submitting ? 'Placing Order...' : `Place Order — ${config.CURRENCY_SYMBOL}${total}`}
          </button>
          <p className="text-xs text-steel normal-case text-center">
            🔒 Your information is encrypted in transit. We never ask for your card, UPI PIN, or OTP.
          </p>
        </form>

        {/* ORDER SUMMARY */}
        <div className="border border-line p-6 h-fit">
          <p className="spec-tag text-bone mb-5">Order Summary</p>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="text-steel">
                  {item.name} <span className="spec-tag">({item.size}/{item.color}) x{item.qty}</span>
                </span>
                <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="mb-5">
            {coupon ? (
              <div className="flex items-center justify-between border border-signal px-3 py-2">
                <span className="spec-tag text-signal">{coupon.code} applied</span>
                <button type="button" onClick={removeCoupon} className="spec-tag text-steel hover:text-bone">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={checkingCoupon || !couponInput.trim()}
                  className="spec-tag border border-line text-bone px-4 hover:border-bone disabled:opacity-50"
                >
                  {checkingCoupon ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {couponMessage && (
              <p className={`text-xs normal-case mt-2 ${coupon ? 'text-signal' : 'text-steel'}`}>{couponMessage}</p>
            )}
          </div>

          <div className="border-t border-line pt-4 space-y-2 spec-tag">
            <div className="flex justify-between text-steel">
              <span>Subtotal</span>
              <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{subtotal}</span>
            </div>
            <div className="flex justify-between text-steel">
              <span>Shipping</span>
              <span className="font-mono text-bone">{shipping === 0 ? 'Free' : `${config.CURRENCY_SYMBOL}${shipping}`}</span>
            </div>
            {codExtra > 0 && (
              <div className="flex justify-between text-steel">
                <span>COD Charge</span>
                <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{codExtra}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-signal">
                <span>Discount ({coupon.code})</span>
                <span className="font-mono">−{config.CURRENCY_SYMBOL}{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-bone pt-2 border-t border-line">
              <span>Total</span>
              <span className="font-mono">{config.CURRENCY_SYMBOL}{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="spec-tag text-steel block mb-1.5">{label}</span>
      {children}
      {error && <span className="text-signal text-xs normal-case block mt-1">{error}</span>}
    </label>
  );
}
