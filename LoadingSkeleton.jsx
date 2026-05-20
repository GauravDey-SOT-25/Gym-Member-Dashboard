import "./LoadingSkeleton.css";

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

export default function DashboardSkeleton() {
  return (
    <div className="dashboard">
      <SidebarSkeleton />

      <div className="main-content">
        <TopbarSkeleton />

        <StatsCardsSkeleton />

        <ChartsSkeleton />

        <SessionsSkeleton />
      </div>
    </div>
  );
}