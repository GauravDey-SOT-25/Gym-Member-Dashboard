// js/perks.js

import API from './data.js';

// Fallback toast trigger
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

const REWARDS_STORE = [
    { id: "R-01", name: "Free Protein Shake", desc: "Redeem for any whey/vegan shaker drink at our juice bar.", cost: 150, icon: "ph ph-cup" },
    { id: "R-02", name: "FitMatrix Gym Bag", desc: "Waterproof sports duffle with shoe compartment.", cost: 350, icon: "ph ph-backpack" },
    { id: "R-03", name: "1-on-1 PT Session", desc: "Private 60-minute training session with any available coach.", cost: 500, icon: "ph ph-users" },
    { id: "R-04", name: "1 Month Extension", desc: "Add 30 days to your current active membership plan.", cost: 1000, icon: "ph ph-calendar-plus" }
];

export function renderPerksTab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="view-header">
            <h1>Loyalty Perks</h1>
            <p>Earn reward points during your workouts and redeem them for premium items.</p>
        </div>

        <div class="perks-layout">
            <!-- Left Side: Rewards Store -->
            <div>
                <h2 class="mb-20">Rewards Store</h2>
                <div class="rewards-grid" id="rewards-store-grid">
                    <!-- Render store cards -->
                </div>
            </div>

            <!-- Right Side: Points Status & History Ledger -->
            <div>
                <!-- Points Card -->
                <div class="ledger-card mb-20">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                        <div>
                            <span class="card-title" style="font-size: 12px;">Loyalty Status</span>
                            <h2 style="font-size: 28px; margin-top: 4px;" id="perks-points-value">0 pts</h2>
                        </div>
                        <span class="class-badge premium" id="perks-points-tier" style="font-size: 11px;">Gold Tier</span>
                    </div>
                    <div class="divider"></div>
                    <div style="font-size: 13px; color: var(--text-secondary);" id="perks-progress-info">
                        Loading tier status...
                    </div>
                </div>

                <!-- Ledger History -->
                <div class="ledger-card">
                    <h2>Points Ledger Logs</h2>
                    <div class="ledger-list" id="perks-ledger-list">
                        <!-- Render ledger history logs -->
                    </div>
                </div>
            </div>
        </div>
    `;

    renderRewardsGrid();
    renderLedgerLogs();
}

function renderRewardsGrid() {
    const grid = document.getElementById('rewards-store-grid');
    if (!grid) return;

    const points = API.getPoints();
    const userPoints = points ? points.current : 0;

    grid.innerHTML = REWARDS_STORE.map(reward => {
        const canAfford = userPoints >= reward.cost;
        return `
            <div class="reward-card">
                <div>
                    <div class="reward-icon-box">
                        <i class="${reward.icon}"></i>
                    </div>
                    <div class="reward-info">
                        <h3>${reward.name}</h3>
                        <p>${reward.desc}</p>
                    </div>
                </div>
                <div class="reward-action-row">
                    <span class="reward-cost">${reward.cost} pts</span>
                    <button class="btn-redeem" data-reward-id="${reward.id}" ${canAfford ? '' : 'style="opacity: 0.5;"'}>
                        Redeem
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Wire up buttons
    const redeemButtons = grid.querySelectorAll('.btn-redeem');
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const rewardId = btn.getAttribute('data-reward-id');
            const rewardObj = REWARDS_STORE.find(r => r.id === rewardId);
            
            if (rewardObj) {
                const points = API.getPoints();
                if (points.current < rewardObj.cost) {
                    triggerGlobalToast("Insufficient points balance.", true);
                    return;
                }

                // Deduct points
                const success = API.deductPoints(rewardObj.cost, `Redeemed: ${rewardObj.name}`);
                if (success) {
                    // Visual scale flash on points
                    const pointsCardVal = document.getElementById('perks-points-value');
                    if (pointsCardVal) {
                        pointsCardVal.style.color = '#D9FF00';
                        pointsCardVal.style.transform = 'scale(1.1)';
                        pointsCardVal.style.transition = 'all 150ms ease';
                        setTimeout(() => {
                            pointsCardVal.style.color = '';
                            pointsCardVal.style.transform = '';
                        }, 800);
                    }

                    // Re-render
                    renderRewardsGrid();
                    renderLedgerLogs();
                    triggerGlobalToast(`Redeemed: ${rewardObj.name}! Check email for voucher.`);
                    
                    // Sync points count on topbar if exists
                    const topbarBadge = document.getElementById('notif-badge');
                    // (The main app controller handles this sync in our dynamic layouts)
                }
            }
        });
    });
}

function renderLedgerLogs() {
    const pointsCardVal = document.getElementById('perks-points-value');
    const pointsTier = document.getElementById('perks-points-tier');
    const progressInfo = document.getElementById('perks-progress-info');
    const ledgerList = document.getElementById('perks-ledger-list');

    const points = API.getPoints();
    if (!points) return;

    // 1. Sync active points card numbers
    if (pointsCardVal) pointsCardVal.textContent = `${points.current} pts`;
    if (pointsTier) pointsTier.textContent = `${points.tier} Tier`;
    
    if (progressInfo) {
        if (points.tier === 'Platinum') {
            progressInfo.textContent = "You are at the maximum tier status level! Enjoy supreme perks.";
        } else {
            const diff = points.nextTierAt - points.current;
            progressInfo.textContent = `Earn ${diff} more points to unlock ${points.tier === 'Gold' ? 'Platinum' : (points.tier === 'Silver' ? 'Gold' : 'Silver')} Tier benefits.`;
        }
    }

    // 2. Render ledger log transactions
    if (!ledgerList) return;

    if (!points.history || points.history.length === 0) {
        ledgerList.innerHTML = `<div class="empty-state">No transactions recorded.</div>`;
        return;
    }

    ledgerList.innerHTML = points.history.map(item => {
        const isDeduction = item.points < 0;
        const sign = isDeduction ? '' : '+';
        const cssClass = isDeduction ? 'negative' : 'positive';
        
        return `
            <div class="ledger-item">
                <div class="ledger-item-desc">
                    <strong>${item.action}</strong>
                    <span>${item.date}</span>
                </div>
                <div class="ledger-points ${cssClass}">
                    ${sign}${item.points} pts
                </div>
            </div>
        `;
    }).join('');
}

// Public API triggers to sync this tab dynamically when points change in background
export function refreshPerksTabUI() {
    // Re-render components with latest API values
    renderRewardsGrid();
    renderLedgerLogs();
}
