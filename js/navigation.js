// js/navigation.js

import API from './data.js';

export function createNavigation(onTabChange) {
  const sidebar = document.getElementById('sidebar');
  const floatingDock = document.getElementById('floatingDock');

  if (!sidebar || !floatingDock) return;

  const tabs = [
    { name: 'Home', icon: 'ph ph-house' },
    { name: 'Data', icon: 'ph ph-chart-bar' },
    { name: 'Plan', icon: 'ph ph-calendar' },
    { name: 'Perks', icon: 'ph ph-gift' },
    { name: 'Settings', icon: 'ph ph-gear' }
  ];

  const member = API.getMember();
  const membership = API.getMembership();
  const initialLetter = member?.name ? member.name.charAt(0) : 'G';
  const planTag = membership?.plan || 'Guest';

  /* 1. Inject Sidebar HTML */
  sidebar.innerHTML = `
    <div>
      <h2 class="logo">FitMatrix</h2>
      <div class="sidebar-nav">
        ${tabs.map((tab, index) => `
          <button class="nav-btn ${index === 0 ? 'active' : ''}" data-tab="${tab.name}">
            <i class="${tab.icon}"></i>
            <span>${tab.name}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- User Profile Box -->
    <div class="profile-box">
      <div class="profile-box-avatar">${initialLetter}</div>
      <div class="profile-box-details">
        <h4 id="sidebar-user-name">${member?.name || 'Guest User'}</h4>
        <p id="sidebar-user-plan">${planTag} Member</p>
      </div>
    </div>
  `;

  /* 2. Inject Floating Dock HTML for Mobile */
  floatingDock.innerHTML = `
    <div class="dock-container">
      ${tabs.map((tab, index) => `
        <button class="dock-btn ${index === 0 ? 'active' : ''}" data-tab="${tab.name}">
          <i class="${tab.icon}"></i>
          <span>${tab.name}</span>
        </button>
      `).join('')}
    </div>
  `;

  /* 3. Wire Up Active Click State Switching */
  const navButtons = sidebar.querySelectorAll('.nav-btn');
  const dockButtons = floatingDock.querySelectorAll('.dock-btn');

  const updateActiveStates = (targetTabName) => {
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    dockButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      updateActiveStates(tabName);
      onTabChange(tabName);
    });
  });

  dockButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      updateActiveStates(tabName);
      onTabChange(tabName);
    });
  });
}

// Function to refresh sidebar profile box dynamically when user saves settings
export function updateSidebarProfile() {
  const member = API.getMember();
  const membership = API.getMembership();
  
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarPlan = document.getElementById('sidebar-user-plan');
  const avatarIndicator = document.querySelector('.profile-box-avatar');

  if (sidebarName && member) sidebarName.textContent = member.name;
  if (sidebarPlan && membership) sidebarPlan.textContent = `${membership.plan} Member`;
  if (avatarIndicator && member?.name) avatarIndicator.textContent = member.name.charAt(0);
}
