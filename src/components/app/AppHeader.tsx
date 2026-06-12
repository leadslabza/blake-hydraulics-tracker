"use client";

import callLegacy from "./callLegacy";

export default function AppHeader() {
  return (
    <div className="header">
      <div className="brand">
        <img src="/bos-logo.jpeg" alt="B.O.S" style={{ height: 36, width: "auto" }} />
        <div className="brand-name">
          B.O.S <span>Blake Operating System</span>
        </div>
      </div>
      <div className="topbar-user">
        <label
          id="admin-start-page-wrap"
          style={{ display: "none", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}
        >
          Start page
          <select id="admin-start-page" style={{ height: 30, fontSize: 12 }} onChange={() => callLegacy("saveAdminStartPage")}>
            <option value="dashboard">Dashboard</option>
            <option value="deals">Deals</option>
            <option value="forecast">Forecast</option>
            <option value="eod">EOD report</option>
            <option value="conversion">Conversion</option>
            <option value="activity">Activity log</option>
            <option value="pipeline">Pipeline</option>
            <option value="wip">WIP Tracker</option>
            <option value="cashflow">Cashflow</option>
            <option value="planner">Team Planner</option>
            <option value="perf">Team Performance</option>
            <option value="users">Users</option>
          </select>
        </label>
        <span style={{ fontSize: 13, fontWeight: 500 }} id="topbar-name" />
        <span className="role-pill" id="topbar-role" />
        <button className="btn" style={{ fontSize: 12 }} onClick={() => callLegacy("doLogout")}>
          <i className="ti ti-logout" /> Sign out
        </button>
      </div>
    </div>
  );
}
