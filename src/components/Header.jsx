import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import config from '../config';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-700 text-xl tracking-widest2 text-bone">
          {config.BRAND_NAME}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `spec-tag transition-colors ${isActive ? 'text-bone' : 'text-steel hover:text-bone'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative spec-tag text-bone flex items-center gap-2">
            CART
            <span className="inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 bg-signal text-white text-[0.65rem] rounded-full">
              {count}
            </span>
          </Link>
          <button
            className="md:hidden text-bone spec-tag border border-line px-2 py-1"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line px-5 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="spec-tag text-steel hover:text-bone"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
