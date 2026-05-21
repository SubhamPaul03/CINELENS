export const PRESETS = [
  { label: 'Cinema', bg: 'linear-gradient(135deg, #0a0908 0%, #2c1810 40%, #8b4513 100%)' },
  { label: 'Night',  bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a4a 50%, #2a2a8a 100%)' },
  { label: 'Sunset', bg: 'linear-gradient(135deg, #1a0a00 0%, #8b2500 40%, #ff6b35 100%)' },
  { label: 'Forest', bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a4a1a 50%, #2d8a3e 100%)' },
  { label: 'Mono',   bg: 'linear-gradient(135deg, #0a0908 0%, #555 50%, #aaa 100%)' },
  { label: 'Dusk',   bg: 'linear-gradient(135deg, #0d0515 0%, #4a1a6a 50%, #c472b0 100%)' },
  { label: 'Ice',    bg: 'linear-gradient(135deg, #0a1520 0%, #1a4a6a 50%, #6ab0d5 100%)' },
  { label: 'Amber',  bg: 'linear-gradient(135deg, #1a0f00 0%, #6a3d00 50%, #d4a017 100%)' },
];

export const EMOJIS = [
  '👦', '👧', '👨', '👩', '🧑', '👴', '👵', '🧔', '👱',
  '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨',
  '👨‍💻', '👩‍💻', '👨‍🎬', '👩‍🎬', '🧙', '🧛', '🧜', '🧝', '🦸', '🦹',
];

export const ALGO_DATA = [
  {
    id: 'collab',
    icon: '🤝',
    name: 'Collaborative Filtering',
    hint: 'Pearson correlation on shared ratings across viewers.',
    explain: '<strong>Collaborative Filtering</strong> — Finds viewers with similar taste using <strong>Pearson correlation</strong> on shared ratings, then predicts your score as a similarity-weighted average.',
    chipLabel: 'COLLAB',
  },
  {
    id: 'content',
    icon: '🎬',
    name: 'Content-Based Filtering',
    hint: 'Matches films to your tag & genre preference profile.',
    explain: '<strong>Content-Based Filtering</strong> — Builds a personalised tag & genre profile from your rated films, then ranks unseen films by attribute similarity.',
    chipLabel: 'CONTENT',
  },
  {
    id: 'hybrid',
    icon: '⚗️',
    name: 'Hybrid Blend (55/45)',
    hint: 'Combines both signals, normalised before blending.',
    explain: '<strong>Hybrid Blend</strong> — Combines both signals: <strong>55% collaborative</strong> (user similarity) + <strong>45% content-based</strong> (film attributes), each normalised.',
    chipLabel: 'HYBRID',
  },
];
