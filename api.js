// api.js

import { API } from "./data.js";


// ============================================================
// INITIALIZE MEMBER SESSION
// Example:
// await initializeSession("MBR-003");
// ============================================================

export async function initializeSession(memberId) {

    try {

        await API.init(memberId);

        return {

            success: true,

            currentUser: API.getCurrentUser(),

            message: "Session initialized successfully"

        };

    }

    catch (error) {

        return {

            success: false,

            message: "Failed to initialize session"

        };

    }

}



// ============================================================
// FETCH MEMBER PROFILE
// ============================================================

export async function fetchMemberProfile() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getMember()

            });

        }, 1000);

    });

}



// ============================================================
// FETCH MEMBERSHIP STATUS
// ============================================================

export async function fetchMembershipStatus() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getMembership()

            });

        }, 1200);

    });

}



// ============================================================
// FETCH ACTIVITY STATS
// ============================================================

export async function fetchActivityStats() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getStats()

            });

        }, 1000);

    });

}



// ============================================================
// FETCH LOYALTY POINTS
// ============================================================

export async function fetchLoyaltyPoints() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getPoints()

            });

        }, 800);

    });

}



// ============================================================
// FETCH CHART DATA
// type → "sessions" or "calories"
// view → "weekly" | "monthly" | "yearly"
// ============================================================

export async function fetchChartData(type, view) {

    return new Promise(async (resolve, reject) => {

        setTimeout(async () => {

            try {

                const data = await API.getChartData(type, view);

                resolve({

                    success: true,

                    currentUser: API.getCurrentUser(),

                    data: data

                });

            }

            catch (error) {

                reject({

                    success: false,

                    message: "Failed to fetch chart data"

                });

            }

        }, 1500);

    });

}



// ============================================================
// FETCH BOOKINGS
// ============================================================

export async function fetchBookings() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getBookings()

            });

        }, 1000);

    });

}



// ============================================================
// FETCH NOTIFICATIONS
// ============================================================

export async function fetchNotifications() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getNotifications()

            });

        }, 700);

    });

}



// ============================================================
// FETCH UNREAD NOTIFICATION COUNT
// ============================================================

export async function fetchUnreadCount() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                currentUser: API.getCurrentUser(),

                data: API.getUnreadCount()

            });

        }, 500);

    });

}



// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================

export async function markNotificationRead(id) {

    return new Promise((resolve) => {

        setTimeout(() => {

            API.markRead(id);

            resolve({

                success: true,

                message: "Notification marked as read"

            });

        }, 500);

    });

}



// ============================================================
// FETCH ALL USERS
// Used for login/member selection screen
// ============================================================

export async function fetchAllUsers() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                data: API.getAllUsers()

            });

        }, 1000);

    });

}



// ============================================================
// FETCH REALTIME STATE
// ============================================================

export async function fetchRealtimeState() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

                data: API.getRealtimeState()

            });

        }, 500);

    });

}



// ============================================================
// START REALTIME
// ============================================================

export function startRealtimeUpdates() {

    API.startRealtime();

}



// ============================================================
// STOP REALTIME
// ============================================================

export function stopRealtimeUpdates() {

    API.stopRealtime();

}