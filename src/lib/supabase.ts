// =============================================================================
// PODWALINY POD SUPABASE — na razie NIC nie jest podłączone.
// =============================================================================
// To jest wyłącznie punkt wpięcia na przyszłość. Nie importujemy jeszcze
// @supabase/supabase-js i nie łączymy się z żadnym projektem.
//
// Gdy przyjdzie czas (osobny, niezależny projekt Supabase — NIE współdzielony
// z werboSENS ani innymi projektami):
//   1. npm i @supabase/supabase-js
//   2. uzupełnij .env (patrz .env.example):
//        VITE_SUPABASE_URL=...
//        VITE_SUPABASE_ANON_KEY=...
//   3. odkomentuj klienta poniżej
//   4. dodaj SupabaseDataProvider implementujący DataApi (src/data/DataProvider.tsx)
//      i podmień InMemoryDataProvider w src/main.tsx.
//
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY,
// );

export const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Czy skonfigurowano zmienne środowiskowe Supabase (do użycia, gdy wepniemy backend). */
export const isSupabaseConfigured: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
