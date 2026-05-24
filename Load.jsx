import { useState, useEffect, useCallback } from "react";
import "./Load.css"; // Case-sensitive import matching Load.css precisely

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

export function ShimmerBox({ width, height, style = {} }) {
  return (
    <div
      className="shimmer"
      style={{
        width,
        height,
        borderRadius: "16px",
        ...style,
      }}
    ></div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="sidebar">
      <ShimmerBox width="160px" height="40px" />

      <div className="sidebar-menu">
        {[1, 2, 3, 4, 5].map((item) => (
          <ShimmerBox
            key={item}
            width="100%"
            height="50px"
            style={{ marginBottom: "15px" }}
          />
        ))}
      </div>

      <ShimmerBox width="100%" height="50px" />
    </div>
  );
}

function TopbarSkeleton() {
  return (
    <div className="topbar">
      <ShimmerBox width="220px" height="45px" />

      <div className="topbar-right">
        <ShimmerBox width="220px" height="45px" />
        <ShimmerBox width="45px" height="45px" />
        <ShimmerBox width="45px" height="45px" />
      </div>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="stats-grid">
      {[1, 2, 3, 4].map((item) => (
        <div className="card" key={item}>
          <ShimmerBox width="120px" height="20px" />
          <ShimmerBox
            width="180px"
            height="40px"
            style={{ marginTop: "20px" }}
          />
          <ShimmerBox
            width="100%"
            height="12px"
            style={{ marginTop: "25px" }}
          />
        </div>
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <ShimmerBox width="150px" height="20px" />
        <ShimmerBox
          width="100%"
          height="260px"
          style={{ marginTop: "25px" }}
        />
      </div>

      <div className="chart-card">
        <ShimmerBox width="150px" height="20px" />
        <ShimmerBox
          width="100%"
          height="260px"
          style={{ marginTop: "25px" }}
        />
      </div>
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="session-card">
      <ShimmerBox width="180px" height="25px" />

      {[1, 2, 3, 4].map((item) => (
        <div className="session-row" key={item}>
          <ShimmerBox width="60px" height="60px" />
          <div style={{ flex: 1 }}>
            <ShimmerBox width="70%" height="18px" />
            <ShimmerBox
              width="40%"
              height="12px"
              style={{ marginTop: "12px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteWidget() {
  const [quote, setQuote] = useState({ text: "", author: "" });

  const changeQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  useEffect(() => {
    // Generates a quote right away on page load
    changeQuote();

    // Swaps the quote whenever the user clicks anywhere in the window
    const handleGlobalClick = () => {
      changeQuote();
    };

    window.addEventListener("click", handleGlobalClick);
    
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [changeQuote]);

  return (
    <div className="quote-container">
      <p className="quote-text">“{quote.text}”</p>
      <p className="quote-author">— {quote.author}</p>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="dashboard">
      <SidebarSkeleton />

      <div className="main-content">
        <TopbarSkeleton />

        <QuoteWidget />

        <StatsCardsSkeleton />

        <ChartsSkeleton />

        <SessionsSkeleton />
      </div>
    </div>
  );
}