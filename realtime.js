// realtime.js

import { API } from "./data.js";

// ============================================================
// GET LIVE REFERENCES FROM data.js
// ============================================================

const membership = API.getMembership();

const stats = API.getStats();

const points = API.getPoints();

const realtime = API.getRealtimeState();

const weeklySessionsChart = API.getChartData("sessions", "weekly");

// ============================================================
// START REALTIME SIMULATION
// ============================================================

export function startRealtimeUpdates(callback) {
  setInterval(() => {
    // ====================================================
    // 1. UPDATE LOYALTY POINTS
    // Add limit protection
    // ====================================================

    const randomPoints = Math.floor(Math.random() * 20);

    if (points.current < 5000) {
      points.current += randomPoints;

      points.lifetime += randomPoints;
    }

    // ====================================================
    // 2. UPDATE LIVE VISITORS
    // ====================================================

    realtime.liveVisitors += Math.floor(Math.random() * 5) - 2;

    // Prevent negative visitors
    if (realtime.liveVisitors < 0) {
      realtime.liveVisitors = 0;
    }

    // Prevent exceeding max capacity
    if (realtime.liveVisitors > realtime.maxCapacity) {
      realtime.liveVisitors = realtime.maxCapacity;
    }

    // ====================================================
    // 3. UPDATE MEMBERSHIP DAYS
    // Stop at 0
    // ====================================================

    if (membership.daysRemaining > 0) {
      membership.daysRemaining--;
    }

    // ====================================================
    // 4. UPDATE MEMBERSHIP STATUS
    // ====================================================

    if (membership.daysRemaining <= 7 && membership.daysRemaining > 0) {
      membership.status = "expiring_soon";
    } else if (membership.daysRemaining === 0) {
      membership.status = "expired";
    } else {
      membership.status = "active";
    }

    // ====================================================
    // 5. UPDATE ACTIVITY STATS
    // Add reasonable limits
    // ====================================================

    const randomSessions = Math.floor(Math.random() * 3);

    if (stats.sessionsThisMonth < 500) {
      stats.totalSessions += randomSessions;

      stats.sessionsThisMonth += randomSessions;
    }

    // ====================================================
    // 6. UPDATE WEEKLY CHART DATA
    // ====================================================

    const lastIndex = weeklySessionsChart.datasets[0].data.length - 1;

        weeklySessionsChart.datasets[0].data[lastIndex] =
        Math.floor(Math.random() * 5);

    // ====================================================
    // 7. SEND UPDATED DATA TO FRONTEND
    // ====================================================

    callback({
      success: true,

      data: {
        membership: membership,

        stats: stats,

        points: points,

        realtime: realtime,

        chart: weeklySessionsChart,
      },
    });
  }, 5000);
}
