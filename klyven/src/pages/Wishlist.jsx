import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { ids } = useWishlist();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <SEO title="Wishlist — KLYVEN" description="Your saved KLYVEN products." />
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-10">Wishlist</h1>

      {items.length === 0 ? (
        <div>
          <p className="spec-tag text-steel mb-4">Nothing saved yet.</p>
          <Link to="/shop" className="spec-tag text-signal">Shop DROP 01 →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
