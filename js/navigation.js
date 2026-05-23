// js/navigation.js
export function createNavigation() {
  const sidebar = document.getElementById('sidebar');
  const floatingDock = document.getElementById('floatingDock');
  const tabs = ['Home', 'Data', 'Plan', 'Perks', 'Settings'];

  sidebar.innerHTML = `
    <div>
      <h2 class="logo">FitX</h2>
      <div class="sidebar-nav">
        ${tabs.map((tab, idx) => `<button class="nav-btn ${idx === 0 ? 'active' : ''}">${tab}</button>`).join('')}
      </div>
    </div>
    <div class="profile-box">
      <h4>Arjun Verma</h4>
      <p>Premium Member</p>
    </div>
  `;

  floatingDock.innerHTML = `
    <div class="dock-container">
      ${tabs.map((tab, idx) => `<button class="dock-btn ${idx === 0 ? 'active' : ''}">${tab}</button>`).join('')}
    </div>
  `;
}