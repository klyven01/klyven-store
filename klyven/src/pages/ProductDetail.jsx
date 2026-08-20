import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PlaceholderImage from '../components/PlaceholderImage';
import SizeGuideModal from '../components/SizeGuideModal';
import StarRating from '../components/StarRating';
import { getProductById, sizes } from '../data/products';
import { useCart } from '../context/CartContext';
import { getReviews, submitReview, summarizeReviews } from '../lib/reviews';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import config from '../config';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, closeDrawer } = useCart();
  const product = getProductById(id);

  const [activeImage, setActiveImage] = useState('front');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' });
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    if (product) getReviews(product.id).then(setReviews);
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const result = await submitReview({
      productId: product.id,
      customerName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
    setReviewStatus(result.message);
    if (result.success) {
      setReviewForm({ name: '', rating: 0, comment: '' });
      getReviews(product.id).then(setReviews);
    }
  };

  const { average, count } = summarizeReviews(reviews);

  // If the product defines per-colour photos (product.colorImages), use
  // the pair matching the currently selected colour; otherwise fall back
  // to the product's default images.front/back.
  const currentImages =
    (product?.colorImages && color && product.colorImages[color]) || product?.images || {};

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
    closeDrawer();
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
            src={currentImages[activeImage]}
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
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c.name ? 'border-signal scale-110' : 'border-line'
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
              className="btn-depth flex-1 spec-tag bg-bone text-void px-6 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-40"
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

      {/* REVIEWS */}
      <section className="mt-16 md:mt-24 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl text-bone">Reviews</h2>
          {count > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(average)} />
              <span className="spec-tag text-steel">{average} ({count})</span>
            </div>
          )}
        </div>

        {!isSupabaseConfigured ? (
          <p className="spec-tag text-steel">Reviews aren't available yet.</p>
        ) : (
          <>
            {reviews.length === 0 ? (
              <p className="spec-tag text-steel mb-8">No reviews yet — be the first.</p>
            ) : (
              <div className="space-y-6 mb-10 border-t border-line pt-6">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-line pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="spec-tag text-bone">{r.customer_name}</p>
                      <StarRating value={r.rating} size="text-sm" />
                    </div>
                    {r.comment && <p className="text-steel text-sm leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 border border-line p-6">
              <p className="spec-tag text-bone mb-2">Write a Review</p>
              <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm((f) => ({ ...f, rating: v }))} size="text-2xl" />
              <input
                required
                placeholder="Your name"
                value={reviewForm.name}
                onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                className="input"
              />
              <textarea
                placeholder="Share your thoughts (optional)"
                rows={3}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                className="input"
              />
              {reviewStatus && <p className="text-signal spec-tag normal-case text-sm">{reviewStatus}</p>}
              <button type="submit" className="spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white transition-colors">
                Submit Review
              </button>
            </form>
          </>
        )}
      </section>
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
