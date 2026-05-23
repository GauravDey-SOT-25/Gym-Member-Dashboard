// js/realtime.js
import { API } from "./data.js";

// Grab internal live references directly from the data layer API
const membership = API.getMembership();
const stats = API.getStats();
const points = API.getPoints();
const realtime = API.getRealtimeState();
const weeklySessionsChart = API.getChartData("sessions", "weekly");

// Cache the original baseline values at session startup to calculate precise real-time decay
const INITIAL_DAYS_REMAINING = membership.daysRemaining;
const SESSION_START_TIMESTAMP = Date.now();

// Definition constants tracking time configurations
const MS_PER_REAL_DAY = 24 * 60 * 60 * 1000; // 86,400,000 ms in a standard 24-hour day

// Local memory tracker to observe variance in point values over time
let lastKnownPoints = points.current;

/**
 * Starts the central background checking loop intervals
 * @param {Function} callback - Broadcasts updated data frames directly to app.js
 */
export function startRealtimeUpdates(callback) {
    setInterval(() => {
        
        // ====================================================
        // 1. CALCULATE TRUE REAL-TIME MEMBERSHIP DEGRADATION
        // ====================================================
        const totalMillisecondsElapsed = Date.now() - SESSION_START_TIMESTAMP;
        const fractionalDaysElapsed = totalMillisecondsElapsed / MS_PER_REAL_DAY;
        
        // Deduct the fractional days precisely from the starting baseline
        let calculatedDaysLeft = INITIAL_DAYS_REMAINING - fractionalDaysElapsed;

        // Force boundary limit constraints to prevent dipping below zero
        if (calculatedDaysLeft < 0) {
            calculatedDaysLeft = 0;
        }

        // Update the database state field with the precise floating-point values
        membership.daysRemaining = calculatedDaysLeft;

        // Map status tags conditionally based on exact countdown boundaries
        if (membership.daysRemaining <= 7 && membership.daysRemaining > 0) {
            membership.status = "expiring_soon";
        } else if (membership.daysRemaining === 0) {
            membership.status = "expired";
        } else {
            membership.status = "active";
        }

        // ====================================================
        // 2. MONITOR REWARD POINTS (Calculate variance for flashing animation)
        // ====================================================
        let animatePointsFlag = false;
        if (points.current > lastKnownPoints) {
            animatePointsFlag = true;
            lastKnownPoints = points.current; // Sync up internal tracker memory
        }

        // ====================================================
        // 3. REFLECT CHART ATTENDANCE ACCORDING TO DATA STATE
        // ====================================================
        // Maps the active chart day dataset directly to whether the user has a current streak active
        if (weeklySessionsChart && weeklySessionsChart.datasets && weeklySessionsChart.datasets[0]) {
            const lastIndex = weeklySessionsChart.datasets[0].data.length - 1;
            weeklySessionsChart.datasets[0].data[lastIndex] = stats.currentStreak > 0 ? 1 : 0;
        }

        // ====================================================
        // 4. BROADCAST COMPLETE DETERMINISTIC STREAM TO UI
        // ====================================================
        callback({
            success: true,
            data: {
                membership: membership,
                stats: stats,
                points: points,
                realtime: realtime,
                chart: weeklySessionsChart,
                animatePoints: animatePointsFlag // Tells app.js whether to fire the CSS pulse effect
            }
        });

    }, 5000); // 5-Second Interval Tick
}