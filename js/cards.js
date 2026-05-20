// cards.js
import { API } from './data.js';

export function renderCards(containerElement) {
  const membershipStatus = API.getMembership();
  const activityStats = API.getStats();
  const loyaltyPoints = API.getPoints();

  const membershipCardsData = [
    {
      title: "Active Plan",
      value: membershipStatus.plan,
      status: membershipStatus.status,
      subtitle: `₹${membershipStatus.price}/month`
    },
    {
      title: "Membership Expiry",
      value: membershipStatus.expiryDate,
      status: membershipStatus.status,
      subtitle: `${membershipStatus.daysRemaining} days remaining`
    },
    {
      title: "Total Sessions",
      value: activityStats.totalSessions,
      status: "active",
      subtitle: `${activityStats.sessionsThisMonth} this month`
    },
    {
      title: "Reward Points",
      value: loyaltyPoints.current,
      status: "active",
      subtitle: `${loyaltyPoints.tier} Tier`
    }
  ];

  const cardsHtml = membershipCardsData.map(card => {
    // Ensure valid status class
    const statusClass = card.status ? card.status.toLowerCase() : 'active';
    
    return `
      <div class="membership-card">
        <div class="card-header">
          <span class="card-title">${card.title}</span>
          <span class="status-indicator ${statusClass}" title="Status: ${card.status}"></span>
        </div>
        <div class="card-value">${card.value}</div>
        <div class="card-subtitle">${card.subtitle}</div>
      </div>
    `;
  }).join('');

  containerElement.innerHTML = `
    <h2 class="section-heading">Overview</h2>
    <div class="membership-cards-grid">
      ${cardsHtml}
    </div>
  `;
}
