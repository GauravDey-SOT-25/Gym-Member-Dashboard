// app.js

import { createNavigation } from './navigation.js';
import { renderCards } from './cards.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar"></aside>

    <!-- Main Content -->
    <main class="dashboard-content" id="dashboardContent"></main>
  </div>

  <!-- Floating Dock -->
  <div class="floating-dock" id="floatingDock"></div>
`;

createNavigation();

// Render Cards
const dashboardContent = document.getElementById('dashboardContent');
if (dashboardContent) {
  renderCards(dashboardContent);
}