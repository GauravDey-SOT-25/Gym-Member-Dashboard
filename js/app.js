/* Primary ES6 Modules Organizer and Bootstrapper */
import { initializeTheme } from "./theme/themeManager.js";
import { 
  initViewRouter, 
  renderDashboard, 
  initTierButtons, 
  initWorkoutLoggerModal, 
  initSettingsHandler,
  initQuickNavigationLinks
} from "./dashboard/uiManager.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize CSS variables and Saved Theme mode
  initializeTheme();

  // 2. Setup dynamic SPA Tab navigation routes
  initViewRouter();

  // 3. Bind gym plan changes buttons
  initTierButtons();

  // 4. Bind interactive Log Exercise Dialog triggers
  initWorkoutLoggerModal();

  // 5. Connect Settings modifications forms
  initSettingsHandler();

  // 6. Support shortcuts back and forth between cards
  initQuickNavigationLinks();

  // 7. Perform the first render of stored gym stats
  renderDashboard();
});
