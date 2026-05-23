// js/app.js
import { createNavigation } from './navigation.js';
import { renderCards } from './cards.js';
import { startRealtimeUpdates } from './realtime.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="dashboard-layout">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="dashboard-content" id="dashboardContent"></main>
  </div>
  <div class="floating-dock" id="floatingDock"></div>
`;

// Initialize structural components layout frames
createNavigation();

const dashboardContent = document.getElementById('dashboardContent');
if (dashboardContent) {
  renderCards(dashboardContent);
  
  // Initialize your real-time tracking update channel
  startRealtimeUpdates((updatePackage) => {
    if (updatePackage.success) {
      updateLiveDashboardUI(updatePackage.data, updatePackage.data.animatePoints);
    }
  });
}

/**
 * Sweeps the DOM to update texts and styles cleanly without a full page redraw
 */
function updateLiveDashboardUI(liveData, shouldAnimatePoints) {
  const expiryCard = document.querySelector('[data-card-id="expiry"]');
  const sessionsCard = document.querySelector('[data-card-id="sessions"]');
  const pointsCard = document.querySelector('[data-card-id="points"]');

  // A. Update precise real-time Membership countdown days remaining
  if (expiryCard) {
    const subtitleNode = expiryCard.querySelector('[data-metric="subtitle"]');
    const indicatorNode = expiryCard.querySelector('.status-indicator');

    if (subtitleNode) {
      // Use Math.ceil to smoothly parse precision fractional remaining time balances into rounded days strings
      const displayDaysLeft = Math.ceil(liveData.membership.daysRemaining);
      subtitleNode.textContent = `${displayDaysLeft} days remaining`;
    }
    if (indicatorNode) {
      indicatorNode.className = `status-indicator ${liveData.membership.status}`;
    }
  }

  // B. Update Session logs exactly as structured in the data layer (No random numbers)
  if (sessionsCard) {
    const valueNode = sessionsCard.querySelector('[data-metric="value"]');
    const subtitleNode = sessionsCard.querySelector('[data-metric="subtitle"]');
    
    if (valueNode) valueNode.textContent = liveData.stats.totalSessions;
    if (subtitleNode) subtitleNode.textContent = `${liveData.stats.sessionsThisMonth} this month`;
  }

  // C. Update Reward Points display and run brief green text transformations on mutation flags
  if (pointsCard) {
    const valueNode = pointsCard.querySelector('[data-metric="value"]');
    if (valueNode) {
      valueNode.textContent = liveData.points.current;
      
      if (shouldAnimatePoints) {
        valueNode.style.color = 'var(--primary-accent)';
        valueNode.style.transform = 'scale(1.06)';
        valueNode.style.transition = 'all 150ms ease';
        
        // Clear classes shortly after text transition wraps up
        setTimeout(() => {
          valueNode.style.color = 'var(--text-primary)';
          valueNode.style.transform = 'scale(1)';
        }, 1000);
      }
    }
  }

  // D. Signal chart instances to safely sync layout configurations
  if (window.myWeeklyChartInstance) {
    window.myWeeklyChartInstance.update('none');
  }
}