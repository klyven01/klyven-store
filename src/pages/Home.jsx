import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import PlaceholderImage from '../components/PlaceholderImage';
import { products } from '../data/products';
import config from '../config';

const whyKlyven = [
  {
    code: '01',
    title: 'Built Heavy',
    body: '240 GSM combed cotton — cut to hold its shape through drops, not just through checkout.',
  },
  {
    code: '02',
    title: 'Small Batches',
    body: 'Every drop is limited. What sells out doesn\u2019t restock the same way twice.',
  },
  {
    code: '03',
    title: 'Made To Move',
    body: 'Oversized, unrestrictive, cut for a generation that doesn\u2019t sit still.',
  },
];

export default function Home() {
  const bestSellers = products.slice(0, 4);

  return (
    <div>
      <SEO
        title="KLYVEN — MOVE DIFFERENT."
        description="Premium futuristic oversized streetwear for Indian Gen-Z. Shop DROP 01 — limited run."
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 klyven-grid klyven-scan opacity-60" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-20 md:pt-36 md:pb-32">
          <p className="spec-tag text-signal mb-6 animate-fadeUp">KLV // COLLECTION.01 // IN.2026</p>
          <h1 className="font-display font-700 leading-[0.9] tracking-tight text-[15vw] md:text-[8.5vw] text-bone animate-fadeUp">
            KLYVEN
          </h1>
          <p className="font-display text-2xl md:text-4xl text-bone mt-3 animate-fadeUp">
            {config.TAGLINE}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-fadeUp">
            <Link
              to="/shop"
              className="spec-tag bg-bone text-void px-8 py-4 hover:bg-signal hover:text-white transition-colors"
            >
              Shop DROP 01
            </Link>
            <Link to="/about" className="spec-tag text-steel hover:text-bone px-2 py-4">
              Our Story →
            </Link>
          </div>
        </div>

        {/* Hero image/video placeholder — replace with a real editorial shot or video loop */}
        <div className="relative border-t border-line">
          <PlaceholderImage
            public/images/hero.png
            aspect="aspect-[16/7]"
          />
        </div>
      </section>

      {/* DROP 01 */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="spec-tag text-signal mb-2">Live Now</p>
            <h2 className="font-display text-3xl md:text-5xl text-bone">DROP 01</h2>
          </div>
          <Link to="/shop" className="hidden md:block spec-tag text-steel hover:text-bone">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <Link to="/shop" className="md:hidden mt-8 inline-block spec-tag text-steel hover:text-bone">
          View All →
        </Link>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-ash border-y border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <p className="spec-tag text-signal mb-2">Most Worn</p>
          <h2 className="font-display text-3xl md:text-5xl text-bone mb-10">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY KLYVEN */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <p className="spec-tag text-signal mb-2">Why KLYVEN</p>
        <h2 className="font-display text-3xl md:text-5xl text-bone mb-14 max-w-2xl">
          Streetwear built like spec sheets, not slogans.
        </h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {whyKlyven.map((item) => (
            <div key={item.code} className="border-t border-line pt-6">
              <p className="spec-tag text-steel mb-4">{item.code}</p>
              <h3 className="font-display text-xl text-bone mb-3">{item.title}</h3>
              <p className="text-steel text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="border-y border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <PlaceholderImage label="BRAND STORY VISUAL // REPLACE" aspect="aspect-[4/5]" />
          <div>
            <p className="spec-tag text-signal mb-4">The Story</p>
            <h2 className="font-display text-3xl md:text-4xl text-bone mb-6">
              KLYVEN wasn't designed to fit in.
            </h2>
            <p className="text-steel leading-relaxed mb-4">
              We started KLYVEN for a generation that treats fashion like an interface — direct,
              unbothered, built for how they actually move through the day. No noise, no
              over-designed logos. Just weight, fit, and intent.
            </p>
            <p className="text-steel leading-relaxed">
              Every drop is small on purpose. When it's gone, it's gone — and the next one moves
              different again.
            </p>
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative">
        <PlaceholderImage label="EDITORIAL CAMPAIGN // REPLACE" aspect="aspect-[21/9]" />
        <div className="absolute inset-0 flex items-end p-6 md:p-14">
          <h2 className="font-display text-3xl md:text-6xl text-bone max-w-3xl leading-[0.95]">
            Not everyone moves the same.
          </h2>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="spec-tag text-signal mb-2">@klyven</p>
            <h2 className="font-display text-2xl md:text-4xl text-bone">Follow The Drop</h2>
          </div>
          <a
            href={config.INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="spec-tag text-steel hover:text-bone"
          >
            Instagram →
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <PlaceholderImage key={i} label={`IG.0${i + 1}`} aspect="aspect-square" />
          ))}
        </div>
      </section>
    </div>
  );
}
