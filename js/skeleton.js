// js/skeleton.js - Vanilla JS Skeleton Screen Loader Module

// Database of quotes
const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" }
];

let globalQuoteClickListener = null;

function getShimmerBox(width, height, style = {}) {
  const styleString = Object.entries({
    width,
    height,
    borderRadius: "16px",
    display: "block",
    ...style
  }).map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`).join('; ');

  return `<div class="shimmer" style="${styleString}"></div>`;
}

function getSidebarSkeleton() {
  return `
    <aside class="sidebar">
      <div>
        ${getShimmerBox("160px", "40px")}
        <div class="sidebar-menu-skeleton">
          ${[1, 2, 3, 4, 5].map(() => getShimmerBox("100%", "50px", { marginBottom: "15px" })).join('')}
        </div>
      </div>
      ${getShimmerBox("100%", "50px")}
    </aside>
  `;
}

function getTopbarSkeleton() {
  return `
    <header class="topbar">
      <div class="topbar-left"></div>
      <div class="topbar-right">
        ${getShimmerBox("45px", "45px")}
        ${getShimmerBox("45px", "45px")}
        ${getShimmerBox("45px", "45px")}
      </div>
    </header>
  `;
}

function getStatsCardsSkeleton() {
  return `
    <div class="stats-grid">
      ${[1, 2, 3, 4].map(() => `
        <div class="stat-card" style="display: flex; flex-direction: column;">
          ${getShimmerBox("120px", "20px")}
          ${getShimmerBox("180px", "40px", { marginTop: "20px" })}
          ${getShimmerBox("100%", "12px", { marginTop: "25px" })}
        </div>
      `).join('')}
    </div>
  `;
}

function getChartsSkeleton() {
  return `
    <div class="charts-grid">
      <div class="chart-card">
        ${getShimmerBox("150px", "20px")}
        ${getShimmerBox("100%", "260px", { marginTop: "25px" })}
      </div>
      <div class="chart-card">
        ${getShimmerBox("150px", "20px")}
        ${getShimmerBox("100%", "260px", { marginTop: "25px" })}
      </div>
    </div>
  `;
}

function getSessionsSkeleton() {
  return `
    <div class="session-card">
      ${getShimmerBox("180px", "25px", { marginBottom: "20px" })}
      ${[1, 2, 3, 4].map(() => `
        <div class="session-row">
          ${getShimmerBox("60px", "60px")}
          <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
            ${getShimmerBox("70%", "18px")}
            ${getShimmerBox("40%", "12px", { marginTop: "2px" })}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[randomIndex];
}

function updateQuoteDisplay() {
  const quoteText = document.querySelector(".quote-text");
  const quoteAuthor = document.querySelector(".quote-author");
  if (quoteText && quoteAuthor) {
    const quote = getRandomQuote();
    quoteText.textContent = `“${quote.text}”`;
    quoteAuthor.textContent = `— ${quote.author}`;
  }
}

export function renderDashboardSkeleton(targetContainerId) {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  // Clean up any old quote click listeners first
  destroyQuoteRotation();

  // Create skeleton container html
  const skeletonHtml = `
    <div class="dashboard-layout skeleton-layout" style="opacity: 1;">
      ${getSidebarSkeleton()}
      
      <div class="main-content">
        ${getTopbarSkeleton()}
        
        <!-- QuoteWidget -->
        <div class="quote-container" id="skeleton-quote-widget">
          <p class="quote-text">“...”</p>
          <p class="quote-author">— ...</p>
        </div>

        ${getStatsCardsSkeleton()}
        ${getChartsSkeleton()}
        ${getSessionsSkeleton()}
      </div>

      <!-- Mobile navigation dock skeleton -->
      <div class="floating-dock" id="skeleton-floating-dock">
        <div class="dock-container">
          ${[1, 2, 3, 4, 5].map(() => getShimmerBox("60px", "35px")).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = skeletonHtml;

  // Populate first quote
  updateQuoteDisplay();

  // Setup click rotation (clicks globally anywhere in the window swaps quotes)
  globalQuoteClickListener = () => {
    updateQuoteDisplay();
  };
  window.addEventListener("click", globalQuoteClickListener);
}

export function destroyQuoteRotation() {
  if (globalQuoteClickListener) {
    window.removeEventListener("click", globalQuoteClickListener);
    globalQuoteClickListener = null;
  }
}
