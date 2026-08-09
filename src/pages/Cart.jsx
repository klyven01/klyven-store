import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import config from '../config';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <SEO title="Your Cart — KLYVEN" description="Review items in your KLYVEN cart." />
        <p className="spec-tag text-steel mb-4">Your cart is empty.</p>
        <Link to="/shop" className="spec-tag bg-bone text-void px-8 py-4 inline-block hover:bg-signal hover:text-white transition-colors">
          Shop DROP 01
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <SEO title="Your Cart — KLYVEN" description="Review items in your KLYVEN cart." />
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Cart</h1>

      <div className="divide-y divide-line border-t border-b border-line">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
          >
            <div className="flex-1">
              <p className="font-display text-lg text-bone">{item.name}</p>
              <p className="spec-tag text-steel mt-1">
                {item.size} / {item.color} / {item.sku}
              </p>
            </div>

            <div className="flex items-center border border-line w-fit">
              <button
                onClick={() => updateQty(item, item.qty - 1)}
                className="w-9 h-9 text-bone hover:bg-ash"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-mono text-bone text-sm">{item.qty}</span>
              <button
                onClick={() => updateQty(item, item.qty + 1)}
                className="w-9 h-9 text-bone hover:bg-ash"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="font-mono text-bone w-24 text-right">
              {config.CURRENCY_SYMBOL}{item.price * item.qty}
            </p>

            <button
              onClick={() => removeItem(item)}
              className="spec-tag text-steel hover:text-signal"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-2">
        <div className="flex justify-between w-full max-w-xs spec-tag text-steel">
          <span>Subtotal</span>
          <span className="font-mono text-bone">{config.CURRENCY_SYMBOL}{subtotal}</span>
        </div>
        <p className="text-xs text-steel normal-case max-w-xs text-right">
          Shipping and total calculated at checkout.
        </p>
        <Link
          to="/checkout"
          className="mt-4 spec-tag bg-bone text-void px-8 py-4 hover:bg-signal hover:text-white transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
