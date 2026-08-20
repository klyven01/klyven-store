import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PlaceholderImage from './PlaceholderImage';
import { useWishlist } from '../context/WishlistContext';
import config from '../config';

export default function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const reduce = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -8, ry: px * 8 });
  };

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry, y: tilt.rx !== 0 || tilt.ry !== 0 ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
        className="relative overflow-hidden bg-ash"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-void/70 border border-line hover:border-bone"
        >
          <span className={wishlisted ? 'text-signal' : 'text-bone'}>{wishlisted ? '♥' : '♡'}</span>
        </button>
        <PlaceholderImage
          src={product.images.front}
          alt={product.name}
          label={product.sku}
          className="transition-opacity duration-300 group-hover:opacity-0"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlaceholderImage
            src={product.images.back}
            alt={`${product.name} back`}
            label="BACK // REPLACE"
          />
        </div>
        {!product.inStock && (
          <span className="absolute top-3 left-3 spec-tag bg-void/90 text-bone px-2 py-1 border border-line">
            Sold Out
          </span>
        )}
        {product.compareAtPrice && product.inStock && (
          <span className="absolute top-3 left-3 spec-tag bg-signal text-white px-2 py-1">
            Sale
          </span>
        )}
      </motion.div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm md:text-base text-bone">{product.name}</h3>
          <p className="spec-tag text-steel mt-1">{product.sku}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm text-bone">
            {config.CURRENCY_SYMBOL}{product.price}
          </p>
          {product.compareAtPrice && (
            <p className="font-mono text-xs text-steel line-through">
              {config.CURRENCY_SYMBOL}{product.compareAtPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
