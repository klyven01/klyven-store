import { sizeGuide } from '../data/products';

export default function SizeGuideModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-void/90 flex items-center justify-center p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-ash border border-line max-w-2xl w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl">Size Guide — Oversized Tee</h2>
          <button onClick={onClose} className="spec-tag text-steel hover:text-bone" aria-label="Close size guide">
            CLOSE
          </button>
        </div>

        <p className="spec-tag text-signal mb-4">
          Placeholder measurements — replace with final production values.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left spec-tag">
            <thead>
              <tr className="border-b border-line text-steel">
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Chest ({sizeGuide.unit})</th>
                <th className="py-2 pr-4">Length ({sizeGuide.unit})</th>
                <th className="py-2 pr-4">Shoulder ({sizeGuide.unit})</th>
                <th className="py-2 pr-4">Sleeve ({sizeGuide.unit})</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.rows.map((row) => (
                <tr key={row.size} className="border-b border-line/50 text-bone">
                  <td className="py-2 pr-4">{row.size}</td>
                  <td className="py-2 pr-4">{row.chest}</td>
                  <td className="py-2 pr-4">{row.length}</td>
                  <td className="py-2 pr-4">{row.shoulder}</td>
                  <td className="py-2 pr-4">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-steel mt-6 normal-case">
          Measured flat, in inches. All measurements have a natural tolerance of ±0.5in due to
          fabric and cutting. Edit these values in <code className="font-mono">src/data/products.js</code>.
        </p>
      </div>
    </div>
  );
}
