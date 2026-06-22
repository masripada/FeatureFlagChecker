import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(userId);
      if (!ok) {
        setError("User ID not recognised or insufficient privileges. Admin access required.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="deloitte-wordmark">Deloitte.</div>
          <div className="login-product-label">Feature Flag Manager</div>
        </div>

        <div className="login-body">
          <h1 className="login-title">Admin Sign In</h1>
          <p className="login-subtitle">
            Enter your Deloitte User ID to access the feature flag control panel.
            Admin privileges required.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label className="field-label" htmlFor="userId">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                className={`field-input ${error ? "field-input--error" : ""}`}
                placeholder="e.g. DL-55501"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {error && <p className="field-error">{error}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={!userId.trim() || loading}
            >
              {loading ? "Verifying…" : "Sign in"}
            </button>
          </form>

          <div className="login-hint">
            <span className="hint-label">Admin credential:</span> DL-55501
          </div>
        </div>
      </div>

      <div className="login-bg-circle login-bg-circle--1" />
      <div className="login-bg-circle login-bg-circle--2" />
    </div>
  );
}
