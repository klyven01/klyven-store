import { Link } from 'react-router-dom';
import PlaceholderImage from './PlaceholderImage';
import config from '../config';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-ash">
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
      </div>
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
