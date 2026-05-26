// js/data.js
// Data layer implementing background sync with Node.js REST backend, falling back to localStorage if offline.

const DEFAULT_MOCK_USERS = {
  "MBR-001": { id: "MBR-001", name: "Arjun Verma",    email: "arjun@email.com",   phone: "+91 98765 43210", plan: "Premium", status: "active",        daysRemaining: 80,  sessions: 48, streak: 6,  calories: 18400, points: 1200, tier: "Gold"     },
  "MBR-002": { id: "MBR-002", name: "Priya Sharma",   email: "priya@email.com",   phone: "+91 98765 43211", plan: "Basic",   status: "expiring_soon", daysRemaining: 4,   sessions: 22, streak: 2,  calories: 8200,  points: 400,  tier: "Silver"   },
  "MBR-003": { id: "MBR-003", name: "Rohan Mehta",    email: "rohan@email.com",   phone: "+91 98765 43212", plan: "Elite",   status: "active",        daysRemaining: 180, sessions: 91, streak: 14, calories: 34200, points: 3100, tier: "Platinum" },
  "MBR-004": { id: "MBR-004", name: "Sneha Iyer",     email: "sneha@email.com",   phone: "+91 98765 43213", plan: "Basic",   status: "expired",        daysRemaining: 0,   sessions: 10, streak: 0,  calories: 3100,  points: 100,  tier: "Bronze"   },
  "MBR-005": { id: "MBR-005", name: "Karan Singh",    email: "karan@email.com",   phone: "+91 98765 43214", plan: "Premium", status: "active",        daysRemaining: 45,  sessions: 60, streak: 9,  calories: 22000, points: 1800, tier: "Gold"     },
  "MBR-006": { id: "MBR-006", name: "Anita Joshi",    email: "anita@email.com",   phone: "+91 98765 43215", plan: "Elite",   status: "active",        daysRemaining: 200, sessions: 110,streak: 21, calories: 41000, points: 4200, tier: "Platinum" },
  "MBR-007": { id: "MBR-007", name: "Vikram Nair",    email: "vikram@email.com",  phone: "+91 98765 43216", plan: "Basic",   status: "active",        daysRemaining: 20,  sessions: 15, streak: 3,  calories: 5400,  points: 250,  tier: "Bronze"   },
  "MBR-008": { id: "MBR-008", name: "Meera Pillai",   email: "meera@email.com",   phone: "+91 98765 43217", plan: "Premium", status: "active",        daysRemaining: 90,  sessions: 55, streak: 11, calories: 20100, points: 1600, tier: "Gold"     },
  "MBR-009": { id: "MBR-009", name: "Aditya Rao",     email: "aditya@email.com",  phone: "+91 98765 43218", plan: "Basic",   status: "expiring_soon", daysRemaining: 6,   sessions: 8,  streak: 1,  calories: 2800,  points: 80,   tier: "Bronze"   },
  "MBR-010": { id: "MBR-010", name: "Divya Menon",    email: "divya@email.com",   phone: "+91 98765 43219", plan: "Elite",   status: "active",        daysRemaining: 150, sessions: 78, streak: 18, calories: 29300, points: 2900, tier: "Platinum" }
};

let state = {
  currentMemberId: null,
  member: null,
  membership: null,
  stats: null,
  points: null,
  bookings: [],
  notifications: [],
  realtimeState: {
    liveVisitors: 34,
    maxCapacity: 80,
    memberCheckedIn: false
  },
  chartData: {},
  membershipDistribution: {
    premium: 165,
    standard: 135,
    basic: 95,
    trial: 45
  }
};

let isBackendAvailable = false;

// Helpers for local storage fallback
function getStoredUsers() {
  const users = localStorage.getItem("fitmatrix_users");
  if (!users) {
    localStorage.setItem("fitmatrix_users", JSON.stringify(DEFAULT_MOCK_USERS));
    return DEFAULT_MOCK_USERS;
  }
  return JSON.parse(users);
}

function saveStoredUsers(users) {
  localStorage.setItem("fitmatrix_users", JSON.stringify(users));
}

function getStoredUserSessionData(memberId) {
  const data = localStorage.getItem(`fitmatrix_session_${memberId}`);
  if (!data) {
    const defaultData = {
      bookings: [
        { id: "BK-001", class: "Zumba Power", trainer: "Priya Sharma", date: "Tomorrow", time: "07:00 AM", status: "confirmed" },
        { id: "BK-002", class: "Weight Shred", trainer: "Rohan Mehta", date: "May 28, 2026", time: "06:30 AM", status: "confirmed" }
      ],
      notifications: [
        { id: 1, type: "reminder", message: "Zumba class tomorrow at 7:00 AM", read: false, timestamp: new Date().toISOString() },
        { id: 2, type: "offer", message: "Renew now and get 1 month free!", read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, type: "milestone", message: "Streak level reached! 🔥", read: true, timestamp: new Date(Date.now() - 7200000).toISOString() }
      ],
      pointsHistory: [
        { date: "2026-05-24", action: "Session Check-in", points: 10 },
        { date: "2026-05-23", action: "Referral Bonus", points: 100 }
      ]
    };
    localStorage.setItem(`fitmatrix_session_${memberId}`, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
}

function saveStoredUserSessionData(memberId, data) {
  localStorage.setItem(`fitmatrix_session_${memberId}`, JSON.stringify(data));
}

// ──────────────────────────────────────────────────────────────────────────
// INITIALIZE SESSION STATE
// ──────────────────────────────────────────────────────────────────────────
async function init(memberId) {
  state.currentMemberId = memberId;
  
  // Try to load from backend first
  try {
    const response = await fetch(`/api/user/${memberId}`);
    if (response.ok) {
      const res = await response.json();
      if (res.success) {
        state.member = res.profile;
        state.membership = res.membership;
        state.stats = res.stats;
        state.points = res.points;
        state.bookings = res.bookings;
        state.notifications = res.notifications;
        isBackendAvailable = true;
        console.log(`[API] State dynamically loaded from server for user: ${memberId}`);
        return true;
      }
    }
  } catch (err) {
    console.warn(`[API] Backend not reachable (${err.message}). Falling back to local storage.`);
  }

  // Local Storage Fallback
  isBackendAvailable = false;
  const users = getStoredUsers();
  const user = users[memberId];

  if (!user) {
    console.error(`[API] Unknown member: ${memberId}`);
    return false;
  }

  const sessionData = getStoredUserSessionData(memberId);

  state.member = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "+91 99999 88888",
    joinedDate: "2025-03-15"
  };
  state.membership = {
    plan: user.plan,
    status: user.status,
    expiryDate: "2026-08-01",
    daysRemaining: user.daysRemaining,
    price: user.plan === "Elite" ? 4999 : (user.plan === "Premium" ? 2999 : 1499),
    autoRenew: true
  };
  state.stats = {
    totalSessions: user.sessions,
    sessionsThisMonth: Math.floor(user.sessions / 4) + 1,
    currentStreak: user.streak,
    longestStreak: Math.max(user.streak + 8, 12),
    avgSessionDuration: 52,
    caloriesBurned: user.calories,
    lastVisit: "Yesterday"
  };
  state.points = {
    current: user.points,
    lifetime: user.points + 500,
    tier: user.tier,
    nextTierAt: user.points > 3000 ? 5000 : (user.points > 1500 ? 3000 : 1500),
    history: sessionData.pointsHistory
  };
  state.bookings = sessionData.bookings;
  state.notifications = sessionData.notifications;
  state.chartData = {};

  return true;
}

// Local storage sync (runs in fallback mode)
function syncStateToStorage() {
  if (!state.currentMemberId || isBackendAvailable) return;

  const users = getStoredUsers();
  users[state.currentMemberId] = {
    ...users[state.currentMemberId],
    name: state.member.name,
    email: state.member.email,
    phone: state.member.phone,
    plan: state.membership.plan,
    status: state.membership.status,
    daysRemaining: state.membership.daysRemaining,
    sessions: state.stats.totalSessions,
    streak: state.stats.currentStreak,
    calories: state.stats.caloriesBurned,
    points: state.points.current,
    tier: state.points.tier
  };
  saveStoredUsers(users);

  const sessionData = {
    bookings: state.bookings,
    notifications: state.notifications,
    pointsHistory: state.points.history
  };
  saveStoredUserSessionData(state.currentMemberId, sessionData);
}

// Chart data generator - Dynamic per user based on their stats
function fetchChartDataSync(type, view, memberId) {
  const users = getStoredUsers();
  const user = users[memberId];
  const base = user ? user.sessions : 10;
  const calBase = user ? user.calories : 5000;

  const generateDataPoints = (length, multiplier) => {
    return Array.from({ length }, () => Math.max(1, Math.floor(multiplier * (0.6 + Math.random() * 0.8))));
  };

  if (type === "sessions") {
    if (view === "weekly") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ label: "Sessions", data: [1, 0, 1, 1, 0, 1, 1], color: "#6366f1" }]
      };
    } else if (view === "monthly") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{ label: "Sessions", data: generateDataPoints(4, base / 12), color: "#6366f1" }]
      };
    } else {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{ label: "Sessions", data: generateDataPoints(12, base / 8), color: "#6366f1" }]
      };
    }
  } else { // calories
    if (view === "weekly") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ label: "Calories (kcal)", data: generateDataPoints(7, calBase / 30), color: "#f59e0b" }]
      };
    } else if (view === "monthly") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{ label: "Calories (kcal)", data: generateDataPoints(4, calBase / 10), color: "#f59e0b" }]
      };
    } else {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{ label: "Calories (kcal)", data: generateDataPoints(12, calBase / 6), color: "#f59e0b" }]
      };
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────
// EXPORTED API GATEWAY
// ──────────────────────────────────────────────────────────────────────────
const API = {
  init,
  
  // Auth query
  getAllUsers: () => Object.values(getStoredUsers()),
  isLiveBackend: () => isBackendAvailable,
  
  // State getters
  getMember: () => state.member,
  getMembership: () => state.membership,
  getStats: () => state.stats,
  getPoints: () => state.points,
  getBookings: () => state.bookings,
  getNotifications: () => state.notifications,
  getUnreadCount: () => state.notifications?.filter(n => !n.read).length ?? 0,
  getRealtimeState: () => state.realtimeState,
  getCurrentUser: () => state.currentMemberId,

  // Gym-wide Membership Distribution
  getMembershipDistribution: async () => {
    if (isBackendAvailable) {
      try {
        const response = await fetch('/api/membership/distribution');
        if (response.ok) {
          const res = await response.json();
          if (res.success) {
            state.membershipDistribution = {
              premium: res.data.values[0],
              standard: res.data.values[1],
              basic: res.data.values[2],
              trial: res.data.values[3]
            };
            return res;
          }
        }
      } catch (err) {
        console.warn('[API] Error loading membership distribution:', err.message);
      }
    }

    // Local Fallback
    return {
      success: true,
      type: 'membership',
      view: 'distribution',
      timestamp: new Date().toISOString(),
      data: {
        labels: ['Premium', 'Standard', 'Basic', 'Trial'],
        values: [
          state.membershipDistribution.premium,
          state.membershipDistribution.standard,
          state.membershipDistribution.basic,
          state.membershipDistribution.trial
        ],
        colors: ['#FFD700', '#FFA500', '#e67e00', '#b35900']
      }
    };
  },

  // Fluctuate local distribution (fallback)
  fluctuateMembershipDistribution: () => {
    if (isBackendAvailable) return; // Managed by WebSocket broadcast from backend
    const shift = () => Math.floor(Math.random() * 3) - 1;
    state.membershipDistribution.premium = Math.max(10, state.membershipDistribution.premium + shift());
    state.membershipDistribution.standard = Math.max(10, state.membershipDistribution.standard + shift());
    state.membershipDistribution.basic = Math.max(10, state.membershipDistribution.basic + shift());
    state.membershipDistribution.trial = Math.max(5, state.membershipDistribution.trial + shift());
  },

  setRealtimeState: (realtimeObj) => {
    state.realtimeState = realtimeObj;
  },

  setMembershipDistribution: (distObj) => {
    state.membershipDistribution = distObj;
  },

  // Chart data
  getChartData: async (type, view) => {
    const cacheKey = `${type}_${view}`;
    if (!state.chartData[cacheKey]) {
      state.chartData[cacheKey] = fetchChartDataSync(type, view, state.currentMemberId);
    }
    return state.chartData[cacheKey];
  },

  // Actions with background backend synchronization
  addBooking: (classObj) => {
    const newBooking = {
      id: "BK-" + Math.floor(Math.random() * 900 + 100),
      class: classObj.name,
      trainer: classObj.trainer,
      date: classObj.date,
      time: classObj.time,
      status: "confirmed"
    };

    state.bookings.unshift(newBooking);
    
    const newNotif = {
      id: Date.now(),
      type: "reminder",
      message: `Booked: ${classObj.name} with ${classObj.trainer} for ${classObj.date} at ${classObj.time}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    state.notifications.unshift(newNotif);

    // Sync in background
    if (isBackendAvailable) {
      fetch(`/api/user/${state.currentMemberId}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: classObj.name,
          trainer: classObj.trainer,
          date: classObj.date,
          time: classObj.time
        })
      }).then(r => r.json())
        .then(res => {
          if (res.success) {
            newBooking.id = res.booking.id;
          }
        }).catch(err => console.error('[API] Error syncing booking:', err));
    } else {
      syncStateToStorage();
    }

    return newBooking;
  },

  cancelBooking: (bookingId) => {
    const bookingIndex = state.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      const removed = state.bookings.splice(bookingIndex, 1)[0];
      
      const newNotif = {
        id: Date.now(),
        type: "reminder",
        message: `Cancelled: ${removed.class} with ${removed.trainer}`,
        read: false,
        timestamp: new Date().toISOString()
      };
      state.notifications.unshift(newNotif);

      // Sync in background
      if (isBackendAvailable) {
        fetch(`/api/user/${state.currentMemberId}/booking/${bookingId}`, {
          method: 'DELETE'
        }).catch(err => console.error('[API] Error canceling booking:', err));
      } else {
        syncStateToStorage();
      }
      return true;
    }
    return false;
  },

  deductPoints: (amount, action) => {
    if (state.points.current >= amount) {
      state.points.current -= amount;
      
      state.points.history.unshift({
        date: new Date().toISOString().split('T')[0],
        action: action,
        points: -amount
      });

      if (state.points.current < 400) state.points.tier = "Bronze";
      else if (state.points.current < 1200) state.points.tier = "Silver";
      else if (state.points.current < 3000) state.points.tier = "Gold";
      else state.points.tier = "Platinum";

      // Sync in background
      if (isBackendAvailable) {
        fetch(`/api/user/${state.currentMemberId}/points`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: -amount, action })
        }).catch(err => console.error('[API] Error syncing points deduction:', err));
      } else {
        syncStateToStorage();
      }
      return true;
    }
    return false;
  },

  addPoints: (amount, action) => {
    state.points.current += amount;
    state.points.lifetime += amount;

    state.points.history.unshift({
      date: new Date().toISOString().split('T')[0],
      action: action,
      points: amount
    });

    if (state.points.current >= 3000) state.points.tier = "Platinum";
    else if (state.points.current >= 1200) state.points.tier = "Gold";
    else if (state.points.current >= 400) state.points.tier = "Silver";
    else state.points.tier = "Bronze";

    // Sync in background
    if (isBackendAvailable) {
      fetch(`/api/user/${state.currentMemberId}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, action })
      }).catch(err => console.error('[API] Error syncing points addition:', err));
    } else {
      syncStateToStorage();
    }
  },

  updateProfile: (firstName, lastName, email, phone) => {
    state.member.name = `${firstName} ${lastName}`;
    state.member.email = email;
    state.member.phone = phone;

    // Sync in background
    if (isBackendAvailable) {
      fetch(`/api/user/${state.currentMemberId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone })
      }).catch(err => console.error('[API] Error syncing profile details:', err));
    } else {
      syncStateToStorage();
    }
  },

  markRead: (id) => {
    const n = state.notifications?.find(n => n.id === id);
    if (n) {
      n.read = true;
      
      // Sync in background
      if (isBackendAvailable) {
        fetch(`/api/user/${state.currentMemberId}/notifications/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notifId: id })
        }).catch(err => console.error('[API] Error syncing notification status:', err));
      } else {
        syncStateToStorage();
      }
    }
  },

  clearNotifications: () => {
    state.notifications = [];
    
    // Sync in background
    if (isBackendAvailable) {
      fetch(`/api/user/${state.currentMemberId}/notifications/clear`, {
        method: 'POST'
      }).catch(err => console.error('[API] Error clearing notifications:', err));
    } else {
      syncStateToStorage();
    }
  },

  // Save full simulated state (e.g. days decayed, point ticks) to server
  save: () => {
    if (isBackendAvailable) {
      fetch(`/api/user/${state.currentMemberId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysRemaining: state.membership.daysRemaining,
          status: state.membership.status,
          sessions: state.stats.totalSessions,
          calories: state.stats.caloriesBurned,
          points: state.points.current,
          tier: state.points.tier
        })
      }).catch(err => console.error('[API] Error saving synced state:', err));
    } else {
      syncStateToStorage();
    }
  }
};

export default API;
export { API };
