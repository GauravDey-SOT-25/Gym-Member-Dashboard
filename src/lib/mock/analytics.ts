/* [ROLE #18 - Mock API & Data Architecture] — analytics datasets */
export type Range = "weekly" | "monthly" | "yearly";

export const activitySeries: Record<Range, { label: string; value: number }[]> = {
  weekly: [
    { label: "Mon", value: 42 }, { label: "Tue", value: 65 }, { label: "Wed", value: 51 },
    { label: "Thu", value: 78 }, { label: "Fri", value: 70 }, { label: "Sat", value: 88 },
    { label: "Sun", value: 60 },
  ],
  monthly: Array.from({ length: 12 }, (_, i) => ({
    label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
    value: 40 + Math.round(Math.sin(i) * 20 + 30),
  })),
  yearly: Array.from({ length: 5 }, (_, i) => ({
    label: String(2021 + i),
    value: 60 + i * 8,
  })),
};

export const muscleGroups = [
  { label: "Chest", value: 78 },
  { label: "Back", value: 65 },
  { label: "Legs", value: 90 },
  { label: "Shoulders", value: 55 },
  { label: "Arms", value: 70 },
  { label: "Core", value: 82 },
];

export const facilityHeatmap = [
  { zone: "Cardio", load: "high" as const },
  { zone: "Weights", load: "low" as const },
  { zone: "Studio", load: "medium" as const },
  { zone: "Pool", load: "medium" as const },
];

export const membershipUsage = [
  { label: "Classes", value: 45 },
  { label: "Open Gym", value: 30 },
  { label: "Personal Training", value: 15 },
  { label: "Recovery", value: 10 },
];
