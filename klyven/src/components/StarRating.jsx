/**
 * Star rating — read-only display when `onChange` is omitted, interactive
 * input when provided.
 */
export default function StarRating({ value = 0, onChange, size = 'text-base' }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = Boolean(onChange);

  return (
    <div className={`flex gap-0.5 ${size}`} role={interactive ? 'radiogroup' : undefined} aria-label="Rating">
      {stars.map((s) => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange(s) : undefined}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${s <= value ? 'text-signal' : 'text-line'}`}
          aria-label={interactive ? `${s} star${s > 1 ? 's' : ''}` : undefined}
        >
          ★
        </button>
      ))}
    </div>
  );
}
