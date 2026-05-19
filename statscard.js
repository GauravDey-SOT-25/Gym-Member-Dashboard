// CREATING CARDS
export function createCard(stat) {
  const trendIcon =
    stat.trendType === "positive"
      ? "trending-up"
      : "trending-down";

  return `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-title">${stat.title}</span>
        <div class="icon-wrapper ${stat.color}">
          <i data-lucide="${stat.icon}"></i>
        </div>
      </div>
      <div class="stat-value">
        ${stat.value}
      </div>
      <div class="stat-footer">
        <span class="trend ${stat.trendType}">
          <i data-lucide="${trendIcon}"></i>
          ${stat.trend}
        </span>
        <span class="trend-label">
        </span>
      </div>
    </div>
  `;
}

// Helper to render the stats array into the DOM
function renderStatsToDOM(statsGrid, activityStats) {
  const stats = [
    {
      title: "Total Sessions",
      value: activityStats.totalSessions,
      icon: "activity",
      color: "blue",
      trend: `This Month: ${activityStats.sessionsThisMonth} `,
      trendType: "positive"
    },
    {
      title: "Current Streak",
      value: `${activityStats.currentStreak} Days`,
      icon: "flame",
      color: "orange",
      trend: `Best: ${activityStats.longestStreak || 12} days`,
      trendType: "positive"
    },
    {
      title: "Average Duration",
      value: `${activityStats.avgSessionDuration || 45} min`,
      icon: "timer",
      color: "purple",
      trend: "Per workout",
      trendType: "positive"
    },
    {
      title: "Calories Burned",
      value: activityStats.caloriesBurned.toLocaleString(),
      icon: "zap",
      color: "yellow",
      trend: "Lifetime",
      trendType: "positive"
    },
    {
      title: "Last Visit",
      value: activityStats.lastVisit,
      icon: "calendar",
      color: "teal",
      trend: "Most recent",
      trendType: "positive"
    }
  ];

  statsGrid.innerHTML = '';
  stats.forEach((stat) => {
    statsGrid.innerHTML += createCard(stat);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Initialize and render stats cards
async function renderStatsCards() {
  const statsGrid = document.getElementById('stats-grid');
  
  if (!statsGrid) return;
  
  // Show loading state
  statsGrid.innerHTML = '<div style="color: white; padding: 20px;">Loading stats...</div>';

  // Wait for the global API to be available
  if (typeof window.API === 'undefined' && typeof API === 'undefined') {
    statsGrid.innerHTML = '<div style="color: red; padding: 20px;">Error: Backend API not found! Make sure data.js is loaded.</div>';
    return;
  }

  // The API is loaded from data.js
  const backendAPI = typeof API !== 'undefined' ? API : window.API;
  
  // Make API explicitly available on window so the importmap in index.html can access it
  window.API = backendAPI;

  // Initialize the backend API
  await backendAPI.init();
  
  // Start backend's internal realtime polling for live data if needed
  backendAPI.startRealtime();

  // Fetch initial stats from backend state
  const activityStats = backendAPI.getStats();

  if (!activityStats) {
    statsGrid.innerHTML = '<div style="color: red; padding: 20px;">Error loading stats.</div>';
    return;
  }

  // Initial render
  renderStatsToDOM(statsGrid, activityStats);

  // PREPARE FOR REALTIME.JS
  // realtime.js has a bug where it expects getChartData to be synchronous.
  // Since we cannot modify realtime.js, we will monkey-patch the API here 
  // to return the chart data synchronously just for realtime.js.

  try {
    const chartData = await backendAPI.getChartData("sessions", "weekly");
    const originalGetChartData = backendAPI.getChartData;
    
    // Monkey-patch getChartData on window.API so realtime.js gets the synchronous mock
    window.API.getChartData = (type, view) => {
      if (type === "sessions" && view === "weekly") {
        return chartData; // Return synchronously!
      }
      return originalGetChartData(type, view);
    };

    // Dynamically import realtime.js AFTER API is initialized and patched
    const { startRealtimeUpdates } = await import('./realtime.js');
    
    // Hook up the realtime updates to re-render dynamically
    startRealtimeUpdates((update) => {
      if (update && update.success && update.data && update.data.stats) {
        renderStatsToDOM(statsGrid, update.data.stats);
      }
    });
  } catch (err) {
    console.error("Failed to load realtime updates:", err);
  }
}

// Execute on load
renderStatsCards();
