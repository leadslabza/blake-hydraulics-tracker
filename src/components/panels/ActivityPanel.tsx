"use client";

import callLegacy from "../app/callLegacy";

export default function ActivityPanel() {
  return (
    <div id="tab-activity" className="panel">
      <div className="toolbar">
        <input type="text" id="act-search" placeholder="Search..." onInput={() => callLegacy("renderActivity")} />
        <select id="act-rep" onChange={() => callLegacy("renderActivity")}>
          <option value="">All reps</option>
        </select>
        <select id="act-type" onChange={() => callLegacy("renderActivity")}>
          <option value="">All types</option>
        </select>
        <button className="btn primary" onClick={() => callLegacy("openModal", "activity")}>
          <i className="ti ti-plus" /> Log activity
        </button>
      </div>
      <div className="tbl-wrap">
        <table>
          <colgroup>
            <col style={{ width: 72 }} />
            <col style={{ width: 88 }} />
            <col style={{ width: 108 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 155 }} />
            <col style={{ width: 54 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 140 }} />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th>Date</th>
              <th>Rep</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Mins</th>
              <th>Follow-up?</th>
              <th>F/U date</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody id="act-body" />
        </table>
      </div>
    </div>
  );
}
