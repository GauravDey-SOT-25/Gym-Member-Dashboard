// js/bookings.js

import API from './data.js';

// Global showToast trigger fallback
const triggerGlobalToast = (message, isError = false) => {
    const toast = document.getElementById('save-toast');
    if (toast) {
        const text = toast.querySelector('span');
        if (text) text.textContent = message;
        
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = isError ? 'ph ph-x-circle' : 'ph ph-check-circle';
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

const AVAILABLE_CLASSES = [
    { id: "C-01", name: "Zumba Power", trainer: "Priya Sharma", date: "Tomorrow", time: "07:00 AM", isPremium: false },
    { id: "C-02", name: "Weight Shred", trainer: "Rohan Mehta", date: "May 28, 2026", time: "06:30 AM", isPremium: true },
    { id: "C-03", name: "Yoga Flow", trainer: "Anita Joshi", date: "May 29, 2026", time: "08:00 AM", isPremium: false },
    { id: "C-04", name: "Cardio Blitz", trainer: "Karan Singh", date: "May 30, 2026", time: "09:30 AM", isPremium: false },
    { id: "C-05", name: "Strength Core", trainer: "Vikram Nair", date: "May 31, 2026", time: "05:00 PM", isPremium: true },
    { id: "C-06", name: "Pilates Stretch", trainer: "Meera Pillai", date: "June 01, 2026", time: "11:00 AM", isPremium: false }
];

export function renderBookingsTab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="view-header">
            <h1>Class Bookings</h1>
            <p>Browse schedule times and secure slots with our certified personal trainers.</p>
        </div>

        <div class="scheduler-layout">
            <!-- Left Side: Timetable list -->
            <div>
                <h2 class="mb-20">Available Fitness Classes</h2>
                <div class="classes-grid" id="available-classes-grid">
                    <!-- Render classes -->
                </div>
            </div>

            <!-- Right Side: Active Reservations list -->
            <div class="bookings-card">
                <h2>My Active Reservations</h2>
                <div class="bookings-list" id="active-reservations-list">
                    <!-- Render reservations -->
                </div>
            </div>
        </div>
    `;

    renderClassesList();
    renderReservationsList();
}

function renderClassesList() {
    const grid = document.getElementById('available-classes-grid');
    if (!grid) return;

    grid.innerHTML = AVAILABLE_CLASSES.map(cls => `
        <div class="class-card">
            <div class="class-header">
                <span class="class-badge ${cls.isPremium ? 'premium' : ''}">
                    ${cls.isPremium ? 'PREMIUM ACCESS' : 'ALL PLANS'}
                </span>
                <span class="class-time">${cls.date} at ${cls.time}</span>
            </div>
            <div class="class-title">
                <h3>${cls.name}</h3>
                <span class="class-trainer">
                    <i class="ph ph-user"></i> Coach ${cls.trainer}
                </span>
            </div>
            <button class="btn-book" data-class-id="${cls.id}">
                Book Session
            </button>
        </div>
    `).join('');

    // Wire up booking buttons
    const bookButtons = grid.querySelectorAll('.btn-book');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const classId = btn.getAttribute('data-class-id');
            const classObj = AVAILABLE_CLASSES.find(c => c.id === classId);
            
            if (classObj) {
                // Check if user already booked this class name
                const activeBookings = API.getBookings();
                const alreadyBooked = activeBookings.some(b => b.class === classObj.name);

                if (alreadyBooked) {
                    triggerGlobalToast(`You are already booked for ${classObj.name}!`, true);
                    return;
                }

                // Add booking
                API.addBooking(classObj);
                renderReservationsList();
                triggerGlobalToast(`Session booked: ${classObj.name}!`);
            }
        });
    });
}

function renderReservationsList() {
    const listContainer = document.getElementById('active-reservations-list');
    if (!listContainer) return;

    const bookings = API.getBookings();

    if (!bookings || bookings.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-calendar-x" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
                No active bookings. Book a class from the list.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-details">
                <h4>${booking.class}</h4>
                <p>with Coach ${booking.trainer}</p>
                <p style="color: var(--text-secondary); font-size: 11px;">
                    <i class="ph ph-clock"></i> ${booking.date} — ${booking.time}
                </p>
            </div>
            <button class="btn-cancel-booking" data-booking-id="${booking.id}">
                Cancel
            </button>
        </div>
    `).join('');

    // Wire up cancel buttons
    const cancelButtons = listContainer.querySelectorAll('.btn-cancel-booking');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const bookingId = btn.getAttribute('data-booking-id');
            const success = API.cancelBooking(bookingId);
            
            if (success) {
                renderReservationsList();
                triggerGlobalToast("Workout reservation cancelled.");
            }
        });
    });
}
