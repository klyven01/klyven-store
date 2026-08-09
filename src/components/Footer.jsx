import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';
import config from '../config';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <Newsletter />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 spec-tag text-steel">
          <div>
            <p className="text-bone mb-3">{config.BRAND_NAME}</p>
            <p className="normal-case tracking-normal text-sm leading-relaxed">
              {config.TAGLINE}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-bone mb-1">Shop</p>
            <Link to="/shop" className="hover:text-bone">All Products</Link>
            <Link to="/track-order" className="hover:text-bone">Track Order</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-bone mb-1">Policies</p>
            <Link to="/shipping-policy" className="hover:text-bone">Shipping</Link>
            <Link to="/returns-policy" className="hover:text-bone">Returns &amp; Refunds</Link>
            <Link to="/privacy-policy" className="hover:text-bone">Privacy</Link>
            <Link to="/terms" className="hover:text-bone">Terms</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-bone mb-1">Contact</p>
            <a href={`mailto:${config.SUPPORT_EMAIL}`} className="hover:text-bone break-all">
              {config.SUPPORT_EMAIL}
            </a>
            <a href={`tel:${config.SUPPORT_PHONE}`} className="hover:text-bone">
              {config.SUPPORT_PHONE}
            </a>
            <a href={config.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-bone">
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line spec-tag text-steel text-[0.6rem]">
          © {new Date().getFullYear()} {config.BRAND_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
