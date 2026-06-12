"use client";

import callLegacy from "./callLegacy";

export default function ModalRoot() {
  return (
    <div className="modal-overlay" id="modal-overlay" onClick={(event) => callLegacy("closeMO", event.nativeEvent)}>
      <div className="modal">
        <h3 id="modal-title" />
        <div id="modal-body" />
        <div className="modal-footer">
          <button className="btn" onClick={() => callLegacy("closeModal")}>
            Cancel
          </button>
          <button className="btn primary" id="modal-save-btn" onClick={() => callLegacy("saveModal")}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
