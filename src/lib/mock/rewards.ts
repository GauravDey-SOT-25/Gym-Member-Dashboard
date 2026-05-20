/* [ROLE #18 - Mock API & Data Architecture] — rewards / perks */
export type Reward = {
  id: string;
  title: string;
  subtitle: string;
  status: "unlocked" | "active" | "locked";
  hint: string;
};

export const rewards: Reward[] = [
  { id: "r1", title: "Protein Shake", subtitle: "1 Free", status: "unlocked", hint: "Redeem anytime!" },
  { id: "r2", title: "Guest Pass", subtitle: "Bring a friend", status: "active", hint: "Valid until 31 May 2025" },
  { id: "r3", title: "Private Training", subtitle: "1 Session", status: "locked", hint: "Reach 3,000 pts to unlock" },
];

export type PointEntry = { id: string; amount: number; reason: string; when: string };

export const recentPoints: PointEntry[] = [
  { id: "p1", amount: 50, reason: "Leg Day Completed", when: "16 May 2025" },
  { id: "p2", amount: 20, reason: "Checked in Early", when: "16 May 2025" },
  { id: "p3", amount: 100, reason: "Monthly Bonus", when: "15 May 2025" },
  { id: "p4", amount: 30, reason: "Challenge Completed", when: "14 May 2025" },
];

export const nextTier = { name: "Elite", at: 3000 };
