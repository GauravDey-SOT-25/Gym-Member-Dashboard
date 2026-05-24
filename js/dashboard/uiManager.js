/* Interactive Gym Dashboard Event and Render Engines */
import { getUserData, saveUserData } from "../storage.js";
import { REWARD_STORE_ITEMS, HEALTH_TIPS } from "../constants.js";

// Active Panel Routing
export function initViewRouter() {
  const navLinks = document.querySelectorAll(".nav-link");
  const viewPanels = document.querySelectorAll(".view-panel");
  const topbarTitle = document.getElementById("topbar-view-title");
  const topbarSubtitle = document.getElementById("topbar-view-subtitle");

  const subtitles = {
    overview: "Company-style modular theme system",
    analytics: "Deep-dive workout metrics and logs compilation",
    membership: "Manage your active subscription plan options",
    rewards: "Claim health benefits with your accumulated activity rewards",
    settings: "Configure profile credentials and metabolic workout goals"
  };

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-view");

      // Update Nav active style
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Update Active Views
      viewPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `view-${targetView}`) {
          panel.classList.add("active");
        }
      });

      // Update Topbar Title text
      topbarTitle.textContent = link.textContent.trim();
      topbarSubtitle.textContent = subtitles[targetView] || "";

      // Smooth scroll main panel to top
      document.getElementById("dashboard-main").scrollTop = 0;
    });
  });
}

// Visual Toast System
export function showToast(message, type = "success") {
  const container = document.getElementById("toast-notification-area");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast`;
  
  // Icon based on type/message content
  let icon = "🔔";
  if (message.includes("Workout") || message.includes("logged")) icon = "💪";
  if (message.includes("Redeemed") || message.includes("Points")) icon = "🎁";
  if (message.includes("Membership") || message.includes("Plan")) icon = "⭐";
  if (message.includes("Settings") || message.includes("saved")) icon = "💾";

  toast.innerHTML = `
    <span>${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3s
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 3500);
}

// Render dynamic elements
export function renderDashboard() {
  const data = getUserData();

  // 1. Sidebar profile and titles
  document.getElementById("sidebar-display-name").textContent = data.name;
  document.getElementById("sidebar-membership-tier").textContent = `${data.membershipTier} Member`;
  document.getElementById("sidebar-avatar").textContent = data.name ? data.name[0].toUpperCase() : "G";

  // 2. Headings & Names
  const greetings = document.querySelectorAll(".user-display-name");
  greetings.forEach(elem => {
    elem.textContent = data.name;
  });

  // 3. Overview Grid Metrics
  document.getElementById("metric-membership-plan").textContent = data.membershipTier;
  document.getElementById("metric-total-sessions").textContent = data.workouts.length;
  document.getElementById("metric-reward-points").textContent = data.points.toLocaleString();
  document.getElementById("rewards-view-points").textContent = `${data.points.toLocaleString()} pts`;

  // 4. Workout Logs Rendering
  renderWorkoutLogs(data.workouts);

  // 5. Goal progress tracking calculation
  renderWeeklyGoalTracker(data);

  // 6. Analytics values
  renderAnalytics(data);

  // 7. Rewards list
  renderRewardsStoreList(data);

  // 8. Plan active card highlighting
  renderMembershipPlans(data.membershipTier);
}

// Format Timestamps
function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  
  // Checking if today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

// Render workout items lists in Overview and Analytics
function renderWorkoutLogs(workouts) {
  const overviewList = document.getElementById("recent-workouts-list");
  const analyticsList = document.getElementById("analytics-workouts-list");
  
  if (!overviewList || !analyticsList) return;

  // Sorting workouts descending by date
  const sorted = [...workouts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Quick activity labels and emojis configurations
  const activityMetadata = {
    Strength: { icon: "🏋️", colorClass: "strength" },
    Cardio: { icon: "🏃", colorClass: "cardio" },
    Crossfit: { icon: "⚡", colorClass: "crossfit" }
  };

  const buildHtml = (list) => {
    if (list.length === 0) {
      return `
        <div style="text-align: center; color: var(--text-muted); padding: 24px 0; font-size: 14px;">
          No workouts registered yet. Click "Log New Workout" to start tracking!
        </div>
      `;
    }
    return list.map(workout => {
      const meta = activityMetadata[workout.type] || { icon: "💪", colorClass: "generic" };
      return `
        <div class="history-item">
          <div class="history-meta">
            <div class="history-icon-circle">${meta.icon}</div>
            <div class="history-info">
              <h5>${workout.name}</h5>
              <p>${workout.type} &bull; ${formatDate(workout.timestamp)}</p>
            </div>
          </div>
          <div class="history-data">
            <div class="history-val">${workout.duration} min</div>
            <div class="history-duration">&#9829; ${workout.heartRate} BPM &bull; +${workout.pointsEarned} pts</div>
          </div>
        </div>
      `;
    }).join("");
  };

  overviewList.innerHTML = buildHtml(sorted.slice(0, 3));
  analyticsList.innerHTML = buildHtml(sorted);
}

// Goal and progress bar
function renderWeeklyGoalTracker(data) {
  const sessionsCount = data.workouts.length;
  const goalCount = data.weeklyGoal || 5;
  const progressPercent = Math.min(100, Math.round((sessionsCount / goalCount) * 100));

  document.getElementById("label-weekly-sessions-progress").textContent = `${sessionsCount} of ${goalCount} (${progressPercent}%)`;
  document.getElementById("bar-weekly-sessions").style.width = `${progressPercent}%`;

  // Reward targets progress
  const points = data.points;
  const nextTarget = 1500;
  const pointsPercent = Math.min(100, Math.round((points / nextTarget) * 100));

  document.getElementById("label-points-progress").textContent = `${points.toLocaleString()} / ${nextTarget.toLocaleString()} pts`;
  document.getElementById("bar-points-target").style.width = `${pointsPercent}%`;

  // Rotate helpful suggestions
  const tipContainer = document.getElementById("dynamic-health-tip");
  if (tipContainer) {
    const seed = data.workouts.length % HEALTH_TIPS.length;
    tipContainer.textContent = `"${HEALTH_TIPS[seed]}"`;
  }
}

// Compute values for calories / durations analytics tab
function renderAnalytics(data) {
  const burnContainer = document.getElementById("analytics-burned-calories");
  const intensityContainer = document.getElementById("analytics-avg-intensity");

  if (!burnContainer || !intensityContainer) return;

  const totalSessions = data.workouts.length;

  if (totalSessions === 0) {
    burnContainer.textContent = "0 kcal";
    intensityContainer.textContent = "No Workouts Logged";
    
    document.getElementById("split-cardio-text").textContent = "0 Sessions (0%)";
    document.getElementById("split-cardio-bar").style.width = "0%";
    
    document.getElementById("split-strength-text").textContent = "0 Sessions (0%)";
    document.getElementById("split-strength-bar").style.width = "0%";

    document.getElementById("split-crossfit-text").textContent = "0 Sessions (0%)";
    document.getElementById("split-crossfit-bar").style.width = "0%";
    return;
  }

  // Energy computations: average 500 kcal for Cardio, 400 kcal for Strength, 600 kcal for Crossfit
  let totalCalories = 0;
  let cardioCount = 0;
  let strengthCount = 0;
  let crossfitCount = 0;
  let totalBpm = 0;

  data.workouts.forEach(w => {
    totalBpm += w.heartRate;
    if (w.type === "Cardio") {
      totalCalories += w.duration * 11; // 11 calories/minute
      cardioCount++;
    } else if (w.type === "Strength") {
      totalCalories += w.duration * 8;  // 8 calories/minute
      strengthCount++;
    } else if (w.type === "Crossfit") {
      totalCalories += w.duration * 13; // 13 calories/minute
      crossfitCount++;
    }
  });

  const avgBpm = Math.round(totalBpm / totalSessions);
  let intensityLevel = "Low Intensity";
  if (avgBpm > 150) intensityLevel = "Elite Intensity 🔥";
  else if (avgBpm > 135) intensityLevel = "High Intensity ⚡";
  else if (avgBpm > 115) intensityLevel = "Moderate Fitness 👍";

  burnContainer.textContent = `${Math.round(totalCalories).toLocaleString()} kcal`;
  intensityContainer.textContent = `${intensityLevel} (${avgBpm} avg BPM)`;

  // Progress Bar splits
  const getPercent = (count) => Math.round((count / totalSessions) * 100);
  
  document.getElementById("split-cardio-text").textContent = `${cardioCount} Sessions (${getPercent(cardioCount)}%)`;
  document.getElementById("split-cardio-bar").style.width = `${getPercent(cardioCount)}%`;

  document.getElementById("split-strength-text").textContent = `${strengthCount} Sessions (${getPercent(strengthCount)}%)`;
  document.getElementById("split-strength-bar").style.width = `${getPercent(strengthCount)}%`;

  document.getElementById("split-crossfit-text").textContent = `${crossfitCount} Sessions (${getPercent(crossfitCount)}%)`;
  document.getElementById("split-crossfit-bar").style.width = `${getPercent(crossfitCount)}%`;
}

// Render dynamic Point items redeem cards
function renderRewardsStoreList(data) {
  const storeContainer = document.getElementById("rewards-store-grid");
  if (!storeContainer) return;

  storeContainer.innerHTML = REWARD_STORE_ITEMS.map(item => {
    const isAffordable = data.points >= item.points;
    const buttonAttr = isAffordable ? "" : "disabled style='opacity:0.5; cursor:not-allowed;'";
    const buttonClass = isAffordable ? "primary-btn" : "secondary-btn";
    
    return `
      <div class="reward-card">
        <div>
          <div style="font-size: 32px; margin-bottom: 12px;">${item.icon}</div>
          <div class="reward-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
          </div>
        </div>
        <div>
          <div class="reward-points-tag">${item.points.toLocaleString()} points</div>
          <button class="${buttonClass} action-btn-redeem" data-id="${item.id}" ${buttonAttr}>
            ${isAffordable ? "Redeem Gift" : "Insufficient Points"}
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Attach click actions to Claim
  const redeemButtons = storeContainer.querySelectorAll(".action-btn-redeem");
  redeemButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.getAttribute("data-id");
      redeemItem(itemId);
    });
  });
}

// Process item claim
function redeemItem(itemId) {
  const data = getUserData();
  const item = REWARD_STORE_ITEMS.find(i => i.id === itemId);
  
  if (!item) return;

  if (data.points >= item.points) {
    data.points -= item.points;
    saveUserData(data);
    renderDashboard();
    showToast(`Redeemed! Enjoy your custom ${item.name}!`);
  } else {
    showToast("Oops! Insufficient wellness reward points.", "error");
  }
}

// Highlight subscription plan cards dynamically
function renderMembershipPlans(activeTier) {
  const planBasic = document.getElementById("plan-basic");
  const planPremium = document.getElementById("plan-premium");
  const planUltimate = document.getElementById("plan-ultimate");

  if (!planBasic || !planPremium || !planUltimate) return;

  // Clear active classes
  [planBasic, planPremium, planUltimate].forEach(card => card.classList.remove("active"));

  if (activeTier === "Basic") planBasic.classList.add("active");
  else if (activeTier === "Premium") planPremium.classList.add("active");
  else if (activeTier === "Ultimate") planUltimate.classList.add("active");
}

// Subscribe trigger tier
export function initTierButtons() {
  const container = document.getElementById("view-membership");
  if (!container) return;

  const btnTiers = container.querySelectorAll(".action-btn-tier");
  btnTiers.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedTier = btn.getAttribute("data-tier");
      const data = getUserData();

      data.membershipTier = selectedTier;
      saveUserData(data);
      renderDashboard();

      showToast(`Membership Plan successfully upgraded to ${selectedTier}!`);
    });
  });
}

// Initial Dialog prompts
export function initWorkoutLoggerModal() {
  const modal = document.getElementById("modal-workout-overlay");
  const triggers = [
    document.getElementById("btn-log-workout-trigger"),
    document.getElementById("btn-activity-log-workout")
  ];
  const closeButton = document.getElementById("btn-close-workout-modal");
  const cancelBtn = document.getElementById("btn-cancel-workout-modal");
  const form = document.getElementById("form-log-workout");

  const openModal = () => {
    modal.classList.add("active");
    document.getElementById("workout-name").focus();
  };

  const closeModal = () => {
    modal.classList.remove("active");
    form.reset();
  };

  triggers.forEach(btn => {
    if (btn) btn.addEventListener("click", openModal);
  });

  if (closeButton) closeButton.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Close when outer overlay clicked
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Log workout submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("workout-type").value;
    const name = document.getElementById("workout-name").value;
    const duration = parseInt(document.getElementById("workout-duration").value, 10);
    const bpm = parseInt(document.getElementById("workout-intensity").value, 10);

    // Compute rewarded points: duration * constant factors
    let factor = 1.0;
    if (type === "Strength") factor = 0.8;
    else if (type === "Crossfit") factor = 1.25;

    const pointsEarned = Math.round(duration * factor);

    const workoutObj = {
      id: "w_" + Date.now(),
      type,
      name,
      duration,
      heartRate: bpm,
      pointsEarned,
      timestamp: new Date().toISOString()
    };

    const data = getUserData();
    data.workouts.push(workoutObj);
    data.points += pointsEarned;

    saveUserData(data);
    renderDashboard();
    closeModal();

    showToast(`Workout logged! Earned +${pointsEarned} fitness reward points.`);
  });
}

// Profile Save Config Actions
export function initSettingsHandler() {
  const form = document.getElementById("form-settings-profile");
  if (!form) return;

  // Seed default selections
  const data = getUserData();
  document.getElementById("settings-username").value = data.name;
  document.getElementById("settings-weekly-goal").value = data.weeklyGoal;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("settings-username").value.trim();
    const weeklyGoal = parseInt(document.getElementById("settings-weekly-goal").value, 10);

    const updatedData = getUserData();
    updatedData.name = name;
    updatedData.weeklyGoal = weeklyGoal;

    saveUserData(updatedData);
    renderDashboard();

    showToast("Profile settings successfully updated and saved locally!");
  });

  // Add event listener to standard hard resets
  const resetButton = document.getElementById("btn-reset-dashboard-data");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all personalized workout history log structures and points?")) {
        localStorage.removeItem("gym-dashboard-user-data");
        renderDashboard();
        
        // Re-seed settings input fields
        const freshData = getUserData();
        document.getElementById("settings-username").value = freshData.name;
        document.getElementById("settings-weekly-goal").value = freshData.weeklyGoal;

        showToast("All dashboard sessions and reward pools have been reset!");
      }
    });
  }
}

// Shortcuts to quick tabs triggers from dashboard metrics buttons
export function initQuickNavigationLinks() {
  const btnViewPlan = document.getElementById("btn-view-plan");
  const btnOpenRewards = document.getElementById("btn-open-rewards-trigger");

  const tabSelection = (tabName) => {
    const selector = `.nav-link[data-view="${tabName}"]`;
    const elem = document.querySelector(selector);
    if (elem) elem.click();
  };

  if (btnViewPlan) {
    btnViewPlan.addEventListener("click", () => {
      tabSelection("membership");
    });
  }

  if (btnOpenRewards) {
    btnOpenRewards.addEventListener("click", () => {
      tabSelection("rewards");
    });
  }
}
