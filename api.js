// api.js

import { API } from "./data.js";


// ============================================================
// FETCH MEMBER PROFILE
// ============================================================

export async function fetchMemberProfile() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({

                success: true,

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

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            try {

                const data = API.getChartData(type, view);

                resolve({

                    success: true,

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

                data: API.getUnreadCount()

            });

        }, 500);

    });

}
