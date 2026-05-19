// app.js

import { createNavigation }
from './modules/navigation.js';

const app =
  document.getElementById('app');

app.innerHTML = `

  <!-- Sidebar -->

  <aside
    class="sidebar"
    id="sidebar"
  >
  </aside>

  <!-- Floating Dock -->

  <div
    class="floating-dock"
    id="floatingDock"
  >
  </div>
`;

createNavigation();