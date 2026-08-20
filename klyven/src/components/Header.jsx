import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import config from '../config';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { count, openDrawer } = useCart();
  const { user, enabled } = useAuth();
  const { ids } = useWishlist();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.4)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        borderColor: scrolled ? 'rgba(42,42,42,1)' : 'rgba(42,42,42,0)',
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b"
    >
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
          {enabled && (
            <Link to={user ? '/account' : '/login'} className="hidden sm:block spec-tag text-steel hover:text-bone">
              {user ? 'Account' : 'Login'}
            </Link>
          )}
          <Link to="/wishlist" className="relative hidden sm:flex spec-tag text-bone items-center gap-2">
            ♡
            {ids.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 bg-signal text-white text-[0.65rem] rounded-full">
                {ids.length}
              </span>
            )}
          </Link>
          <button onClick={openDrawer} className="relative spec-tag text-bone flex items-center gap-2">
            CART
            <span className="inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 bg-signal text-white text-[0.65rem] rounded-full">
              {count}
            </span>
          </button>
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
          {enabled && (
            <NavLink to={user ? '/account' : '/login'} onClick={() => setOpen(false)} className="spec-tag text-steel hover:text-bone">
              {user ? 'Account' : 'Login'}
            </NavLink>
          )}
        </nav>
      )}
    </motion.header>
  );
}
