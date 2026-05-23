// ============================================================
// data.js — Membership Cards Data
// Club/Gym Member Dashboard
// ============================================================

// ─────────────────────────────────────────────
// 1. MEMBERSHIP STATUS
// ─────────────────────────────────────────────

const membershipStatus = {
  plan: "Premium",                   // Basic | Premium | Elite
  status: "active",                  // active | expiring_soon | expired
  startDate: "2024-08-01",
  expiryDate: "2025-08-01",
  daysRemaining: 80,
  autoRenew: true,
  price: 2999,
  currency: "INR"
};

// ─────────────────────────────────────────────
// 2. ACTIVITY STATS
// ─────────────────────────────────────────────

const activityStats = {
  totalSessions: 48,
  sessionsThisMonth: 14,
  currentStreak: 6,
  longestStreak: 22,
  avgSessionDuration: 52,
  caloriesBurned: 18400,
  lastVisit: "2025-05-12"
};

// ─────────────────────────────────────────────
// 3. LOYALTY POINTS
// ─────────────────────────────────────────────

const loyaltyPoints = {
  current: 1200,
  lifetime: 3400,
  tier: "Gold",
  nextTierAt: 1500
};

// ─────────────────────────────────────────────
// 4. STATUS COLORS
// ─────────────────────────────────────────────

const statusColors = {
  active: "#22C55E",
  expiring_soon: "#F59E0B",
  expired: "#EF4444"
};

// ─────────────────────────────────────────────
// 5. PUBLIC API
// ─────────────────────────────────────────────

export const API = {
  getMembership: () => membershipStatus,
  getStats: () => activityStats,
  getPoints: () => loyaltyPoints,
  getStatusColors: () => statusColors
};
