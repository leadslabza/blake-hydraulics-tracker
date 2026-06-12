"use client";

import callLegacy from "../app/callLegacy";

export default function WipPanel() {
  return (
    <div id="tab-wip" className="panel">
      <div className="toolbar">
        <input type="text" id="wip-search" placeholder="Search jobs..." onInput={() => callLegacy("renderWIP")} />
        <select id="wip-status-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All statuses</option>
          <option>Jobs On The Go</option>
          <option>Awaiting Approval</option>
          <option>Job Complete</option>
        </select>
        <select id="wip-customer-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All customers</option>
        </select>
        <input type="date" id="wip-delivery-from" title="Delivery from" onChange={() => callLegacy("renderWIP")} />
        <input type="date" id="wip-delivery-to" title="Delivery to" onChange={() => callLegacy("renderWIP")} />
        <select id="wip-deposit-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All deposits</option>
          <option value="paid">Deposit paid</option>
          <option value="unpaid">Deposit unpaid</option>
          <option value="none">No deposit</option>
        </select>
        <select id="wip-payment-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All payments</option>
          <option value="paid">Paid in full</option>
          <option value="outstanding">Outstanding</option>
          <option value="overdue">Payment overdue</option>
        </select>
        <select id="wip-invoice-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All invoices</option>
          <option value="has">Has invoice</option>
          <option value="missing">Missing invoice</option>
        </select>
        <select id="wip-labour-filter" onChange={() => callLegacy("renderWIP")}>
          <option value="">All labour</option>
          <option value="allocated">Labour allocated</option>
          <option value="unallocated">No labour allocation</option>
        </select>
        <button className="btn" onClick={() => callLegacy("clearWIPFilters")}>
          <i className="ti ti-filter-off" /> Clear
        </button>
        <button className="btn primary" onClick={() => callLegacy("openModal", "wipAdd")}>
          <i className="ti ti-plus" /> Add job
        </button>
      </div>
      <div className="kpi-grid" id="wip-kpi" style={{ marginBottom: 20 }} />
      <div id="wip-content" />
    </div>
  );
}
