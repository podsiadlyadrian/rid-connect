// src/utils/ratingHelpers.ts

export function calculateOverallScore(rating: { env: number; quality: number; bhp: number; infosec: number }) {
  if (!rating) return 0;
  return Math.round((rating.env + rating.quality + rating.bhp + rating.infosec) / 4);
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'var(--accent-green)'; // Lider
  if (score >= 50) return '#f59e0b'; // Średniak
  return '#ef4444'; // Wymaga poprawy
}