export const CANONICAL_CATEGORIES = ['Geral', 'Vídeos', 'Flyers', 'Leds'];

export function normalizeCategory(input?: string | null) {
  // Always return one of the canonical categories. If no good match, default to 'Geral'.
  if (!input) return 'Geral';
  const v = String(input).trim().toLowerCase();
  if (!v) return 'Geral';

  const videos = ['video', 'videos', 'vídeo', 'vídeos', 'video(s)'];
  const flyers = ['flyer', 'flyers', 'flayer', 'flayers'];
  const leds = ['led', 'leds', 'l.e.d', 'l e d', 'l e d s'];
  const geral = ['geral', 'general', 'generalidades'];

  if (videos.includes(v)) return 'Vídeos';
  if (flyers.includes(v)) return 'Flyers';
  if (leds.includes(v)) return 'Leds';
  if (geral.includes(v)) return 'Geral';

  // match canonical exactly
  const match = CANONICAL_CATEGORIES.find((c) => c.toLowerCase() === v);
  if (match) return match;

  // fallback: default to 'Geral'
  return 'Geral';
}

export default normalizeCategory;
