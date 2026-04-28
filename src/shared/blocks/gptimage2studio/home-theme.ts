export type Variant = 'A' | 'B';

export type HomePalette = {
  accent: string;
  accentSoft: string;
  accentRing: string;
  accentBg: string;
  badgeText: string;
  glow: string;
};

export const palettes: Record<Variant, HomePalette> = {
  A: {
    accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    accentSoft: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/20',
    accentRing: 'ring-emerald-400/40',
    accentBg: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    badgeText: 'text-emerald-300',
    glow: 'bg-emerald-500/20',
  },
  B: {
    accent: 'from-fuchsia-400 via-violet-500 to-indigo-500',
    accentSoft: 'from-fuchsia-500/20 via-violet-500/15 to-indigo-500/20',
    accentRing: 'ring-violet-400/40',
    accentBg: 'bg-violet-500 hover:bg-violet-400 text-white',
    badgeText: 'text-violet-300',
    glow: 'bg-violet-500/25',
  },
};
