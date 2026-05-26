// js/analytics.js

import API from './data.js';
import { MembershipChart } from './membershipChart.js';

let activeMetric = 'sessions'; // 'sessions' or 'calories'
let activeInterval = 'weekly'; // 'weekly' or 'monthly' or 'yearly'

export function renderAnalyticsTab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stats = API.getStats();

    container.innerHTML = `
        <div class="view-header">
            <h1>Fitness Analytics</h1>
            <p>Track your workout frequency, calorie output, and activity history.</p>
        </div>

        <!-- Detailed Stats Cards -->
        <div class="stats-grid" id="detailed-stats-grid">
            <!-- Rendered dynamically below -->
        </div>

        <!-- Chart Card -->
        <div class="chart-container-card">
            <div class="chart-header">
                <div class="chart-controls">
                    <button class="chart-btn ${activeMetric === 'sessions' ? 'active' : ''}" id="btn-metric-sessions">Sessions</button>
                    <button class="chart-btn ${activeMetric === 'calories' ? 'active' : ''}" id="btn-metric-calories">Calories Burned</button>
                </div>
                <div class="chart-controls">
                    <button class="chart-btn ${activeInterval === 'weekly' ? 'active' : ''}" id="btn-interval-weekly">Weekly</button>
                    <button class="chart-btn ${activeInterval === 'monthly' ? 'active' : ''}" id="btn-interval-monthly">Monthly</button>
                    <button class="chart-btn ${activeInterval === 'yearly' ? 'active' : ''}" id="btn-interval-yearly">Yearly</button>
                </div>
            </div>
            <div class="chart-wrapper">
                <canvas id="my-activity-chart"></canvas>
            </div>
        </div>

        <!-- Gym-wide Membership Distribution Card (from mrmr folder) -->
        <div class="chart-container-card" style="margin-top: 32px;">
            <div class="chart-header">
                <div>
                    <h2>Gym Membership Distribution</h2>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">Real-time ratio of active memberships. Select segment to review share and revenue.</p>
                </div>
                <div class="chart-controls">
                    <button class="chart-btn" id="btn-membership-toggle-anim">⏸ Animation Off</button>
                    <button class="chart-btn" id="btn-membership-export">
                        <i class="ph ph-download-simple"></i> Export PNG
                    </button>
                </div>
            </div>
            
            <div class="membership-chart-section">
                <!-- Doughnut Chart Wrapper -->
                <div class="membership-chart-wrapper-container">
                    <div class="doughnut-wrapper">
                        <canvas id="membershipDoughnutChart"></canvas>
                        <div id="chartLoading" class="chart-loading-overlay">
                            <i class="ph ph-spinner ph-spin" style="font-size: 24px;"></i>
                        </div>
                    </div>
                    <div id="legendItems" class="membership-legend-container"></div>
                </div>

                <!-- Stats mini grid -->
                <div id="statsGrid" class="membership-stats-mini-grid"></div>
            </div>
        </div>
    `;

    renderDetailedStatsGrid();
    initActivityChart();
    setupChartControlListeners();

    // Initialize membership distribution doughnut chart
    destroyMembershipChart();
    window.myMembershipChartInstance = new MembershipChart('membershipDoughnutChart');
    setupMembershipChartControls();
}

function renderDetailedStatsGrid() {
    const grid = document.getElementById('detailed-stats-grid');
    if (!grid) return;

    const stats = API.getStats();

    const cardDetails = [
        {
            title: "Total Sessions",
            value: stats.totalSessions,
            icon: "ph-fill ph-activity",
            color: "blue",
            trend: `This month: ${stats.sessionsThisMonth}`,
        },
        {
            title: "Current Streak",
            value: `${stats.currentStreak} Days`,
            icon: "ph-fill ph-fire",
            color: "orange",
            trend: `Best: ${stats.longestStreak} days`,
        },
        {
            title: "Average Duration",
            value: `${stats.avgSessionDuration} Min`,
            icon: "ph-fill ph-timer",
            color: "purple",
            trend: "Average per workout",
        },
        {
            title: "Calories Burned",
            value: stats.caloriesBurned.toLocaleString(),
            icon: "ph-fill ph-lightning",
            color: "yellow",
            trend: "Estimated lifetime kcal",
        },
        {
            title: "Last Workout",
            value: stats.lastVisit,
            icon: "ph-fill ph-calendar-blank",
            color: "teal",
            trend: "Check-in time",
        }
    ];

    grid.innerHTML = cardDetails.map(card => `
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">${card.title}</span>
                <div class="icon-wrapper ${card.color}">
                    <i class="${card.icon}"></i>
                </div>
            </div>
            <div class="stat-value">${card.value}</div>
            <div class="stat-footer">
                <span class="trend positive">
                    <i class="ph ph-trend-up"></i>
                </span>
                <span class="trend-label">${card.trend}</span>
            </div>
        </div>
    `).join('');
}

async function initActivityChart() {
    const canvas = document.getElementById('my-activity-chart');
    if (!canvas) return;

    // Destroy existing chart if it exists
    destroyChart();

    const rawChartData = await API.getChartData(activeMetric, activeInterval);
    if (!rawChartData) return;

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Styles tokens based on mrmr config and theme adaptation
    const gridColor = isDark ? '#222222' : '#E5E7EB';
    const textColor = isDark ? '#8A8A8A' : '#4B5563';
    
    const dsColor = rawChartData.datasets[0].color || '#6366f1';
    const dsBgColor = dsColor + "22"; // Transparent fill as in app (1).js

    const chartConfig = {
        type: 'line',
        data: {
            labels: rawChartData.labels,
            datasets: [{
                label: rawChartData.datasets[0].label,
                data: [...rawChartData.datasets[0].data],
                borderColor: dsColor,
                borderWidth: 3,
                backgroundColor: dsBgColor,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: dsColor,
                pointBorderColor: isDark ? '#000000' : '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 700,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: isDark ? '#FFFFFF' : '#111111',
                        font: { family: 'Lexend', weight: '600' }
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? '#111111' : '#FFFFFF',
                    titleColor: '#D9FF00',
                    bodyColor: isDark ? '#FFFFFF' : '#111111',
                    borderColor: isDark ? '#333333' : '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    titleFont: { family: 'Lexend', weight: '600' },
                    bodyFont: { family: 'Manrope', weight: '600' }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: { family: 'Manrope', size: 12 }
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: { family: 'Manrope', size: 12 },
                        precision: 0
                    },
                    min: 0
                }
            }
        }
    };

    window.myWeeklyChartInstance = new Chart(ctx, chartConfig);
}

export function destroyChart() {
    if (window.myWeeklyChartInstance) {
        window.myWeeklyChartInstance.destroy();
        window.myWeeklyChartInstance = null;
    }
    destroyMembershipChart();
}

export function destroyMembershipChart() {
    if (window.myMembershipChartInstance) {
        window.myMembershipChartInstance.destroy();
        window.myMembershipChartInstance = null;
    }
}

function setupMembershipChartControls() {
    const btnToggleAnim = document.getElementById('btn-membership-toggle-anim');
    const btnExport = document.getElementById('btn-membership-export');

    if (btnToggleAnim) {
        btnToggleAnim.addEventListener('click', () => {
            if (window.myMembershipChartInstance) {
                const on = window.myMembershipChartInstance.toggleAnimation();
                btnToggleAnim.textContent = on ? '✨ Toggle Animation' : '⏸ Animation Off';
            }
        });
    }

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (window.myMembershipChartInstance) {
                window.myMembershipChartInstance.exportAsImage();
            }
        });
    }
}

function setupChartControlListeners() {
    const btnSessions = document.getElementById('btn-metric-sessions');
    const btnCalories = document.getElementById('btn-metric-calories');

    const btnWeekly = document.getElementById('btn-interval-weekly');
    const btnMonthly = document.getElementById('btn-interval-monthly');
    const btnYearly = document.getElementById('btn-interval-yearly');

    if (btnSessions && btnCalories) {
        btnSessions.addEventListener('click', () => {
            if (activeMetric === 'sessions') return;
            activeMetric = 'sessions';
            btnSessions.classList.add('active');
            btnCalories.classList.remove('active');
            initActivityChart();
        });

        btnCalories.addEventListener('click', () => {
            if (activeMetric === 'calories') return;
            activeMetric = 'calories';
            btnCalories.classList.add('active');
            btnSessions.classList.remove('active');
            initActivityChart();
        });
    }

    if (btnWeekly && btnMonthly && btnYearly) {
        const updateInterval = (newInterval, activeBtn, otherBtns) => {
            if (activeInterval === newInterval) return;
            activeInterval = newInterval;
            activeBtn.classList.add('active');
            otherBtns.forEach(btn => btn.classList.remove('active'));
            initActivityChart();
        };

        btnWeekly.addEventListener('click', () => updateInterval('weekly', btnWeekly, [btnMonthly, btnYearly]));
        btnMonthly.addEventListener('click', () => updateInterval('monthly', btnMonthly, [btnWeekly, btnYearly]));
        btnYearly.addEventListener('click', () => updateInterval('yearly', btnYearly, [btnWeekly, btnMonthly]));
    }
}

// Public API updates when stats change or theme switches
export function handleThemeChangeInAnalytics() {
    if (window.myWeeklyChartInstance) {
        // Redraw chart to update axis tick and grid line colors based on new theme
        initActivityChart();
    }
    if (window.myMembershipChartInstance) {
        window.myMembershipChartInstance.init();
    }
}

export function refreshAnalyticsStatsUI() {
    renderDetailedStatsGrid();
}
