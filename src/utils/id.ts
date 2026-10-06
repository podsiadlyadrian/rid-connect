// Generator identyfikatorów dla treści tworzonej w aplikacji.
// Używa crypto.randomUUID() (gotowe pod klucze z bazy); ma fallback dla starszych środowisk.
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
