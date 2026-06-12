"use client";

import callLegacy from "./callLegacy";

export default function LoginPanel() {
  const loginOnEnter = (key: string) => {
    if (key === "Enter") callLegacy("doLogin");
  };

  return (
    <div id="login-screen">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <img src="/bos-logo.jpeg" alt="B.O.S" style={{ height: 56, width: "auto" }} />
            <div className="login-logo-name">
              B.O.S <span>Blake Operating System</span>
            </div>
          </div>
          <h3>Sign in</h3>
          <div className="login-sub">Access your operating dashboard</div>
          <div className="login-error" id="login-error" />
          <div className="form-row">
            <label>Username</label>
            <input
              type="text"
              id="login-user"
              autoComplete="username"
              onKeyDown={(event) => loginOnEnter(event.key)}
            />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              id="login-pass"
              autoComplete="current-password"
              onKeyDown={(event) => loginOnEnter(event.key)}
            />
          </div>
          <button
            className="btn primary"
            id="login-btn"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => callLegacy("doLogin")}
          >
            <i className="ti ti-login" /> Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
