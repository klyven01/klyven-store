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
 *
 * COLOURS: each product has its own `colors` array — add or remove as
 * many as that specific product actually comes in, e.g.:
 *   colors: [
 *     { name: 'Jet Black', hex: '#0A0A0A' },
 *     { name: 'Olive', hex: '#5C5A3E' },
 *   ]
 * `hex` is the colour code shown as a swatch — search "hex color picker"
 * online to find the code for any colour you want.
 *
 * PER-COLOUR PHOTOS (optional): if you have separate front/back photos for
 * each colour, add a `colorImages` object keyed by the exact colour name —
 * the product page automatically swaps photos when the shopper picks a
 * colour. Products without `colorImages` just show the default
 * `images.front` / `images.back` regardless of colour.
 * ---------------------------------------------------------------
 */

export const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];

// Kept as a starter palette you can pick from — but every product now
// defines its OWN colours directly (see `colors` field on each product
// below), so you're never limited to this list. Add/remove freely.
export const colorPalette = [
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Bone White', hex: '#F3F2ED' },
  { name: 'Concrete Grey', hex: '#8A8D91' },
  { name: 'Signal Blue', hex: '#3B5BFF' },
  { name: 'Olive', hex: '#5C5A3E' },
  { name: 'Rust', hex: '#B4502A' },
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
    { size: 'XXXL', chest: 52, length: 32, shoulder: 26, sleeve: 11 },
    { size: 'XXXXL', chest: 54, length: 33, shoulder: 27, sleeve: 11.5 },
  ],
};

export const products = [
  {
    id: 'drop-01-design-01',
    sku: 'KLV-D01-001',
    category: 'tshirts',
    name: 'DROP 01 — DESIGN 01',
    price: 1799,
    compareAtPrice: 2199,
    description:
      'An oversized silhouette built for movement, not fit for it. Boxy through the shoulder, dropped at the cuff, cut long enough to layer.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'],
    colors: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Bone White', hex: '#F3F2ED' },
    ],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-02',
    sku: 'KLV-D01-002',
    category: 'tshirts',
    name: 'DROP 01 — DESIGN 02',
    price: 1799,
    compareAtPrice: null,
    description:
      'Minimal front graphic, full-back statement print. Reinforced collar built to hold shape wash after wash.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'],
    colors: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Concrete Grey', hex: '#8A8D91' },
    ],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-03',
    sku: 'KLV-D01-003',
    category: 'tshirts',
    name: 'DROP 01 — DESIGN 03',
    price: 1999,
    compareAtPrice: 2399,
    description:
      'Heavyweight double-layered hem. A quieter piece from the drop — built for everyday rotation.',
    images: { front: null, back: null },
    sizesAvailable: ['M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'],
    colors: [
      { name: 'Bone White', hex: '#F3F2ED' },
      { name: 'Concrete Grey', hex: '#8A8D91' },
    ],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-04',
    sku: 'KLV-D01-004',
    category: 'tshirts',
    name: 'DROP 01 — DESIGN 04',
    price: 1899,
    compareAtPrice: null,
    description:
      'Micro logo at the chest, coordinate print at the sleeve. The most understated cut in the drop.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Jet Black', hex: '#0A0A0A' }],
    inStock: false,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'drop-01-design-05',
    sku: 'KLV-D01-005',
    category: 'tshirts',
    name: 'DROP 01 — DESIGN 05',
    price: 2099,
    compareAtPrice: 2499,
    description:
      'The closer of DROP 01. Oversized fit, dropped shoulder, full graphic wraparound.',
    images: { front: null, back: null },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'],
    colors: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Bone White', hex: '#F3F2ED' },
      { name: 'Concrete Grey', hex: '#8A8D91' },
    ],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton. Enzyme-washed for a soft, broken-in hand-feel from the first wear.',
    fit: 'Oversized fit. Model is 6\'0" wearing size L. Size down for a less relaxed drape.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
  {
    id: 'design-001',
    sku: 'KLV-001',
    category: 'tshirts',
    name: 'DESIGN 001',
    price: 1799,
    compareAtPrice: null,
    description: 'Replace this with your real product description.',
    // Default photos (used if colorImages doesn't have the selected colour)
    images: { front: '/products/design001frontblack.jpg.png', back: '/products/design001backblack.jpg' },
    // Separate photos per colour — the product page swaps automatically
    // when a shopper picks a colour.
    colorImages: {
      'Jet Black': { front: '/products/design001frontblack.jpg.png', back: '/products/design001backblack.jpg' },
      'Bone White': { front: '/products/design001frontwhite.jpg.png', back: '/products/design001backwhite.jpg' },
    },
    sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'],
    colors: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Bone White', hex: '#F3F2ED' },
    ],
    inStock: true,
    fabric: '240 GSM heavyweight combed cotton.',
    fit: 'Oversized fit.',
    care: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Do not iron over print.',
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
