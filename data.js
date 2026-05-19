// ============================================================
// data.js — Dynamic Data Architecture
// Role 18 | Club/Gym Member Dashboard
// ============================================================

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const CONFIG = {
  BASE_URL: "https://api.gymapp.com/v1",   // swap with real backend later
  MEMBER_ID: "MBR-2024-0042",
  REALTIME_INTERVAL: 5000,                 // ms — how often live data refreshes
  USE_MOCK: true                           // flip to false when real API is ready
};

// ─────────────────────────────────────────────
// INTERNAL STATE
// Single source of truth. No module touches this directly.
// ─────────────────────────────────────────────
let state = {
  member: null,
  membership: null,
  stats: null,
  points: null,
  chartData: {},
  bookings: [],
  notifications: [],
  realtimeState: null,
  loading: {},     // { member: true/false, charts: true/false, ... }
  errors: {}       // { member: null/"Network error"/... }
};

// ─────────────────────────────────────────────
// FETCHER — single place where all HTTP happens
// ─────────────────────────────────────────────
async function fetcher(endpoint) {
  try {
    const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error(`[API] Failed: ${endpoint}`, err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────
// MOCK RESOLVER — returns fake data when USE_MOCK = true
// Same shape as what the real API would return
// ─────────────────────────────────────────────
function mockResolver(endpoint) {
  const mocks = {
    "/member/MBR-2024-0042": {
      id: "MBR-2024-0042",
      name: "Arjun Verma",
      email: "arjun.verma@email.com",
      joinedDate: "2023-03-15"
    },
    "/member/MBR-2024-0042/membership": {
      plan: "Premium",
      status: "active",
      expiryDate: "2025-08-01",
      daysRemaining: 80,
      autoRenew: true
    },
    "/member/MBR-2024-0042/stats": {
      totalSessions: 48,
      sessionsThisMonth: 14,
      currentStreak: 6,
      caloriesBurned: 18400,
      lastVisit: "2025-05-12"
    },
    "/member/MBR-2024-0042/points": {
      current: 1200,
      lifetime: 3400,
      tier: "Gold",
      nextTierAt: 1500,
      history: [
        { date: "2025-05-10", action: "Session Check-in", points: +10 },
        { date: "2025-05-08", action: "Referral Bonus",   points: +100 },
        { date: "2025-05-05", action: "Redeemed Reward",  points: -200 }
      ]
    },
    "/member/MBR-2024-0042/bookings": [
      { id: "BK-001", class: "Zumba",           trainer: "Priya Sharma", date: "2025-05-14", time: "07:00 AM", status: "confirmed" },
      { id: "BK-002", class: "Weight Training", trainer: "Rohan Mehta",  date: "2025-05-15", time: "06:30 AM", status: "confirmed" },
      { id: "BK-003", class: "Yoga",            trainer: "Anita Joshi",  date: "2025-05-17", time: "08:00 AM", status: "waitlisted" }
    ],
    "/member/MBR-2024-0042/notifications": [
      { id: 1, type: "reminder",  message: "Zumba class tomorrow at 7:00 AM", read: false, timestamp: "2025-05-13T18:00:00" },
      { id: 2, type: "offer",     message: "Renew now and get 1 month free!", read: false, timestamp: "2025-05-12T10:00:00" },
      { id: 3, type: "milestone", message: "You hit a 6-day streak! 🔥",      read: true,  timestamp: "2025-05-11T09:00:00" }
    ],
    "/gym/realtime": {
      liveVisitors: 34,
      maxCapacity: 80,
      memberCheckedIn: false
    }
  };

  // simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mocks[endpoint];
      data ? resolve(data) : reject(new Error(`No mock for: ${endpoint}`));
    }, Math.random() * 400 + 100);        // 100–500ms fake latency
  });
}

// ─────────────────────────────────────────────
// CHART DATA FETCHER — dynamic by type + view
// ─────────────────────────────────────────────
async function fetchChartData(type, view) {
  const endpoint = `/member/${CONFIG.MEMBER_ID}/charts/${type}/${view}`;

  const mockCharts = {
    "sessions/weekly":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets: [{ label: "Sessions",        data: [1,0,1,1,0,1,1],                                  color: "#6366f1" }] },
    "sessions/monthly": { labels: ["Week 1","Week 2","Week 3","Week 4"],       datasets: [{ label: "Sessions",        data: [4,5,3,4],                                        color: "#6366f1" }] },
    "sessions/yearly":  { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Sessions", data: [18,20,15,22,14,19,21,17,23,20,16,18], color: "#6366f1" }] },
    "calories/weekly":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets: [{ label: "Calories Burned", data: [420,0,510,390,0,480,460],                         color: "#f59e0b" }] },
    "calories/monthly": { labels: ["Week 1","Week 2","Week 3","Week 4"],       datasets: [{ label: "Calories Burned", data: [1800,2100,1500,1750],                             color: "#f59e0b" }] },
    "calories/yearly":  { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Calories Burned", data: [7200,7800,6300,8100,5400,7200,8400,6800,9100,7600,6200,7200], color: "#f59e0b" }] }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockCharts[`${type}/${view}`];
      data ? resolve(data) : reject(new Error(`No chart mock for: ${type}/${view}`));
    }, 150);
  });
}

// ─────────────────────────────────────────────
// CORE LOADER — fetches and writes into state
// ─────────────────────────────────────────────
async function load(key, endpoint) {
  state.loading[key] = true;
  state.errors[key] = null;

  try {
    const data = CONFIG.USE_MOCK
      ? await mockResolver(endpoint)
      : await fetcher(endpoint);

    state[key] = data;
  } catch (err) {
    state.errors[key] = err.message;
  } finally {
    state.loading[key] = false;
  }
}

// ─────────────────────────────────────────────
// INIT — call once on page load
// Fetches everything in parallel
// ─────────────────────────────────────────────
async function init() {
  const id = CONFIG.MEMBER_ID;

  await Promise.allSettled([
    load("member",       `/member/${id}`),
    load("membership",   `/member/${id}/membership`),
    load("stats",        `/member/${id}/stats`),
    load("points",       `/member/${id}/points`),
    load("bookings",     `/member/${id}/bookings`),
    load("notifications",`/member/${id}/notifications`),
    load("realtimeState",`/gym/realtime`)
  ]);

  console.log("[API] All data loaded", state);
}

// ─────────────────────────────────────────────
// REALTIME POLLING — updates live data every N seconds
// ─────────────────────────────────────────────
let realtimeTimer = null;

function startRealtime() {
  realtimeTimer = setInterval(async () => {
    await load("realtimeState", "/gym/realtime");
    // bump mock value so UI actually changes
    if (CONFIG.USE_MOCK && state.realtimeState) {
      state.realtimeState.liveVisitors = Math.floor(Math.random() * 80) + 1;
    }
  }, CONFIG.REALTIME_INTERVAL);
}

function stopRealtime() {
  clearInterval(realtimeTimer);
}

// ─────────────────────────────────────────────
// PUBLIC API — same contract as before
// Other modules call these. Nothing else.
// ─────────────────────────────────────────────
const API = {
  init,
  startRealtime,
  stopRealtime,

  getMember:        ()           => state.member,
  getMembership:    ()           => state.membership,
  getStats:         ()           => state.stats,
  getPoints:        ()           => state.points,
  getBookings:      ()           => state.bookings,
  getNotifications: ()           => state.notifications,
  getUnreadCount:   ()           => state.notifications?.filter(n => !n.read).length ?? 0,
  getRealtimeState: ()           => state.realtimeState,

  // async — fetches on demand, caches in state
  getChartData: async (type, view) => {
    const cacheKey = `${type}_${view}`;
    if (!state.chartData[cacheKey]) {
      state.chartData[cacheKey] = await fetchChartData(type, view);
    }
    return state.chartData[cacheKey];
  },

  isLoading: (key) => state.loading[key] ?? false,
  getError:  (key) => state.errors[key]  ?? null,

  // mark notification read
  markRead: (id) => {
    const n = state.notifications?.find(n => n.id === id);
    if (n) n.read = true;
  }
};