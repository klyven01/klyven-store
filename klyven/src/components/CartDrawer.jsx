import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import config from '../config';

export default function CartDrawer() {
  const { items, updateQty, removeItem, subtotal, drawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-void/70"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-ash border-l border-line flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <p className="spec-tag text-bone">Cart</p>
              <button onClick={closeDrawer} aria-label="Close cart" className="spec-tag text-steel hover:text-bone">
                CLOSE
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
                <p className="spec-tag text-steel">Your cart is empty.</p>
                <Link
                  to="/shop"
                  onClick={closeDrawer}
                  className="spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white transition-colors"
                >
                  Shop DROP 01
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-line px-5">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="py-4">
                      <p className="text-sm text-bone">{item.name}</p>
                      <p className="spec-tag text-steel mt-1 mb-3">{item.size} / {item.color}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() => updateQty(item, item.qty - 1)}
                            className="w-7 h-7 text-bone hover:bg-void"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-mono text-bone text-xs">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item, item.qty + 1)}
                            className="w-7 h-7 text-bone hover:bg-void"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-bone">
                            {config.CURRENCY_SYMBOL}{item.price * item.qty}
                          </span>
                          <button
                            onClick={() => removeItem(item)}
                            className="spec-tag text-steel hover:text-signal"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line p-5 space-y-4">
                  <div className="flex justify-between spec-tag text-bone">
                    <span>Subtotal</span>
                    <span className="font-mono">{config.CURRENCY_SYMBOL}{subtotal}</span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="block text-center spec-tag border border-bone text-bone px-6 py-3 hover:bg-void transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className="block text-center spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
