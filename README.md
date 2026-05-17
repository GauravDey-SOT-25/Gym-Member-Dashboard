# FitXperience — Gym Member Dashboard (Team Scaffold)

Working layout for the **Gym Member Dashboard** group project, structured to
match the 5-section blueprint and to give **every one of the 19 roles** a
visible, named workspace inside the running app.

Stack: React 19 + TanStack Start + TypeScript + Vite + Tailwind v4.

---

## 1. Blueprint → Route map

| # | Blueprint section       | Route        | File                          |
|---|--------------------------|--------------|-------------------------------|
| 1 | Central Hub (Home)       | `/`          | `src/routes/index.tsx`        |
| 2 | Sensory Analytics (Data) | `/data`      | `src/routes/data.tsx`         |
| 3 | Membership Boutique (Plan)| `/plan`     | `src/routes/plan.tsx`         |
| 4 | Rewards Odyssey (Perks)  | `/perks`     | `src/routes/perks.tsx`        |
| 5 | Personal Command (Edit)  | `/edit`      | `src/routes/edit.tsx`         |

The bottom **Floating Dock** (`src/components/floating-dock.tsx`) navigates
between all five.

---

## 2. The `<RoleSlot/>` workspace marker

Every developer-owned block in the app is wrapped with a `<RoleSlot/>` so
the workspace is **visible in the running UI**, not just in code comments.

```tsx
<RoleSlot role={6} name="Line Chart Developer" area="Activity Intensity">
  {/* ROLE #6 builds the smooth spline chart here */}
</RoleSlot>
```

- Dashed border = placeholder (`status="todo"`, default)
- Solid border  = implemented (`status="done"`)
- Header always shows `ROLE #N · name · area`

Search the repo for `RoleSlot role={N}` to find every workspace owned by a role.

---

## 3. Role → File map (all 19 roles)

### Frontend

| #  | Role                              | Where they work                                                                 |
|----|-----------------------------------|---------------------------------------------------------------------------------|
| 1  | Frontend Lead Developer           | `src/styles.css` tokens, `src/components/role-slot.tsx`, code review, merges    |
| 2  | Navigation & Routing              | `src/components/floating-dock.tsx`, `src/routes/__root.tsx`                     |
| 3  | Dashboard Layout                  | `src/components/app-shell.tsx`, welcome banners on every route                  |
| 4  | Membership Cards                  | Orbs on `/`, member card + bookings on `/plan`, reward tiles on `/perks`        |
| 5  | Statistics Widgets                | Live orbs on `/`, billing timeline on `/plan`, points activity on `/perks`      |
| 6  | Line Chart                        | Activity Intensity chart on `/data`, progress path on `/perks`                  |
| 7  | Doughnut / Pie Chart              | Facility heatmap + Muscle Group Radar on `/data`                                |
| 8  | Real-Time Data Simulation         | `src/lib/realtime.ts` (only place `setInterval` is allowed)                     |
| 9  | Dataset Toggle & State            | Range switcher on `/data`, filters on `/perks`                                  |
| 10 | Loading States & Skeleton UI      | `src/components/skeletons.tsx` (wire into every async slot)                     |
| 11 | Theme & Dark Mode                 | `src/components/theme-provider.tsx`, theme switcher on `/edit`, topbar toggle   |
| 12 | Settings Panel                    | All cards on `/edit` (Profile, Sync, Alerts, Danger Zone)                       |
| 13 | Responsive Design                 | Tailwind breakpoints across every route                                         |
| 14 | UI Animation & Transition         | Quick Actions on `/`, dock hover, timeline animation, reward unlock             |
| 15 | Accessibility & UX                | ARIA on dock, switches on `/edit`, focus rings, contrast                        |
| 16 | Error Handling & Empty States     | `src/components/empty-state.tsx` (wire into every async slot)                   |
| 17 | Frontend Testing & Integration    | `src/__tests__/` — add Vitest specs per role                                    |

### Backend (mock)

| #  | Role                                       | Where they work                                            |
|----|--------------------------------------------|------------------------------------------------------------|
| 18 | Mock API & Data Architecture               | `src/lib/mock/members.ts`, `analytics.ts`, `rewards.ts`    |
| 19 | Backend Simulation & Integration Support   | `src/lib/mock/api.ts` (async + delays, swap for real API)  |

---

## 4. File tree

```
src/
├── components/
│   ├── app-shell.tsx        [ROLE #3, #11, #13, #15]
│   ├── floating-dock.tsx    [ROLE #2, #14, #15]
│   ├── theme-provider.tsx   [ROLE #11]
│   ├── role-slot.tsx        [ROLE #1] — workspace marker
│   ├── skeletons.tsx        [ROLE #10]
│   ├── empty-state.tsx      [ROLE #16]
│   └── ui/                  shadcn primitives
├── lib/
│   ├── realtime.ts          [ROLE #8]
│   └── mock/
│       ├── members.ts       [ROLE #18]
│       ├── analytics.ts     [ROLE #18]
│       ├── rewards.ts       [ROLE #18]
│       └── api.ts           [ROLE #19]
├── routes/
│   ├── __root.tsx           shell + providers
│   ├── index.tsx            Page 1 — Central Hub
│   ├── data.tsx             Page 2 — Sensory Analytics
│   ├── plan.tsx             Page 3 — Membership Boutique
│   ├── perks.tsx            Page 4 — Rewards Odyssey
│   └── edit.tsx             Page 5 — Personal Command
└── styles.css               design tokens (brand, surface, etc.)
```

---

## 5. Working agreement

1. **Never edit another role's `RoleSlot`** without asking — find the owner via `data-role="N"`.
2. **No hardcoded colors.** Use Tailwind classes backed by tokens in `src/styles.css`
   (`bg-brand`, `text-foreground`, `border-border`, `bg-elevated`, …).
3. **No `setInterval` outside `src/lib/realtime.ts`** — all live updates flow through Role #8.
4. **Charts = Chart.js / recharts.** Run `bun add chart.js react-chartjs-2` when Role #6/#7 start.
5. **All data fetch goes through `src/lib/mock/api.ts`** — Role #19 swaps the implementation.
6. **Mark a slot as `status="done"`** when your block is implemented (solid border).
7. Role #1 merges PRs and resolves token-level conflicts.

---

## 6. Onboarding (each developer)

1. Pull the repo, run the dev server.
2. Search for `role={YOUR_NUMBER}` — every match is yours to own.
3. Build your component in `src/components/<your-area>/` and import it
   into the matching `<RoleSlot/>`.
4. Flip `status="todo"` to `status="done"` so the dashed border becomes solid.
5. Open a PR — Role #1 reviews + merges.

The current UI runs end-to-end with mock data, so anyone can demo the full
five-page flow today, then progressively replace placeholder slots with real
implementations.
