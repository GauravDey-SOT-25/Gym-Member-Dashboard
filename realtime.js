// realtime.js

import { API } from "./data.js";


// ============================================================
// REALTIME TIMER
// ============================================================

let realtimeInterval = null;



// ============================================================
// START REALTIME SIMULATION
// ============================================================

export function startRealtimeUpdates(callback) {

    // Prevent multiple intervals
    if (realtimeInterval) {

        clearInterval(realtimeInterval);

    }


    realtimeInterval = setInterval(async () => {

        try {

            // ====================================================
            // GET CURRENT ACTIVE USER STATE
            // ====================================================

            const membership = API.getMembership();

            const stats = API.getStats();

            const points = API.getPoints();

            const realtime = API.getRealtimeState();

            const weeklySessionsChart =
                await API.getChartData("sessions", "weekly");



            // ====================================================
            // SAFETY CHECK
            // ====================================================

            if (
                !membership ||
                !stats ||
                !points ||
                !realtime
            ) {

                return;

            }



            // ====================================================
            // 1. UPDATE LOYALTY POINTS
            // ====================================================

            const randomPoints =
                Math.floor(Math.random() * 20);

            if (points.current < 5000) {

                points.current += randomPoints;

                points.lifetime += randomPoints;

            }



            // ====================================================
            // 2. UPDATE LIVE VISITORS
            // ====================================================

            realtime.liveVisitors +=
                Math.floor(Math.random() * 5) - 2;


            // Prevent negative visitors
            if (realtime.liveVisitors < 0) {

                realtime.liveVisitors = 0;

            }


            // Prevent overflow
            if (
                realtime.liveVisitors >
                realtime.maxCapacity
            ) {

                realtime.liveVisitors =
                    realtime.maxCapacity;

            }



            // ====================================================
            // 3. UPDATE MEMBERSHIP DAYS
            // ====================================================

            if (membership.daysRemaining > 0) {

                membership.daysRemaining--;

            }



            // ====================================================
            // 4. UPDATE MEMBERSHIP STATUS
            // ====================================================

            if (
                membership.daysRemaining <= 7 &&
                membership.daysRemaining > 0
            ) {

                membership.status =
                    "expiring_soon";

            }

            else if (
                membership.daysRemaining === 0
            ) {

                membership.status =
                    "expired";

            }

            else {

                membership.status =
                    "active";

            }



            // ====================================================
            // 5. UPDATE ACTIVITY STATS
            // ====================================================

            const randomSessions =
                Math.floor(Math.random() * 3);

            if (stats.sessionsThisMonth < 500) {

                stats.totalSessions += randomSessions;

                stats.sessionsThisMonth += randomSessions;

            }



            // ====================================================
            // 6. UPDATE CHART DATA
            // ====================================================

            const dataset =
                weeklySessionsChart.datasets[0].data;

            const randomChartValue =
                Math.floor(Math.random() * 5);

            // Create moving live chart effect
            dataset.shift();

            dataset.push(randomChartValue);



            // ====================================================
            // 7. RANDOM MEMBER CHECK-IN STATUS
            // ====================================================

            realtime.memberCheckedIn =
                Math.random() > 0.5;



            // ====================================================
            // 8. SEND UPDATED DATA TO FRONTEND
            // ====================================================

            callback({

                success: true,

                currentUser: API.getCurrentUser(),

                timestamp: new Date().toISOString(),

                data: {

                    membership: membership,

                    stats: stats,

                    points: points,

                    realtime: realtime,

                    chart: weeklySessionsChart

                }

            });

        }

        catch (error) {

            callback({

                success: false,

                message: "Realtime update failed",

                error: error.message

            });

        }

    }, 5000);

}



// ============================================================
// STOP REALTIME SIMULATION
// ============================================================

export function stopRealtimeUpdates() {

    if (realtimeInterval) {

        clearInterval(realtimeInterval);

        realtimeInterval = null;

    }

}