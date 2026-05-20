/**************************************************************
 * app.js
 * FULL GYM ANALYTICS DASHBOARD
 * REALTIME CHART SYSTEM
 **************************************************************/


/**************************************************************
 * IMPORTS
 **************************************************************/
import { startRealtimeUpdates } from "./realtime.js";
import { fetchChartData } from "./api.js";


/**************************************************************
 * CREATE FULL UI
 **************************************************************/
document.body.innerHTML = `
  <div class="dashboard">

    <div class="chart-card">

      <div class="top-bar">

        <h1 class="title">
          Gym Analytics Dashboard
        </h1>

        <div class="chart-type-controls">

          <button
            class="type-btn active"
            data-chart="sessions"
          >
            Sessions
          </button>

          <button
            class="type-btn"
            data-chart="calories"
          >
            Calories
          </button>

        </div>

      </div>


      <div class="time-controls">

        <button
          class="btn active"
          data-type="weekly"
        >
          Weekly
        </button>

        <button
          class="btn"
          data-type="monthly"
        >
          Monthly
        </button>

        <button
          class="btn"
          data-type="yearly"
        >
          Yearly
        </button>

      </div>


      <div class="chart-wrapper">

        <div
          id="loader"
          class="loader hidden"
        >
          Updating...
        </div>

        <canvas id="chart"></canvas>

      </div>

    </div>

  </div>
`;


/**************************************************************
 * STYLES
 **************************************************************/
const style = document.createElement("style");

style.innerHTML = `
:root {
  --bg-primary: #000000;
  --bg-secondary: #1A1A1A;
  --bg-surface: #222222;
  --bg-card: #1E1E1E;
  --bg-input: #2A2A2A;

  --accent-primary: #D9FF00;

  --border-default: #333333;

  --text-primary: #FFFFFF;
  --text-secondary: #CFCFCF;
  --text-muted: #8A8A8A;

  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;

  --color-analytics-blue: #3B82F6;
  --color-rewards-purple: #8B5CF6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: Arial, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px;
}

.chart-card {
  width: 100%;
  max-width: 1200px;

  background: var(--bg-card);

  border: 1px solid var(--border-default);

  border-radius: 24px;

  padding: 30px;

  box-shadow:
    0 0 30px rgba(217,255,0,0.04);

  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;
}

.title {
  font-size: 2rem;
  color: var(--accent-primary);
}

.chart-type-controls,
.time-controls {
  display: flex;
  gap: 12px;
}

.time-controls {
  margin-bottom: 30px;
}

.btn,
.type-btn {
  background: var(--bg-input);

  border: 1px solid var(--border-default);

  color: var(--text-secondary);

  padding: 12px 18px;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.3s ease;

  font-weight: 600;
}

.btn:hover,
.type-btn:hover {
  border-color: var(--accent-primary);

  color: var(--accent-primary);

  transform: translateY(-2px);
}

.btn.active,
.type-btn.active {
  background: var(--accent-primary);

  color: #000;

  border-color: var(--accent-primary);

  box-shadow:
    0 0 12px rgba(217,255,0,0.35);
}

.chart-wrapper {
  width: 100%;
  height: 520px;

  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.loader {
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  background: var(--bg-secondary);

  padding: 12px 20px;

  border-radius: 12px;

  border: 1px solid var(--border-default);

  color: var(--accent-primary);

  z-index: 100;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {

  .top-bar {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .chart-type-controls,
  .time-controls {
    flex-wrap: wrap;
  }

  .chart-wrapper {
    height: 380px;
  }

}
`;

document.head.appendChild(style);


/**************************************************************
 * LOAD CHART.JS
 **************************************************************/
const chartScript =
  document.createElement("script");

chartScript.src =
  "https://cdn.jsdelivr.net/npm/chart.js";

document.head.appendChild(chartScript);

chartScript.onload = initApp;


/**************************************************************
 * STATE
 **************************************************************/
let chartInstance = null;

let currentView = "weekly";

let currentType = "sessions";


/**************************************************************
 * INIT APP
 **************************************************************/
async function initApp() {

  const ctx =
    document.getElementById("chart")
    .getContext("2d");

  const timeButtons =
    document.querySelectorAll(".btn");

  const typeButtons =
    document.querySelectorAll(".type-btn");

  const loader =
    document.getElementById("loader");


  /************************************************************
   * LOADER
   ************************************************************/
  function showLoader() {
    loader.classList.remove("hidden");
  }

  function hideLoader() {
    loader.classList.add("hidden");
  }


  /************************************************************
   * CREATE CHART
   ************************************************************/
  function createChart(chartData) {

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {

      type: "line",

      data: {

        labels: chartData.labels,

        datasets: chartData.datasets.map(ds => ({

          label: ds.label,

          data: ds.data,

          borderColor: ds.color,

          backgroundColor:
            ds.color + "22",

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          pointRadius: 5,

          pointHoverRadius: 8

        }))
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

          duration: 700,

          easing: "easeInOutQuart"
        },

        plugins: {

          legend: {

            labels: {
              color: "#FFFFFF"
            }
          },

          tooltip: {

            backgroundColor: "#111",

            titleColor: "#D9FF00",

            bodyColor: "#FFFFFF",

            borderColor: "#333",

            borderWidth: 1
          }
        },

        scales: {

          x: {

            ticks: {
              color: "#8A8A8A"
            },

            grid: {
              color: "#222"
            }
          },

          y: {

            ticks: {
              color: "#8A8A8A"
            },

            grid: {
              color: "#222"
            }
          }
        }
      }
    });
  }


  /************************************************************
   * LOAD CHART
   ************************************************************/
  async function loadChart(view) {

    try {

      showLoader();

      const response =
        await fetchChartData(
          currentType,
          view
        );

      if (response.success) {

        createChart(response.data);

      }

    } catch (error) {

      console.error(
        "Chart Load Error:",
        error
      );

    } finally {

      hideLoader();

    }
  }


  /************************************************************
   * TIME FILTER BUTTONS
   ************************************************************/
  timeButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      timeButtons.forEach(b =>
        b.classList.remove("active")
      );

      btn.classList.add("active");

      currentView =
        btn.dataset.type;

      loadChart(currentView);

    });

  });


  /************************************************************
   * CHART TYPE BUTTONS
   ************************************************************/
  typeButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      typeButtons.forEach(b =>
        b.classList.remove("active")
      );

      btn.classList.add("active");

      currentType =
        btn.dataset.chart;

      loadChart(currentView);

    });

  });


  /************************************************************
   * REALTIME UPDATES
   ************************************************************/
  startRealtimeUpdates((res) => {

    if (!res.success) return;

    if (currentView !== "weekly") return;

    if (currentType !== "sessions") return;

    if (!chartInstance) return;

    const updatedChart =
      res.data.chart;

    chartInstance.data.labels =
      updatedChart.labels;

    chartInstance.data.datasets[0].data =
      updatedChart.datasets[0].data;

    chartInstance.update();

  });


  /************************************************************
   * INITIAL LOAD
   ************************************************************/
  await loadChart(currentView);

}