/**
 * Renders the real image if `src` is provided, otherwise a generated
 * placeholder block with a spec-tag label so it's obvious in the UI
 * that this is a stand-in, not a bug.
 */
export default function PlaceholderImage({ src, alt, label, className = '', aspect = 'aspect-[4/5]' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${aspect} w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`klyven-placeholder ${aspect} w-full flex items-end p-4 ${className}`}>
      <span className="spec-tag text-steel border border-line px-2 py-1">
        {label || 'IMG // REPLACE'}
      </span>
    </div>
  );
}
