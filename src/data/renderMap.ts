// NODO — Render image mapping
// Maps Shopify product handles to catalogue render letter + available color codes.
// Files live at /renders/{LETTER}-{COLOR}.webp

interface RenderEntry {
  letter: string;
  colors: string[];
}

export const RENDER_MAP: Record<string, RenderEntry> = {
  // Full-depth modules (MOD)
  'modulo-36-18':   { letter: 'A', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-36-24':   { letter: 'B', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-36-36':   { letter: 'C', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-36-72':   { letter: 'D', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-72-18':   { letter: 'E', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-72-24':   { letter: 'F', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-72-36':   { letter: 'G', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-72-72':   { letter: 'H', colors: ['BH', 'RO', 'VA', 'AF'] },
  // Half-depth modules (MODH)
  'modulo-h-36-18': { letter: 'I', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-h-36-24': { letter: 'J', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-h-36-36': { letter: 'K', colors: ['BH', 'RO', 'VA', 'AF'] },
  'modulo-h-72-24': { letter: 'L', colors: ['BH', 'RO', 'VA', 'AF'] },
  // Clip (uses Latón/Acero codes instead of standard palette)
  'clip-decorativo-laton': { letter: 'M', colors: ['BR', 'BS'] },
  // Bases (PLT)
  'base-36-36':     { letter: 'N', colors: ['BH', 'RO', 'VA', 'AF'] },
  'base-72-36':     { letter: 'O', colors: ['BH', 'RO', 'VA', 'AF'] },
};

// Maps colour names (from Shopify) to render colour codes
const COLOR_NAME_TO_CODE: Record<string, string> = {
  'Blanco Hueso':  'BH',
  'Roble Natural': 'RO',
  'Verde Agave':   'VA',
  'Azul Fes':      'AF',
  'Latón':         'BR',
  'Acero cepillado': 'BS',
};

/** Returns the URL for a specific handle + colour name, or null if not found. */
export function getRenderUrl(handle: string, colorName: string): string | null {
  const entry = RENDER_MAP[handle];
  if (!entry) return null;
  const code = COLOR_NAME_TO_CODE[colorName];
  if (!code || !entry.colors.includes(code)) return null;
  return `/renders/${entry.letter}-${code}.webp`;
}

/** Returns the URL for the default colour of a product (first in its colors array). */
export function getDefaultRenderUrl(handle: string): string | null {
  const entry = RENDER_MAP[handle];
  if (!entry || entry.colors.length === 0) return null;
  return `/renders/${entry.letter}-${entry.colors[0]}.webp`;
}

/** Returns the render URL for a specific handle + colour code (BH, RO, VA, AF, BR, BS). */
export function getRenderUrlByCode(handle: string, colorCode: string): string | null {
  const entry = RENDER_MAP[handle];
  if (!entry || !entry.colors.includes(colorCode)) return null;
  return `/renders/${entry.letter}-${colorCode}.webp`;
}
