// navigation.js

export function createNavigation() {

  const sidebar =
    document.getElementById('sidebar');

  const floatingDock =
    document.getElementById('floatingDock');

  const tabs = [
    'Home',
    'Data',
    'Plan',
    'Perks',
    'Settings'
  ];

  /* Sidebar */

  sidebar.innerHTML = `

    <div>

      <h2 class="logo">
        FitX
      </h2>

      <div class="sidebar-nav">

        ${tabs.map((tab, index) => `

          <button
            class="
              nav-btn
              ${index === 0 ? 'active' : ''}
            "
          >
            ${tab}
          </button>

        `).join('')}

      </div>

    </div>

    <!-- Profile -->

    <div class="profile-box">

      <div class="profile-left">

        <div class="profile-avatar">
          H
        </div>

        <div>

          <h4>
            Hrishabh
          </h4>

          <p>
            Premium Member
          </p>

        </div>

      </div>

    </div>
  `;

  /* Floating Dock */

  floatingDock.innerHTML = `

    <div class="dock-container">

      ${tabs.map((tab, index) => `

        <button
          class="
            dock-btn
            ${index === 0 ? 'active' : ''}
          "
        >
          ${tab}
        </button>

      `).join('')}

    </div>
  `;

  /* Active State */

  const navButtons =
    document.querySelectorAll('.nav-btn');

  const dockButtons =
    document.querySelectorAll('.dock-btn');

  navButtons.forEach((button, index) => {

    button.addEventListener('click', () => {

      navButtons.forEach(btn =>
        btn.classList.remove('active')
      );

      dockButtons.forEach(btn =>
        btn.classList.remove('active')
      );

      button.classList.add('active');

      dockButtons[index]
        .classList.add('active');
    });
  });

  dockButtons.forEach((button, index) => {

    button.addEventListener('click', () => {

      dockButtons.forEach(btn =>
        btn.classList.remove('active')
      );

      navButtons.forEach(btn =>
        btn.classList.remove('active')
      );

      button.classList.add('active');

      navButtons[index]
        .classList.add('active');
    });
  });
}