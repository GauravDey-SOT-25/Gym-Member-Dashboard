// js/data.js
const membershipStatus = {
  plan: "Premium",
  status: "active",
  startDate: "2024-08-01",
  expiryDate: "2025-08-01",
  daysRemaining: 80,
  autoRenew: true,
  price: 2999,
  currency: "INR"
};

const activityStats = {
  totalSessions: 48,
  sessionsThisMonth: 14,
  currentStreak: 6,
  longestStreak: 22,
  avgSessionDuration: 52,
  caloriesBurned: 18400,
  lastVisit: "2025-05-12"
};

const loyaltyPoints = {
  current: 1200,
  lifetime: 3400,
  tier: "Gold",
  nextTierAt: 1500
};

const mockRealtimeState = {
  liveVisitors: 34,
  maxCapacity: 80,
  memberCheckedIn: false
};

const mockCharts = {
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  datasets: [{ 
    label: "Sessions", 
    data: [1,0,1,1,0,1,1], 
    color: "#6366f1" 
  }]
};

export const API = {
  getMember: () => ({ id: "MBR-2024-0042", name: "Arjun Verma" }),
  getMembership: () => membershipStatus,
  getStats: () => activityStats,
  getPoints: () => loyaltyPoints,
  getRealtimeState: () => mockRealtimeState,
  getChartData: (type, view) => mockCharts
};