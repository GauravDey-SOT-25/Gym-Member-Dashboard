// ============================================================
// data.js — Mock API & Data Architecture
// Role 18 | Club/Gym Member Dashboard
// ============================================================

// ─────────────────────────────────────────────
// 1. MEMBER PROFILE
// ─────────────────────────────────────────────
const memberProfile = {
  id: "MBR-2024-0042",
  name: "Arjun Verma",
  avatar: "assets/avatar.jpg",         // fallback to initials if missing
  email: "arjun.verma@email.com",
  phone: "+91-9876543210",
  joinedDate: "2023-03-15",
  age: 27,
  gender: "Male"
};

// ─────────────────────────────────────────────
// 2. MEMBERSHIP STATUS
// ─────────────────────────────────────────────
const membershipStatus = {
  plan: "Premium",                      // "Basic" | "Premium" | "Elite"
  status: "active",                     // "active" | "expiring_soon" | "expired"
  startDate: "2024-08-01",
  expiryDate: "2025-08-01",
  daysRemaining: 80,                    // computed, but stored for quick UI read
  autoRenew: true,
  price: 2999,                          // ₹ per month
  currency: "INR"
};

// ─────────────────────────────────────────────
// 3. ACTIVITY STATS (summary cards)
// ─────────────────────────────────────────────
const activityStats = {
  totalSessions: 48,
  sessionsThisMonth: 14,
  currentStreak: 6,                     // consecutive days
  longestStreak: 22,
  avgSessionDuration: 52,               // minutes
  caloriesBurned: 18400,               // total lifetime
  lastVisit: "2025-05-12"
};

// ─────────────────────────────────────────────
// 4. LOYALTY POINTS
// ─────────────────────────────────────────────
const loyaltyPoints = {
  current: 1200,
  lifetime: 3400,
  tier: "Gold",                         // "Bronze" | "Silver" | "Gold" | "Platinum"
  nextTierAt: 1500,
  history: [
    { date: "2025-05-10", action: "Session Check-in", points: +10 },
    { date: "2025-05-08", action: "Referral Bonus",   points: +100 },
    { date: "2025-05-05", action: "Redeemed Reward",  points: -200 },
    { date: "2025-05-01", action: "Monthly Bonus",    points: +50 }
  ]
};

// ─────────────────────────────────────────────
// 5. CHART DATA
// ─────────────────────────────────────────────

// All chart data follows the same contract:
// { labels: [...], datasets: [{ label, data, color }] }
// So charts.js never needs to reformat — just pass directly to Chart.js

const chartData = {

  sessions: {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Sessions",
        data: [1, 0, 1, 1, 0, 1, 1],
        color: "#6366f1"
      }]
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Sessions",
        data: [4, 5, 3, 4],
        color: "#6366f1"
      }]
    },
    yearly: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [{
        label: "Sessions",
        data: [18, 20, 15, 22, 14, 19, 21, 17, 23, 20, 16, 18],
        color: "#6366f1"
      }]
    }
  },

  calories: {
    weekly: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      datasets: [{
        label: "Calories Burned",
        data: [420, 0, 510, 390, 0, 480, 460],
        color: "#f59e0b"
      }]
    },
    monthly: {
      labels: ["Week 1","Week 2","Week 3","Week 4"],
      datasets: [{
        label: "Calories Burned",
        data: [1800, 2100, 1500, 1750],
        color: "#f59e0b"
      }]
    },
    yearly: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [{
        label: "Calories Burned",
        data: [7200, 7800, 6300, 8100, 5400, 7200, 8400, 6800, 9100, 7600, 6200, 7200],
        color: "#f59e0b"
      }]
    }
  }
};

// ─────────────────────────────────────────────
// 6. BOOKINGS (upcoming classes / slots)
// ─────────────────────────────────────────────
const bookings = [
  {
    id: "BK-001",
    class: "Zumba",
    trainer: "Priya Sharma",
    date: "2025-05-14",
    time: "07:00 AM",
    duration: 60,
    status: "confirmed"                 // "confirmed" | "waitlisted" | "cancelled"
  },
  {
    id: "BK-002",
    class: "Weight Training",
    trainer: "Rohan Mehta",
    date: "2025-05-15",
    time: "06:30 AM",
    duration: 75,
    status: "confirmed"
  },
  {
    id: "BK-003",
    class: "Yoga",
    trainer: "Anita Joshi",
    date: "2025-05-17",
    time: "08:00 AM",
    duration: 60,
    status: "waitlisted"
  }
];

// ─────────────────────────────────────────────
// 7. NOTIFICATIONS
// ─────────────────────────────────────────────
const notifications = [
  { id: 1, type: "reminder",  message: "Zumba class tomorrow at 7:00 AM", read: false, timestamp: "2025-05-13T18:00:00" },
  { id: 2, type: "offer",     message: "Renew now and get 1 month free!",  read: false, timestamp: "2025-05-12T10:00:00" },
  { id: 3, type: "milestone", message: "You hit a 6-day streak! 🔥",       read: true,  timestamp: "2025-05-11T09:00:00" },
  { id: 4, type: "system",    message: "New class added: HIIT on Fridays",  read: true,  timestamp: "2025-05-10T14:00:00" }
];

// ─────────────────────────────────────────────
// 8. REAL-TIME SIMULATION STATE
// Used by realtime.js to drive live-updating UI
// ─────────────────────────────────────────────
const realtimeState = {
  liveVisitors: 34,                     // current gym occupancy
  maxCapacity: 80,
  memberCurrentlyCheckedIn: false,
  activePointsAnimation: false          // triggers points ticker in UI
};

// ─────────────────────────────────────────────
// 9. ERROR / EDGE CASE STATES
// Pass these to test empty states in UI
// ─────────────────────────────────────────────
const errorStates = {
  noBookings: [],
  noPoints: { ...loyaltyPoints, current: 0, history: [] },
  expiredMembership: { ...membershipStatus, status: "expired", daysRemaining: 0 },
  expiringSoon: { ...membershipStatus, status: "expiring_soon", daysRemaining: 5 },
  emptyChart: {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [{ label: "Sessions", data: [0,0,0,0,0,0,0], color: "#6366f1" }]
  }
};

// ─────────────────────────────────────────────
// 10. PUBLIC API — what other modules call
// ─────────────────────────────────────────────
export const API = {
  getMember:       ()          => memberProfile,
  getMembership:   ()          => membershipStatus,
  getStats:        ()          => activityStats,
  getPoints:       ()          => loyaltyPoints,
  getChartData:    (type, view) => chartData[type][view],  // e.g. getChartData("sessions", "weekly")
  getBookings:     ()          => bookings,
  getNotifications:()          => notifications,
  getUnreadCount:  ()          => notifications.filter(n => !n.read).length,
  getRealtimeState:()          => realtimeState,
  getErrorState:   (key)       => errorStates[key]
};