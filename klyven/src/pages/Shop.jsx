import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { products, sizes } from '../data/products';

const categories = [...new Set(products.map((p) => p.category))];

export default function Shop() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const visible = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (size !== 'all') list = list.filter((p) => p.sizesAvailable.includes(size));

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.reverse();

    return list;
  }, [query, category, size, sort]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <SEO
        title="Shop DROP 01 — KLYVEN"
        description="Shop the full DROP 01 collection from KLYVEN. Oversized premium streetwear, limited run."
      />

      <p className="spec-tag text-signal mb-2">Collection</p>
      <h1 className="font-display text-4xl md:text-6xl text-bone mb-10">DROP 01</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="input md:max-w-xs"
        />
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="md:hidden spec-tag border border-line px-4 py-3 text-bone"
        >
          {showFilters ? 'Hide Filters' : 'Filters & Sort'}
        </button>
      </div>

      <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-4 mb-10 items-center`}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={size} onChange={(e) => setSize(e.target.value)} className="input w-auto">
          <option value="all">All Sizes</option>
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="text-steel spec-tag">No products match your search/filters.</p>
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
