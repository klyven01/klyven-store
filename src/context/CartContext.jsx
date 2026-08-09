import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'klyven_cart_v1';

function lineKey(item) {
  return `${item.id}__${item.size}__${item.color}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, { size, color, qty = 1 }) => {
    setItems((prev) => {
      const candidate = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        size,
        color,
        qty,
      };
      const key = lineKey(candidate);
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, candidate];
    });
  };

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (lineKey(i) === lineKey(item) ? { ...i, qty } : i)));
  };

  const removeItem = (item) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== lineKey(item)));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = { items, addItem, updateQty, removeItem, clearCart, subtotal, count };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
