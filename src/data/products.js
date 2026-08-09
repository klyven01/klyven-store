/**
 * PRODUCT CATALOG
 * ---------------------------------------------------------------
 * V1 keeps the catalog as a plain JS array so a beginner can add or
 * edit a product without touching a database. See README.md ->
 * "How to add a new T-shirt" for the full walkthrough.
 *
 * images.front / images.back are PLACEHOLDER paths. Drop your real
 * photos into /public/products/ and point these fields at them, e.g.
 * '/products/design-01-front.jpg'. Until then, ProductCard and the
 * product gallery render a generated placeholder block instead of a
 * broken image.
 * ---------------------------------------------------------------
 */

export const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

export const colors = [
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Bone White', hex: '#F3F2ED' },
  { name: 'Concrete Grey', hex: '#8A8D91' },
];

// PLACEHOLDER — replace with real, measured production values before launch.
export const sizeGuide = {
  unit: 'in',
  rows: [
    { size: 'S', chest: 42, length: 27, shoulder: 21, sleeve: 8.5 },
    { size: 'M', chest: 44, length: 28, shoulder: 22, sleeve: 9 },
    { size: 'L', chest: 46, length: 29, shoulder: 23, sleeve: 9.5 },
    { size: 'XL', chest: 48, length: 30, shoulder: 24, sleeve: 10 },
    { size: 'XXL', chest: 50, length: 31, shoulder: 25, sleeve: 10.5 },
  ],
};

export const products = [
  {
    id: 'drop-01-design-01',
    sku: 'KLV-D01-001',
    name: 'DROP 01 — DESIGN 01',
    price: 1799,
    compareAtPrice: 2199,
    description:
      'An oversized silhouette built for movement, not fit for it. Boxy through the shoulder, dropped at the cuff, cut long enough to layer.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
    colorsAvailable: ['Jet Black', 'Bone White'],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-02',
    sku: 'KLV-D01-002',
    name: 'DROP 01 — DESIGN 02',
    price: 1799,
    compareAtPrice: null,
    description:
      'Minimal front graphic, full-back statement print. Reinforced collar built to hold shape wash after wash.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
    colorsAvailable: ['Jet Black', 'Concrete Grey'],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-03',
    sku: 'KLV-D01-003',
    name: 'DROP 01 — DESIGN 03',
    price: 1999,
    compareAtPrice: 2399,
    description:
      'Heavyweight double-layered hem. A quieter piece from the drop — built for everyday rotation.',
    images: { front: null, back: null },
    sizesAvailable: ['M', 'L', 'XL', 'XXL'],
    colorsAvailable: ['Bone White', 'Concrete Grey'],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-04',
    sku: 'KLV-D01-004',
    name: 'DROP 01 — DESIGN 04',
    price: 1899,
    compareAtPrice: null,
    description:
      'Micro logo at the chest, coordinate print at the sleeve. The most understated cut in the drop.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL'],
    colorsAvailable: ['Jet Black'],
    inStock: false,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-05',
    sku: 'KLV-D01-005',
    name: 'DROP 01 — DESIGN 05',
    price: 2099,
    compareAtPrice: 2499,
    description:
      'The closer of DROP 01. Oversized fit, dropped shoulder, full graphic wraparound.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
    colorsAvailable: ['Jet Black', 'Bone White', 'Concrete Grey'],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
