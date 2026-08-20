import SEO from '../components/SEO';
import PlaceholderImage from '../components/PlaceholderImage';
import config from '../config';

export default function About() {
  return (
    <div>
      <SEO title="About — KLYVEN" description="The story behind KLYVEN, premium futuristic streetwear for Indian Gen-Z." />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="spec-tag text-signal mb-2">About</p>
        <h1 className="font-display text-4xl md:text-6xl text-bone max-w-3xl leading-[0.95]">
          {config.TAGLINE}
        </h1>
      </section>

      <section className="border-y border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="spec-tag text-signal mb-4">Origin</p>
            <h2 className="font-display text-2xl md:text-3xl text-bone mb-6">
              Built for the ones who don't move with the crowd.
            </h2>
            <p className="text-steel leading-relaxed mb-4">
              {config.BRAND_NAME} started as a small, independent streetwear project — no big
              backing, no factory of our own, just a clear point of view on what oversized,
              premium fashion should feel like for young India in 2026.
            </p>
            <p className="text-steel leading-relaxed">
              We work print-on-demand for now, which means every drop is made to order and kept
              small on purpose. It's slower, but it means we only ever ship what we'd wear ourselves.
            </p>
          </div>
          <PlaceholderImage label="ABOUT VISUAL // REPLACE" aspect="aspect-[4/5]" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-3 gap-10">
        <div>
          <p className="spec-tag text-steel mb-3">01</p>
          <h3 className="font-display text-xl text-bone mb-3">The Fit</h3>
          <p className="text-steel text-sm leading-relaxed">
            Oversized, dropped shoulder, weighted fabric — designed to move with you, not against you.
          </p>
        </div>
        <div>
          <p className="spec-tag text-steel mb-3">02</p>
          <h3 className="font-display text-xl text-bone mb-3">The Process</h3>
          <p className="text-steel text-sm leading-relaxed">
            Every order is manually checked before it goes into production, so quality control
            happens before a single shirt is printed.
          </p>
        </div>
        <div>
          <p className="spec-tag text-steel mb-3">03</p>
          <h3 className="font-display text-xl text-bone mb-3">The Future</h3>
          <p className="text-steel text-sm leading-relaxed">
            As we grow, drops get bigger and turnaround gets faster — the standard doesn't change.
          </p>
        </div>
      </section>
    </div>
  );
}
