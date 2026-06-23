import React, { useState } from "react";

const FEATURES = [
  {
    id: "AI_ASSIST_PRO",
    label: "AI Assist Pro",
    description: "AI writing and summarisation assistant for project workspaces.",
  },
  {
    id: "CLIENT_360_DASHBOARD",
    label: "Client 360 Dashboard",
    description: "Unified client intelligence view with CRM data and risk signals.",
  },
  {
    id: "SECURE_DATA_ROOM",
    label: "Secure Data Room",
    description: "Encrypted document exchange for M&A and regulatory engagements.",
  },
  {
    id: "SMART_BILLING_ENGINE",
    label: "Smart Billing Engine",
    description: "AI-powered timesheet and billing automation for Partners.",
  },
];

const FUNCTION_BASE =
  "https://masripadafeatureflag.azurewebsites.net/api/FeatureFlagChecker";

export default function FeatureChecker() {
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    if (!selectedId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${FUNCTION_BASE}?feature=${selectedId}`);
      const data = await res.json();
      setResult({ ...data, ok: true });
    } catch {
      const feature = FEATURES.find((f) => f.id === selectedId);
      setResult({
        ok: false,
        featureName: feature?.label || selectedId,
        message: "Could not reach the Azure Function. Check that it is deployed and the URL is correct.",
      });
    } finally {
      setLoading(false);
    }
  }

  const variant = !result
    ? null
    : !result.ok
    ? "error"
    : result.enabled
    ? "enabled"
    : "disabled";

  return (
    <>
      <header className="header">
        <span className="header__wordmark">Deloitte.</span>
        <div className="header__divider" />
        <span className="header__title">Feature Flag Checker</span>
      </header>

      <main className="page">
        <div className="card">
          <div className="card__header">
            <div className="card__header-title">Check Feature Flag Status</div>
            <div className="card__header-sub">
              Select a feature and check whether it is currently enabled or disabled via Azure Functions.
            </div>
          </div>

          <div className="card__body">
            {/* Dropdown */}
            <div className="field">
              <label className="field__label">Select Feature</label>
              <select
                className="field__select"
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); setResult(null); }}
                disabled={loading}
              >
                <option value="">— Choose a feature —</option>
                {FEATURES.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Button */}
            <button
              className="btn-check"
              onClick={handleCheck}
              disabled={!selectedId || loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Checking via Azure Function…
                </>
              ) : (
                "Check Status"
              )}
            </button>

            {/* Result */}
            {result && (
              <div className={`result result--${variant}`}>
                <div className="result__badge">
                  <span className="result__icon">
                    {variant === "enabled" ? "✅" : variant === "disabled" ? "🔴" : "⚠️"}
                  </span>
                  <div>
                    <div className="result__feature-name">{result.featureName}</div>
                    <div className="result__status-text">
                      {variant === "enabled"
                        ? "ENABLED"
                        : variant === "disabled"
                        ? "DISABLED"
                        : "ERROR"}
                    </div>
                  </div>
                </div>

                <div className="result__body">{result.message}</div>

                <div className="result__meta">
                  <span className="result__meta-dot" />
                  {result.ok
                    ? `Responded by Azure Functions · ${new Date().toLocaleTimeString()}`
                    : "Azure Function unreachable"}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
