"use client";

import callLegacy from "./callLegacy";

const tabs = [
  { key: "dashboard", icon: "chart-bar", label: "Dashboard" },
  { key: "deals", icon: "file-invoice", label: "Deals" },
  { key: "forecast", icon: "target", label: "Forecast" },
  { key: "eod", icon: "file-text", label: "EOD report" },
  { key: "conversion", icon: "trending-up", label: "Conversion" },
  { key: "activity", icon: "calendar", label: "Activity log" },
  { key: "pipeline", icon: "arrow-right", label: "Pipeline" },
  { key: "wip", icon: "clipboard-list", label: "WIP Tracker", id: "tab-wip-btn", hidden: true },
  { key: "cashflow", icon: "cash", label: "Cashflow", id: "tab-cashflow-btn", hidden: true },
  { key: "planner", icon: "calendar-week", label: "Team Planner", id: "tab-planner-btn", hidden: true },
  { key: "perf", icon: "chart-bar", label: "Team Performance", id: "tab-perf-btn", hidden: true },
  { key: "users", icon: "shield-lock", label: "Users", id: "tab-users-btn", hidden: true },
];

export default function AppTabs() {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <button
          key={tab.key}
          className={`tab${index === 0 ? " active" : ""}`}
          id={tab.id}
          style={tab.hidden ? { display: "none" } : undefined}
          onClick={() => callLegacy("switchTab", tab.key)}
        >
          <i className={`ti ti-${tab.icon}`} /> {tab.label}
        </button>
      ))}
    </div>
  );
}
