/* [ROLE #18 - Mock API & Data Architecture] — member profile + plan */
export type Plan = "Silver" | "Gold" | "Elite";
export type Member = {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  memberSince: string;
  expiresInDays: number;
  points: number;
  sessions: number;
};

export const currentMember: Member = {
  id: "GYM-2026-ABH",
  name: "Abhinav Dwivedi",
  email: "abhinav@fitxperience.io",
  plan: "Gold",
  memberSince: "Jan 2024",
  expiresInDays: 15,
  points: 2450,
  sessions: 128,
};

export type Booking = {
  id: string;
  title: string;
  when: string;
  tag: "High Intensity" | "Relax & Restore" | "Cardio" | "Strength";
};

export const upcomingBookings: Booking[] = [
  { id: "b1", title: "HIIT Class", when: "Tue, 20 May 2025 · 8:00 AM", tag: "High Intensity" },
  { id: "b2", title: "Yoga Flow", when: "Fri, 23 May 2025 · 6:00 PM", tag: "Relax & Restore" },
];

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Upcoming";
  detail: string;
};

export const transactions: Transaction[] = [
  { id: "t1", date: "May 2025", amount: 89, status: "Paid", detail: "Paid on 05 May 2025" },
  { id: "t2", date: "Jun 2025", amount: 89, status: "Pending", detail: "Due 05 Jun 2025" },
  { id: "t3", date: "Jul 2025", amount: 89, status: "Upcoming", detail: "Due 05 Jul 2025" },
];
