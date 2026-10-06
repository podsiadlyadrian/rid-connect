# RID Connect — panel B2B

Aplikacja React + TypeScript + Vite (panel ocen ISO / środowisko / BHP dla firm).

## Uruchomienie
```bash
npm install
npm run dev     # serwer deweloperski
npm run build   # tsc -b && vite build
npm run lint    # oxlint
```

## Architektura danych
Wszystkie dane przechodzą przez jedną warstwę: `src/data/DataProvider.tsx`
(kontekst + hook `useData()`). Obecnie jest to implementacja **in-memory**
(dane ulotne — odświeżenie resetuje stan). Komponenty nie trzymają już własnych
kopii danych.

### Podłączenie Supabase (następny krok)
To są celowo przygotowane „podwaliny" — backend nie jest jeszcze podłączony:
1. `npm i @supabase/supabase-js`
2. skopiuj `.env.example` → `.env` i uzupełnij `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
   (osobny, niezależny projekt Supabase)
3. odkomentuj klienta w `src/lib/supabase.ts`
4. dodaj `SupabaseDataProvider` implementujący `DataApi` i podmień provider w `src/main.tsx`

Realne logowanie/role oraz domena i hosting to kolejne, oddzielne kroki.

---

## React + TypeScript + Vite (szablon)

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
