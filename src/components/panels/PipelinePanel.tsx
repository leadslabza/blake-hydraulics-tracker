"use client";

import callLegacy from "../app/callLegacy";

export default function PipelinePanel() {
  return (
    <div id="tab-pipeline" className="panel">
      <div className="toolbar">
        <input type="text" id="pipe-search" placeholder="Search..." onInput={() => callLegacy("renderPipeline")} />
        <select id="pipe-rep" onChange={() => callLegacy("renderPipeline")}>
          <option value="">All reps</option>
        </select>
        <select id="pipe-stage" onChange={() => callLegacy("renderPipeline")}>
          <option value="">All stages</option>
        </select>
        <button className="btn primary" onClick={() => callLegacy("openModal", "pipeline")}>
          <i className="ti ti-plus" /> Add deal
        </button>
        <span id="pipe-lock-notice" className="lock-notice" style={{ display: "none" }}>
          <i className="ti ti-lock" /> Only admins can delete deals
        </span>
      </div>
      <div className="tbl-wrap">
        <table>
          <colgroup>
            <col style={{ width: 72 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 112 }} />
            <col style={{ width: 124 }} />
            <col style={{ width: 148 }} />
            <col style={{ width: 98 }} />
            <col style={{ width: 94 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 98 }} />
            <col style={{ width: 84 }} />
            <col style={{ width: 68 }} />
            <col style={{ width: 76 }} />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th>Rep</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Opportunity</th>
              <th>Stage</th>
              <th>Value (R)</th>
              <th>Prob %</th>
              <th>Weighted (R)</th>
              <th>Close date</th>
              <th>Status</th>
              <th>Quotes</th>
            </tr>
          </thead>
          <tbody id="pipe-body" />
        </table>
      </div>
      <div className="pipe-footer">
        <span>
          Total pipeline: <strong id="pipe-total" />
        </span>
        <span>
          Weighted: <strong id="pipe-weighted" />
        </span>
        <span>
          Deals shown: <strong id="pipe-count" />
        </span>
      </div>
    </div>
  );
}
