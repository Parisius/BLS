# BLS — v2 (rewrite pilot)

A from-scratch rebuild of the BLS legal/governance platform on a modern
Next.js stack, same visual design as the original app. This is a **pilot**
covering the Administration module end-to-end (auth, dashboard shell, Users,
Roles, Subsidiaries) to validate the architecture before porting the
remaining 18 modules.

## Why this exists

The original app (`../`) is a Next.js 14 / Pages-era-style App Router
project where every one of ~50 backend resources has its own hand-written
`requests.ts` (manual `fetch` + field-by-field snake_case↔camelCase mapping)
and `dtos.ts`. It works, but:

- there's no compile-time link between what the frontend sends/expects and
  what the backend actually accepts — a renamed backend field fails silently
  at runtime, caught (or not) by a try/catch that returns `null`.
- ~50 near-identical hand-rolled request files is a lot of surface area for
  one typo to hide in.

This rewrite replaces all of that with **one generated, fully-typed API
client**, backed by [`openapi.json`](../openapi.json) — an OpenAPI 3.0 spec
reverse-engineered from the original app's `services/api-sdk` (see the repo
root for how). One command regenerates it:

```bash
pnpm gen:api
```

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16, App Router | `middleware.ts` is renamed `proxy.ts` in this version — see `src/proxy.ts` |
| UI | Tailwind CSS v4 + shadcn/ui | shadcn now ships on **Base UI** (Radix's successor), not Radix — components use a `render` prop instead of `asChild` |
| Data fetching | [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) + [`openapi-typescript`](https://openapi-ts.dev/) | `src/lib/api/client.ts` + generated `src/lib/api/schema.d.ts` |
| Server state | TanStack Query v5 | same pattern as the original app |
| Forms | react-hook-form + Zod v4 | |
| Auth | Auth.js v5 (`next-auth@beta`), Credentials provider | v4 doesn't reliably support this Next/React combo; see `src/auth.ts` |
| Tables | TanStack Table v8 | v9 is a ground-up rewrite (`useReactTable` → `useTable`, no `getCoreRowModel`) — not worth adopting for these simple, unsorted tables |
| i18n | Custom cookie + dictionary (`src/lib/i18n`) | no library — see below |

## Architecture

```
src/
  app/                     routes (App Router)
    login/                 split-screen login (public)
    dashboard/             protected shell — see proxy.ts
      modules/             module tile hub
      administration/      Users, Roles, Subsidiaries
  auth.ts                  Auth.js config (Credentials → backend /login)
  proxy.ts                 route protection (was middleware.ts pre-Next 16)
  lib/
    api/
      openapi.json         the spec (copy of ../openapi.json)
      schema.d.ts           generated types — DO NOT hand-edit, run `pnpm gen:api`
      client.ts             typed client + bearer-token middleware + unwrap()
    administration/
      users.ts             server actions ("use server"): getAllUsers, createUser, deleteUser
      roles.ts / subsidiaries.ts / permissions.ts   same pattern
      hooks.ts             client-side TanStack Query hooks over the above
      forms.ts             Zod schemas + react-hook-form hooks
  components/
    administration/        tables + create dialogs, one file per dialog
    auth/                  login form
    dashboard/             logout button
    locale-select.tsx      EN/FR toggle (dropdown, top-right on login + dashboard)
    ui/                    shadcn/ui primitives
```

## i18n

Real (if scoped) EN/FR support, not a cosmetic toggle — no library, since the
scope here is small:

- `lib/i18n/dictionary.ts` — all strings, both locales, one object.
- `lib/i18n/locale.ts` — `getLocale()`/`getDictionary()`, **server-only**,
  reads the `locale` cookie via `cookies()`. Server Components call this
  directly.
- `lib/i18n/locale-provider.tsx` — `LocaleProvider`/`useDictionary()`, for
  Client Components (which can't call `cookies()`). Seeded once from the root
  layout with the server-read locale.
- `lib/i18n/actions.ts` — `setLocale()` Server Action, sets the cookie.
- `components/locale-select.tsx` — the dropdown. On selection it calls
  `setLocale()` then `window.location.reload()` — **not** `router.refresh()`,
  which doesn't reliably bust the client Router Cache for the root layout on
  this Next.js version (confirmed: the cookie was set correctly, the UI just
  didn't re-render until a hard reload).

Only the strings actually on screen in this pilot (login, dashboard chrome,
module names, Administration's three pages) are translated. Extending
coverage to a new module means adding its keys to `dictionary.ts` — same
mechanism, no new plumbing.

Each resource follows the same three-layer split as the original app
(`"use server"` request layer → client-side query/mutation hooks → UI), just
with the generated client doing the request/response typing instead of
hand-written mapping functions.

## Deliberate differences from the original

- **Role creation now has a permissions picker.** The original's
  `add-role-form.tsx` only collected a title, even though `createRole`
  always sent `permissions: args.permissionIds` — `permissionIds` was never
  set by any field, so the zod schema's `.min(1)` on it means the original
  form could never actually pass validation. Fixed here with a checkbox
  list sourced from `/permissions`.
- **`GET /permissions` response shape corrected.** The original mapper read
  `item.permissions.map(...)` on a *Permission* item (copy-pasted from the
  Role mapper) — almost certainly wrong, since nothing in the UI used this
  hook and a permission object having its own list of permissions doesn't
  match how permissions appear nested inside `Role.permissions` elsewhere.
  Modeled here as flat `{ id, name, label, description }`.
- **i18n is a custom cookie + dictionary, not `react-intl`.** The original
  uses `react-intl` with per-module `en.json`/`fr.json` files; this pilot's
  scope (one module, ~90 strings) didn't justify pulling in a library. See
  the "i18n" section above. Worth revisiting if/when the string count grows
  across ported modules.
- **Country field is a plain text input**, not the original's dedicated
  country/city picker (`services/country-sdk`) — out of scope for this
  pilot.
- **`.env` is no longer committed.** The original repo has `.env`
  (containing `NEXTAUTH_SECRET`) tracked in git history. Here, `.env.local`
  is gitignored and `.env.example` documents the two required variables.

## Backend notes

Confirmed backend defects and quirks found while porting (e.g. the corporate
administrator "two records" model, `DELETE /ca_administrators` failing, the
`shareholders.percentage` column range) are catalogued in the project's
Claude memory file `project_v2_backend_quirks.md`; the typed API client in
`src/lib/api` reflects the real contract, which was corrected wherever the
reverse-engineered `openapi.json` guessed wrong.

## Running it

```bash
pnpm install
pnpm dev
```

## Ported so far

Administration, Contracts and all four Governance sub-modules (Shareholding,
General Meeting, Administration Meeting / CA, Management Committee / CODIR),
Account Incidents, Recovery, Safety (mortgage, movable and personal safeties), Litigation and Audit.

## Not yet ported

Evaluation, Legal Monitoring, Documents Bank. The module
hub (`/dashboard/modules`) renders tiles for all of them for visual parity,
but only the ported modules' tiles lead anywhere real yet.
