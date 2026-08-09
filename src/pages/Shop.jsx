import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Shop() {
  const [filter, setFilter] = useState('all'); // all | in-stock | sale

  const visible = useMemo(() => {
    if (filter === 'in-stock') return products.filter((p) => p.inStock);
    if (filter === 'sale') return products.filter((p) => p.compareAtPrice);
    return products;
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <SEO
        title="Shop DROP 01 — KLYVEN"
        description="Shop the full DROP 01 collection from KLYVEN. Oversized premium streetwear, limited run."
      />

      <p className="spec-tag text-signal mb-2">Collection</p>
      <h1 className="font-display text-4xl md:text-6xl text-bone mb-10">DROP 01</h1>

      <div className="flex gap-3 mb-10 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'in-stock', label: 'In Stock' },
          { key: 'sale', label: 'On Sale' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`spec-tag px-4 py-2 border transition-colors ${
              filter === f.key
                ? 'bg-bone text-void border-bone'
                : 'border-line text-steel hover:text-bone hover:border-bone'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-steel spec-tag">No products match this filter.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
