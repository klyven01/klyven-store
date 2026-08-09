import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PlaceholderImage from '../components/PlaceholderImage';
import SizeGuideModal from '../components/SizeGuideModal';
import { getProductById, colors, sizes } from '../data/products';
import { useCart } from '../context/CartContext';
import config from '../config';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProductById(id);

  const [activeImage, setActiveImage] = useState('front');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="spec-tag text-steel">Product not found.</p>
        <Link to="/shop" className="spec-tag text-signal mt-4 inline-block">
          Back to Shop →
        </Link>
      </div>
    );
  }

  const validate = () => {
    if (!size) return 'Please select a size.';
    if (!color) return 'Please select a colour.';
    if (!product.inStock) return 'This item is currently sold out.';
    return '';
  };

  const handleAddToCart = () => {
    const err = validate();
    if (err) return setError(err);
    setError('');
    addItem(product, { size, color, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const err = validate();
    if (err) return setError(err);
    setError('');
    addItem(product, { size, color, qty });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <SEO
        title={`${product.name} — KLYVEN`}
        description={product.description}
      />

      <nav className="spec-tag text-steel mb-8">
        <Link to="/shop" className="hover:text-bone">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* GALLERY */}
        <div>
          <PlaceholderImage
            src={product.images[activeImage]}
            alt={product.name}
            label={activeImage === 'front' ? 'FRONT // REPLACE' : 'BACK // REPLACE'}
            aspect="aspect-[4/5]"
          />
          <div className="flex gap-3 mt-4">
            {['front', 'back'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveImage(view)}
                className={`spec-tag px-4 py-2 border ${
                  activeImage === view ? 'border-bone text-bone' : 'border-line text-steel'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <p className="spec-tag text-steel mb-2">{product.sku}</p>
          <h1 className="font-display text-3xl md:text-4xl text-bone mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xl text-bone">
              {config.CURRENCY_SYMBOL}{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono text-base text-steel line-through">
                {config.CURRENCY_SYMBOL}{product.compareAtPrice}
              </span>
            )}
            {!product.inStock && (
              <span className="spec-tag text-signal">Sold Out</span>
            )}
          </div>

          <p className="text-steel leading-relaxed mb-8">{product.description}</p>

          {/* Colour */}
          <div className="mb-6">
            <p className="spec-tag text-bone mb-3">Colour {color && `— ${color}`}</p>
            <div className="flex gap-3">
              {colors
                .filter((c) => product.colorsAvailable.includes(c.name))
                .map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 ${
                      color === c.name ? 'border-signal' : 'border-line'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="spec-tag text-bone">Size {size && `— ${size}`}</p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="spec-tag text-steel hover:text-bone underline underline-offset-4"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const available = product.sizesAvailable.includes(s);
                return (
                  <button
                    key={s}
                    disabled={!available}
                    onClick={() => setSize(s)}
                    className={`spec-tag px-4 py-2 border transition-colors ${
                      size === s
                        ? 'bg-bone text-void border-bone'
                        : available
                        ? 'border-line text-bone hover:border-bone'
                        : 'border-line text-line line-through cursor-not-allowed'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="spec-tag text-bone mb-3">Quantity</p>
            <div className="inline-flex items-center border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 text-bone hover:bg-ash"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 text-center font-mono text-bone">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-10 h-10 text-bone hover:bg-ash"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="text-signal spec-tag mb-4">{error}</p>}
          {added && <p className="text-signal spec-tag mb-4">Added to cart.</p>}

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 spec-tag border border-bone text-bone px-6 py-4 hover:bg-ash transition-colors disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          {/* Info accordions */}
          <div className="border-t border-line divide-y divide-line">
            <Detail label="Fabric" value={product.fabric} />
            <Detail label="Fit" value={product.fit} />
            <Detail label="Wash & Care" value={product.care} />
            <Detail
              label="Shipping"
              value={`Dispatched in 2–4 business days. Free shipping above ${config.CURRENCY_SYMBOL}${config.FREE_SHIPPING_THRESHOLD}, otherwise a flat ${config.CURRENCY_SYMBOL}${config.SHIPPING_CHARGE}. See our Shipping Policy for full details.`}
            />
            <Detail
              label="Returns"
              value="Size exchanges and returns accepted within the window in our Returns Policy, provided the item is unworn with tags attached."
            />
          </div>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <details className="py-4 group">
      <summary className="spec-tag text-bone cursor-pointer flex items-center justify-between">
        {label}
        <span className="text-steel group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="text-steel text-sm leading-relaxed mt-3 normal-case">{value}</p>
    </details>
  );
}
