// src/utils/ratingHelpers.ts
import type { RatingScores } from '../types';

export function calculateOverallScore(rating: RatingScores): number {
  if (!rating) return 0;
  return Math.round((rating.env + rating.quality + rating.bhp + rating.infosec) / 4);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--accent-green)'; // Lider
  if (score >= 50) return '#f59e0b'; // Średniak
  return '#ef4444'; // Wymaga poprawy
}

/** Słowny status klasy liczony z wyniku zbiorczego (zamiast hardkodu). */
export function getScoreClass(score: number): string {
  if (score >= 80) return 'Klasa A (Lider regionalny)';
  if (score >= 50) return 'Klasa B (Stabilny poziom)';
  if (score > 0) return 'Klasa C (Wymaga poprawy)';
  return 'Brak oceny';
}
