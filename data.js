// ============================================================
// data.js — Multi-User Dynamic Data Architecture
// Supports N users — driven by login/session
// ============================================================

const CONFIG = {
  BASE_URL: "https://api.gymapp.com/v1",
  REALTIME_INTERVAL: 5000,
  USE_MOCK: true
};

// ─────────────────────────────────────────────
// 10 MOCK USERS
// ─────────────────────────────────────────────
const MOCK_USERS = {
  "MBR-001": { id: "MBR-001", name: "Arjun Verma",    email: "arjun@email.com",   plan: "Premium", status: "active",        daysRemaining: 80,  sessions: 48, streak: 6,  calories: 18400, points: 1200, tier: "Gold"     },
  "MBR-002": { id: "MBR-002", name: "Priya Sharma",   email: "priya@email.com",   plan: "Basic",   status: "expiring_soon", daysRemaining: 4,   sessions: 22, streak: 2,  calories: 8200,  points: 400,  tier: "Silver"   },
  "MBR-003": { id: "MBR-003", name: "Rohan Mehta",    email: "rohan@email.com",   plan: "Elite",   status: "active",        daysRemaining: 180, sessions: 91, streak: 14, calories: 34200, points: 3100, tier: "Platinum" },
  "MBR-004": { id: "MBR-004", name: "Sneha Iyer",     email: "sneha@email.com",   plan: "Basic",   status: "expired",       daysRemaining: 0,   sessions: 10, streak: 0,  calories: 3100,  points: 100,  tier: "Bronze"   },
  "MBR-005": { id: "MBR-005", name: "Karan Singh",    email: "karan@email.com",   plan: "Premium", status: "active",        daysRemaining: 45,  sessions: 60, streak: 9,  calories: 22000, points: 1800, tier: "Gold"     },
  "MBR-006": { id: "MBR-006", name: "Anita Joshi",    email: "anita@email.com",   plan: "Elite",   status: "active",        daysRemaining: 200, sessions: 110,streak: 21, calories: 41000, points: 4200, tier: "Platinum" },
  "MBR-007": { id: "MBR-007", name: "Vikram Nair",    email: "vikram@email.com",  plan: "Basic",   status: "active",        daysRemaining: 20,  sessions: 15, streak: 3,  calories: 5400,  points: 250,  tier: "Bronze"   },
  "MBR-008": { id: "MBR-008", name: "Meera Pillai",   email: "meera@email.com",   plan: "Premium", status: "active",        daysRemaining: 90,  sessions: 55, streak: 11, calories: 20100, points: 1600, tier: "Gold"     },
  "MBR-009": { id: "MBR-009", name: "Aditya Rao",     email: "aditya@email.com",  plan: "Basic",   status: "expiring_soon", daysRemaining: 6,   sessions: 8,  streak: 1,  calories: 2800,  points: 80,   tier: "Bronze"   },
  "MBR-010": { id: "MBR-010", name: "Divya Menon",    email: "divya@email.com",   plan: "Elite",   status: "active",        daysRemaining: 150, sessions: 78, streak: 18, calories: 29300, points: 2900, tier: "Platinum" }
};

// ─────────────────────────────────────────────
// STATE — resets on every login
// ─────────────────────────────────────────────
let state = {
  currentMemberId: null,
  member: null,
  membership: null,
  stats: null,
  points: null,
  chartData: {},
  bookings: [],
  notifications: [],
  realtimeState: null,
  loading: {},
  errors: {}
};

// ─────────────────────────────────────────────
// MOCK RESOLVER — builds response from MOCK_USERS
// ─────────────────────────────────────────────
function mockResolver(endpoint) {
  // extract memberId from endpoint e.g. /member/MBR-003/stats → MBR-003
  const memberMatch = endpoint.match(/\/member\/(MBR-\d+)/);
  const memberId = memberMatch ? memberMatch[1] : null;
  const user = memberId ? MOCK_USERS[memberId] : null;

  const responses = {
    [`/member/${memberId}`]: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      joinedDate: "2023-03-15"
    } : null,

    [`/member/${memberId}/membership`]: user ? {
      plan: user.plan,
      status: user.status,
      expiryDate: "2025-08-01",
      daysRemaining: user.daysRemaining,
      autoRenew: true
    } : null,

    [`/member/${memberId}/stats`]: user ? {
      totalSessions: user.sessions,
      sessionsThisMonth: Math.floor(user.sessions / 4),
      currentStreak: user.streak,
      caloriesBurned: user.calories,
      lastVisit: "2025-05-12"
    } : null,

    [`/member/${memberId}/points`]: user ? {
      current: user.points,
      lifetime: user.points * 2,
      tier: user.tier,
      nextTierAt: user.points + 300,
      history: [
        { date: "2025-05-10", action: "Session Check-in", points: +10 },
        { date: "2025-05-08", action: "Referral Bonus",   points: +100 }
      ]
    } : null,

    [`/member/${memberId}/bookings`]: [
      { id: "BK-001", class: "Zumba",           trainer: "Priya Sharma", date: "2025-05-14", time: "07:00 AM", status: "confirmed"  },
      { id: "BK-002", class: "Weight Training", trainer: "Rohan Mehta",  date: "2025-05-15", time: "06:30 AM", status: "confirmed"  },
      { id: "BK-003", class: "Yoga",            trainer: "Anita Joshi",  date: "2025-05-17", time: "08:00 AM", status: "waitlisted" }
    ],

    [`/member/${memberId}/notifications`]: [
      { id: 1, type: "reminder",  message: "Class tomorrow at 7:00 AM",  read: false, timestamp: "2025-05-13T18:00:00" },
      { id: 2, type: "offer",     message: "Renew now and get 1 month free!", read: false, timestamp: "2025-05-12T10:00:00" }
    ],

    "/gym/realtime": {
      liveVisitors: Math.floor(Math.random() * 80) + 1,
      maxCapacity: 80,
      memberCheckedIn: false
    }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = responses[endpoint];
      data !== undefined
        ? resolve(data)
        : reject(new Error(`No mock for: ${endpoint}`));
    }, Math.random() * 400 + 100);
  });
}

// ─────────────────────────────────────────────
// FETCHER
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
// CHART DATA — generated per user
// ─────────────────────────────────────────────
async function fetchChartData(type, view, memberId) {
  const user = MOCK_USERS[memberId];
  const base = user ? user.sessions : 10;

  // generates varied data per user based on their session count
  const vary = (b) => Array.from({ length: 7 }, (_, i) =>
    Math.max(0, Math.floor(b * (0.5 + Math.random())))
  );

  const mockCharts = {
    "sessions/weekly":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets: [{ label: "Sessions",        data: vary(base / 20), color: "#6366f1" }] },
    "sessions/monthly": { labels: ["Week 1","Week 2","Week 3","Week 4"],       datasets: [{ label: "Sessions",        data: vary(base / 10).slice(0,4), color: "#6366f1" }] },
    "sessions/yearly":  { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Sessions", data: vary(base).slice(0,12), color: "#6366f1" }] },
    "calories/weekly":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets: [{ label: "Calories Burned", data: vary(user?.calories / 50 || 100), color: "#f59e0b" }] },
    "calories/monthly": { labels: ["Week 1","Week 2","Week 3","Week 4"],       datasets: [{ label: "Calories Burned", data: vary(user?.calories / 20 || 200).slice(0,4), color: "#f59e0b" }] },
    "calories/yearly":  { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Calories Burned", data: vary(user?.calories / 5 || 500).slice(0,12), color: "#f59e0b" }] }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockCharts[`${type}/${view}`];
      data ? resolve(data) : reject(new Error(`No chart: ${type}/${view}`));
    }, 150);
  });
}

// ─────────────────────────────────────────────
// CORE LOADER
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
// INIT — now accepts memberId
// ─────────────────────────────────────────────
async function init(memberId) {
  if (!MOCK_USERS[memberId] && CONFIG.USE_MOCK) {
    console.error(`[API] Unknown member: ${memberId}`);
    return;
  }

  // reset state for new user
  state = {
    currentMemberId: memberId,
    member: null, membership: null, stats: null,
    points: null, chartData: {}, bookings: [],
    notifications: [], realtimeState: null,
    loading: {}, errors: {}
  };

  await Promise.allSettled([
    load("member",        `/member/${memberId}`),
    load("membership",    `/member/${memberId}/membership`),
    load("stats",         `/member/${memberId}/stats`),
    load("points",        `/member/${memberId}/points`),
    load("bookings",      `/member/${memberId}/bookings`),
    load("notifications", `/member/${memberId}/notifications`),
    load("realtimeState", `/gym/realtime`)
  ]);

  console.log(`[API] Loaded data for ${memberId}`, state);
}

// ─────────────────────────────────────────────
// REALTIME POLLING
// ─────────────────────────────────────────────
let realtimeTimer = null;

function startRealtime() {
  realtimeTimer = setInterval(async () => {
    await load("realtimeState", "/gym/realtime");
    if (CONFIG.USE_MOCK && state.realtimeState) {
      state.realtimeState.liveVisitors = Math.floor(Math.random() * 80) + 1;
    }
  }, CONFIG.REALTIME_INTERVAL);
}

function stopRealtime() {
  clearInterval(realtimeTimer);
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────
const API = {
  init,                          // API.init("MBR-003") — call on login
  startRealtime,
  stopRealtime,

  getAllUsers: () => Object.values(MOCK_USERS),   // for admin/login screen

  getMember:        () => state.member,
  getMembership:    () => state.membership,
  getStats:         () => state.stats,
  getPoints:        () => state.points,
  getBookings:      () => state.bookings,
  getNotifications: () => state.notifications,
  getUnreadCount:   () => state.notifications?.filter(n => !n.read).length ?? 0,
  getRealtimeState: () => state.realtimeState,
  getCurrentUser:   () => state.currentMemberId,

  getChartData: async (type, view) => {
    const cacheKey = `${type}_${view}`;
    if (!state.chartData[cacheKey]) {
      state.chartData[cacheKey] = await fetchChartData(type, view, state.currentMemberId);
    }
    return state.chartData[cacheKey];
  },

  isLoading: (key) => state.loading[key] ?? false,
  getError:  (key) => state.errors[key]  ?? null,

  markRead: (id) => {
    const n = state.notifications?.find(n => n.id === id);
    if (n) n.read = true;
  }
};
