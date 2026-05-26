// js/realtime.js

import API from './data.js';

let realtimeTimer = null;
let sessionStartTimestamp = null;
let initialDaysRemaining = 0;
let eventSource = null;
let isSSEConnected = false;

const MS_PER_REAL_DAY = 24 * 60 * 60 * 1000;
// We can accelerate the decay slightly for visual effect (e.g., 0.001 day per 5 seconds)
const ACCELERATED_DECAY_RATE = 0.0001; 
const REALTIME_INTERVAL = 5000;

function connectSSE(callback) {
    if (eventSource && (eventSource.readyState === EventSource.CONNECTING || eventSource.readyState === EventSource.OPEN)) {
        return;
    }

    try {
        console.log('[SSE] Connecting to Server-Sent Events stream...');
        eventSource = new EventSource('/api/realtime');

        eventSource.onopen = () => {
            console.log('[SSE] Realtime connection established successfully.');
            isSSEConnected = true;
        };

        eventSource.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'realtime_update') {
                    API.setRealtimeState(payload.realtimeState);
                    API.setMembershipDistribution(payload.membershipDistribution);

                    // Refresh membership chart if it exists
                    if (window.myMembershipChartInstance) {
                        window.myMembershipChartInstance.refreshData();
                    }

                    // Trigger callback to update UI
                    callback({
                        success: true,
                        data: {
                            membership: API.getMembership(),
                            stats: API.getStats(),
                            points: API.getPoints(),
                            realtime: API.getRealtimeState(),
                            animatePoints: false
                        }
                    });
                }
            } catch (err) {
                console.error('[SSE] Error parsing event payload:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.warn('[SSE] Connection error occurred, falling back to local updates.', err);
            isSSEConnected = false;
        };
    } catch (error) {
        console.error('[SSE] Could not create connection:', error);
        isSSEConnected = false;
    }
}

export function startRealtimeSimulation(callback) {
    if (realtimeTimer) clearInterval(realtimeTimer);

    sessionStartTimestamp = Date.now();
    const membership = API.getMembership();
    initialDaysRemaining = membership ? membership.daysRemaining : 30;

    // Connect to Server-Sent Events stream
    connectSSE(callback);

    realtimeTimer = setInterval(() => {
        const member = API.getMember();
        if (!member) return; // Nobody is logged in

        const membership = API.getMembership();
        const stats = API.getStats();
        const points = API.getPoints();
        const realtime = API.getRealtimeState();

        let animatePointsFlag = false;

        // ====================================================
        // 1. MEMBERSHIP DAYS DECAY
        // ====================================================
        if (membership && membership.daysRemaining > 0) {
            // Precise degradation based on actual time elapsed + accelerated factor
            const timeElapsed = Date.now() - sessionStartTimestamp;
            const trueDecay = timeElapsed / MS_PER_REAL_DAY;
            const artificialDecay = (timeElapsed / 5000) * ACCELERATED_DECAY_RATE;
            
            let currentDays = initialDaysRemaining - (trueDecay + artificialDecay);
            if (currentDays < 0) currentDays = 0;
            
            membership.daysRemaining = currentDays;

            // Map status boundaries
            if (membership.daysRemaining <= 7 && membership.daysRemaining > 0) {
                membership.status = "expiring_soon";
            } else if (membership.daysRemaining === 0) {
                membership.status = "expired";
            } else {
                membership.status = "active";
            }
        }

        // ====================================================
        // 2. GYM LIVE TRAFFIC FLUCTUATION (Fallback if SSE disconnected)
        // ====================================================
        if (realtime && !isSSEConnected) {
            const shift = Math.floor(Math.random() * 5) - 2; // -2 to +2
            realtime.liveVisitors += shift;

            if (realtime.liveVisitors < 0) realtime.liveVisitors = 0;
            if (realtime.liveVisitors > realtime.maxCapacity) {
                realtime.liveVisitors = realtime.maxCapacity;
            }
        }

        // ====================================================
        // 3. LOYALTY POINTS INCREMENT (20% chance to earn 10 check-in points)
        // ====================================================
        if (points && Math.random() < 0.2) {
            const pointsEarned = 10;
            API.addPoints(pointsEarned, "Activity Streak Check-in");
            animatePointsFlag = true;

            // Randomly push a live check-in notification
            const notifications = API.getNotifications();
            if (notifications) {
                notifications.unshift({
                    id: Date.now(),
                    type: "milestone",
                    message: `You earned +10 reward points for maintaining active workout habits! 🔥`,
                    read: false,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // ====================================================
        // 4. CHART DATA SYNC (Update last index of current chart)
        // ====================================================
        if (window.myWeeklyChartInstance) {
            const chartData = window.myWeeklyChartInstance.data;
            if (chartData && chartData.datasets && chartData.datasets[0]) {
                const dataset = chartData.datasets[0].data;
                const lastIndex = dataset.length - 1;
                
                // Add a small shift to chart attendance for active feedback
                if (Math.random() < 0.4) {
                    dataset[lastIndex] = Math.max(0, dataset[lastIndex] + (Math.random() < 0.5 ? 1 : -1));
                    window.myWeeklyChartInstance.update('none');
                }
            }
        }

        // Fluctuate gym-wide membership stats and refresh doughnut chart (Fallback if SSE disconnected)
        if (!isSSEConnected) {
            API.fluctuateMembershipDistribution();
            if (window.myMembershipChartInstance) {
                window.myMembershipChartInstance.refreshData();
            }
        }

        // Save progress back to localStorage/server
        API.save();

        // ====================================================
        // 5. BROADCAST DATA FRAME TO LISTENER
        // ====================================================
        callback({
            success: true,
            data: {
                membership,
                stats,
                points,
                realtime,
                animatePoints: animatePointsFlag
            }
        });

    }, REALTIME_INTERVAL);
}

export function stopRealtimeSimulation() {
    if (realtimeTimer) {
        clearInterval(realtimeTimer);
        realtimeTimer = null;
    }
    if (eventSource) {
        try {
            eventSource.close();
        } catch (e) {
            // ignore
        }
        eventSource = null;
        isSSEConnected = false;
    }
}
