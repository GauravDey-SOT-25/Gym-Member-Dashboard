// js/dashboard.js

import API from './data.js';

export function renderDashboardHome(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const member = API.getMember();
    const membership = API.getMembership();
    const stats = API.getStats();
    const points = API.getPoints();
    const realtime = API.getRealtimeState();

    const firstName = member?.name ? member.name.split(' ')[0] : 'Member';
    const statusClass = membership?.status ? membership.status.toLowerCase() : 'active';
    const roundedDays = membership ? Math.ceil(membership.daysRemaining) : 0;
    const capacityPercent = realtime ? (realtime.liveVisitors / realtime.maxCapacity) * 100 : 0;

    container.innerHTML = `
        <div class="view-header">
            <h1>Overview</h1>
            <p>Welcome back, ${firstName}! Here is your fitness status today.</p>
        </div>

        <!-- Gym Capacity Card -->
        <div class="gym-capacity-card">
            <div class="capacity-header">
                <div class="capacity-title">
                    <div class="pulse-dot"></div>
                    <span>Live Gym Traffic</span>
                </div>
                <strong id="live-visitors-count">${realtime ? realtime.liveVisitors : 0} / ${realtime ? realtime.maxCapacity : 80} active</strong>
            </div>
            <div class="capacity-bar-container">
                <div class="capacity-bar" id="live-visitors-bar" style="width: ${capacityPercent}%"></div>
            </div>
            <div class="capacity-info" id="live-visitors-info">
                ${getTrafficHelperText(realtime ? realtime.liveVisitors : 0)}
            </div>
        </div>

        <!-- Metric Cards Grid -->
        <div class="membership-cards-grid">
            <!-- Card 1: Active Plan -->
            <div class="membership-card" data-card-id="plan">
                <div class="card-header">
                    <span class="card-title">Active Plan</span>
                    <span class="status-indicator ${statusClass}" id="plan-status-dot" title="Status: ${membership?.status}"></span>
                </div>
                <div class="card-value" id="plan-value">${membership?.plan || 'Basic'}</div>
                <div class="card-subtitle" id="plan-subtitle">₹${membership?.price || 1499}/month</div>
            </div>

            <!-- Card 2: Membership Expiry -->
            <div class="membership-card" data-card-id="expiry">
                <div class="card-header">
                    <span class="card-title">Membership Expiry</span>
                    <span class="status-indicator ${statusClass}" id="expiry-status-dot" title="Status: ${membership?.status}"></span>
                </div>
                <div class="card-value" id="expiry-value">${membership?.expiryDate || '2026-08-01'}</div>
                <div class="card-subtitle" id="expiry-subtitle">${roundedDays} days remaining</div>
            </div>

            <!-- Card 3: Total Sessions -->
            <div class="membership-card" data-card-id="sessions">
                <div class="card-header">
                    <span class="card-title">Total Sessions</span>
                    <span class="status-indicator active"></span>
                </div>
                <div class="card-value" id="sessions-value">${stats?.totalSessions || 0}</div>
                <div class="card-subtitle" id="sessions-subtitle">${stats?.sessionsThisMonth || 0} this month</div>
            </div>

            <!-- Card 4: Reward Points -->
            <div class="membership-card" data-card-id="points">
                <div class="card-header">
                    <span class="card-title">Reward Points</span>
                    <span class="status-indicator active"></span>
                </div>
                <div class="card-value" id="points-value">${points?.current || 0}</div>
                <div class="card-subtitle" id="points-subtitle">${points?.tier || 'Bronze'} Tier</div>
            </div>
        </div>
    `;
}

export function updateDashboardHomeUI(liveData, shouldAnimatePoints) {
    // A. Update live visitors capacity bar
    const visitorsCount = document.getElementById('live-visitors-count');
    const visitorsBar = document.getElementById('live-visitors-bar');
    const visitorsInfo = document.getElementById('live-visitors-info');

    if (liveData.realtime) {
        const v = liveData.realtime.liveVisitors;
        const max = liveData.realtime.maxCapacity;
        if (visitorsCount) visitorsCount.textContent = `${v} / ${max} active`;
        if (visitorsBar) visitorsBar.style.width = `${(v / max) * 100}%`;
        if (visitorsInfo) visitorsInfo.innerHTML = getTrafficHelperText(v);
    }

    // B. Update Membership countdown
    const expiryValue = document.getElementById('expiry-value');
    const expirySubtitle = document.getElementById('expiry-subtitle');
    const expiryStatusDot = document.getElementById('expiry-status-dot');
    const planStatusDot = document.getElementById('plan-status-dot');

    if (liveData.membership) {
        const displayDaysLeft = Math.ceil(liveData.membership.daysRemaining);
        const status = liveData.membership.status.toLowerCase();
        
        if (expiryValue) expiryValue.textContent = liveData.membership.expiryDate || '2026-08-01';
        if (expirySubtitle) expirySubtitle.textContent = `${displayDaysLeft} days remaining`;
        
        if (expiryStatusDot) {
            expiryStatusDot.className = `status-indicator ${status}`;
            expiryStatusDot.title = `Status: ${liveData.membership.status}`;
        }
        if (planStatusDot) {
            planStatusDot.className = `status-indicator ${status}`;
            planStatusDot.title = `Status: ${liveData.membership.status}`;
        }
    }

    // C. Update Session logs
    const sessionsValue = document.getElementById('sessions-value');
    const sessionsSubtitle = document.getElementById('sessions-subtitle');
    if (liveData.stats) {
        if (sessionsValue) sessionsValue.textContent = liveData.stats.totalSessions;
        if (sessionsSubtitle) sessionsSubtitle.textContent = `${liveData.stats.sessionsThisMonth} this month`;
    }

    // D. Update Reward Points display and run brief green text transformations on mutation flags
    const pointsValue = document.getElementById('points-value');
    const pointsSubtitle = document.getElementById('points-subtitle');
    
    if (liveData.points) {
        if (pointsValue) {
            pointsValue.textContent = liveData.points.current;
            
            if (shouldAnimatePoints) {
                pointsValue.style.color = '#D9FF00';
                pointsValue.style.transform = 'scale(1.08)';
                pointsValue.style.transition = 'all 150ms ease';
                
                setTimeout(() => {
                    pointsValue.style.color = '';
                    pointsValue.style.transform = 'scale(1)';
                }, 1000);
            }
        }
        if (pointsSubtitle) pointsSubtitle.textContent = `${liveData.points.tier} Tier`;
    }
}

// Helpers for Traffic messages
function getTrafficHelperText(visitors) {
    if (visitors < 20) {
        return `<span class="text-success"><i class="ph ph-trend-down"></i> Gym traffic is very low now. Excellent time for a quiet workout!</span>`;
    } else if (visitors < 50) {
        return `<span class="text-success"><i class="ph ph-check"></i> Gym traffic is moderate. Most equipment and racks are free.</span>`;
    } else if (visitors < 70) {
        return `<span style="color: var(--warning)"><i class="ph ph-trend-up"></i> Gym traffic is high. Racks and trainers are busy.</span>`;
    } else {
        return `<span class="text-danger"><i class="ph ph-warning"></i> Gym capacity is almost full. Equipment wait times might apply.</span>`;
    }
}
