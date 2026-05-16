# Gym Member Dashboard — Team Scaffold

A **basic working layout** for the Gym Member Dashboard project. This scaffold
is intentionally minimal so every team member can start building their own
module on top of a shared structure without merge conflicts.

> Stack: React + TanStack Router + TypeScript + Vite (already configured).
> Run with the standard dev server — see `package.json`.

---

## How the project is split

All UI lives in **`src/routes/index.tsx`** for now. Each section is wrapped in
a clearly labeled comment block like:

```tsx
/* [ROLE #4 - Membership Cards Developer] */
<div data-section="membership-cards"> ... </div>
```

When you start your work, **move your section into its own component file**
inside `src/components/<your-role>/`. Keep the role tag in a header comment
so reviewers know who owns the code.

Shared design tokens live in the `T` constant at the top of `index.tsx`
(owned by Role #1 / Role #11). Do not hardcode colors elsewhere.

---

## Role → Code map

### Frontend roles

| # | Role | Files / sections to own |
|---|------|------------------------|
| 1 | Frontend Lead | Whole `src/`, the `T` design tokens, folder structure, code review |
| 2 | Navigation & Routing | `<aside>` sidebar + `tab` state + future routes in `src/routes/` |
| 3 | Dashboard Layout | Grid in `Dashboard()`, sidebar, top header |
| 4 | Membership Cards | `data-section="membership-cards"` block in `OverviewTab` |
| 5 | Statistics Widgets | `data-section="stats-widgets"` block in `OverviewTab` |
| 6 | Line Chart | `ChartPlaceholder kind="line"` in `AnalyticsTab` (integrate Chart.js) |
| 7 | Doughnut / Pie Chart | `ChartPlaceholder kind="doughnut"` in `AnalyticsTab` |
| 8 | Real-Time Data Simulation | `useEffect` + `setInterval` block in `Dashboard()` |
| 9 | Dataset Toggle & State | `data-section="dataset-toggle"` in `AnalyticsTab` |
| 10 | Loading States & Skeleton UI | Add `<Skeleton/>` variants next to primitives at bottom of file |
| 11 | Theme & Dark Mode | `dark` state + `T` palette + topbar toggle |
| 12 | Settings Panel | `SettingsTab` component |
| 13 | Responsive Design | Wrap grids with media queries; convert inline styles to CSS modules / Tailwind |
| 14 | UI Animation & Transition | Hover handlers on `Card`, tab transitions, chart entry animations |
| 15 | Accessibility & UX | aria labels, focus rings, keyboard nav for sidebar/toggle/tabs |
| 16 | Error Handling & Empty States | Add fallback UI inside `ChartPlaceholder`, `Card`, etc. |
| 17 | Frontend Testing & Integration | Add tests under `src/__tests__/`; final QA pass |

### Backend (mock) roles

| # | Role | Where to work |
|---|------|---------------|
| 18 | Mock API & Data Architecture | Create `src/lib/mock/` with `members.ts`, `analytics.ts`, `rewards.ts` |
| 19 | Backend Simulation & Integration Support | Create `src/lib/mock/api.ts` with fake `async` + delays; hook into Role #8 |

---

## Section ↔ Tab map (matches the blueprint)

```
App
 ├── Sidebar             ........... Role #2, #3
 ├── Topbar              ........... Role #3, #11
 ├── Overview tab        ........... Role #3
 │    ├── Welcome Banner ........... Role #3
 │    ├── Membership Cards ......... Role #4
 │    └── Stats Widgets ............ Role #5
 ├── Analytics tab       ........... Role #3
 │    ├── Dataset Toggle ........... Role #9
 │    ├── Line Chart ............... Role #6
 │    └── Doughnut Chart ........... Role #7
 ├── Settings tab        ........... Role #12
 │    ├── Profile ................. Role #12
 │    ├── Notifications ........... Role #12
 │    └── Theme Toggle ............ Role #11
 └── Cross-cutting
      ├── Real-time sim ........... Role #8
      ├── Skeletons ............... Role #10
      ├── Animations .............. Role #14
      ├── A11y .................... Role #15
      ├── Errors/Empty ............ Role #16
      └── Mock API ................ Role #18, #19
```

---

## Working agreement

1. **Never edit another role's section** without asking — use the `[ROLE #N]` tags to find owners.
2. **No hardcoded colors.** Always read from the `T` token object (or its replacement once Role #11 migrates to CSS variables).
3. **No inline `setInterval` outside Role #8's module.** All real-time updates flow through one place.
4. **Charts use Chart.js** (Role #6/#7). Install via `bun add chart.js react-chartjs-2`.
5. **Run prettier / the repo's lint** before opening a PR.
6. Role #1 merges and resolves conflicts.

---

## Next steps for each developer

- Pull the repo, open `src/routes/index.tsx`, locate your `[ROLE #N]` tag.
- Extract your block into `src/components/<your-area>/<Component>.tsx`.
- Import it back into `index.tsx` so the layout still renders.
- Build out your module per the PRD / design system.
