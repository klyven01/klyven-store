import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <SEO title="Page Not Found — KLYVEN" description="This page doesn't exist." />
      <p className="spec-tag text-signal mb-4">404 // NOT FOUND</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-8">This route doesn't exist.</h1>
      <Link to="/" className="spec-tag bg-bone text-void px-8 py-4 inline-block hover:bg-signal hover:text-white transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
