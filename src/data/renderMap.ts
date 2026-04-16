export const RENDER_LETTER: Record<string, string> = {
  'modulo-36-18': 'A',
  'modulo-36-24': 'B',
  'modulo-36-36': 'C',
  'modulo-36-72': 'D',
  'modulo-72-18': 'E',
  'modulo-72-24': 'F',
  'modulo-72-36': 'G',
  'modulo-72-72': 'H',
  'modulo-h-36-18': 'I',
  'modulo-h-36-24': 'J',
  'modulo-h-36-36': 'K',
  'modulo-h-72-24': 'L',
  'clf-std': 'M',
  'base-36-36': 'N',
  'base-72-36': 'O',
};

export const COLOR_TO_CODE: Record<string, string> = {
  'Blanco Hueso': 'BH',
  'Roble Natural': 'RO',
  'Verde Agave': 'VA',
  'Azul Fes': 'AF',
};

export const CLIP_COLOR_TO_CODE: Record<string, string> = {
  'Bronce': 'BR',
  'Brass': 'BR',
  'Latón': 'BR',
  'Acero cepillado': 'BS',
  'Acero Cepillado': 'BS',
  'Brushed Steel': 'BS',
  'Acero': 'BS',
};

export function getRenderUrl(handle: string, colorCode: string): string | null {
  const letter = RENDER_LETTER[handle];
  if (!letter) return null;
  return `/renders/${letter}-${colorCode}.webp`;
}
