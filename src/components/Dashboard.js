import React, { useState, useEffect } from "react";
import { INITIAL_FEATURES } from "../data/features";
import { evaluateAllRules } from "../utils/businessRules";
import FeatureRow from "./FeatureRow";
import RulesModal from "./RulesModal";
import EditModal from "./EditModal";

const API_ENDPOINT = "/api/GetFeatureFlags";

export default function Dashboard({ admin, onLogout }) {
  const [features, setFeatures] = useState([]);
  const [apiStatus, setApiStatus] = useState({ state: "loading", ms: null, fetchedAt: null });
  const [rulesTarget, setRulesTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const start = performance.now();
    fetch(API_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const ms = Math.round(performance.now() - start);
        setFeatures(data.features);
        setApiStatus({ state: "success", ms, fetchedAt: data.fetchedAt, source: data.source });
      })
      .catch(() => {
        // Fallback to local data when running without the Azure Functions runtime
        const ms = Math.round(performance.now() - start);
        setFeatures(INITIAL_FEATURES);
        setApiStatus({ state: "fallback", ms, fetchedAt: new Date().toISOString() });
      });
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleToggle(featureId) {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id !== featureId) return f;
        const evaluation = evaluateAllRules(f);

        if (!f.enabled) {
          if (!evaluation.canEnable) {
            showToast(
              `Cannot enable "${f.name}". One or more business rules blocked it.`,
              "error"
            );
            setRulesTarget(f);
            return f;
          }
          showToast(`"${f.name}" is now ENABLED.`, "success");
          return {
            ...f,
            enabled: true,
            enabledAt: new Date().toISOString().split("T")[0],
            enabledBy: `${admin.name} (${admin.id})`,
          };
        } else {
          showToast(`"${f.name}" has been DISABLED.`, "info");
          return { ...f, enabled: false, enabledAt: null, enabledBy: null };
        }
      })
    );
  }

  function handleSaveEdit(updatedFeature) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === updatedFeature.id ? updatedFeature : f))
    );
    setEditTarget(null);
    showToast(`"${updatedFeature.name}" attributes updated.`, "success");
  }

  const enabledCount = features.filter((f) => f.enabled).length;

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-header__inner">
          <div className="dash-header__brand">
            <span className="deloitte-wordmark deloitte-wordmark--white">Deloitte.</span>
            <span className="dash-header__app-name">Feature Flag Manager</span>
          </div>
          <div className="dash-header__admin">
            <div className="admin-pill">
              <span className="admin-pill__avatar">{admin.name.charAt(0)}</span>
              <div className="admin-pill__info">
                <span className="admin-pill__name">{admin.name}</span>
                <span className="admin-pill__role">{admin.id} · {admin.role}</span>
              </div>
            </div>
            <button className="btn-ghost" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="dash-main">

        {/* ── HTTP Trigger Info Bar ── */}
        <div className={`api-bar api-bar--${apiStatus.state}`}>
          <div className="api-bar__icon">
            {apiStatus.state === "loading" && <span className="api-spinner" />}
            {apiStatus.state === "success" && "⚡"}
            {apiStatus.state === "fallback" && "⚠️"}
          </div>
          <div className="api-bar__content">
            {apiStatus.state === "loading" && (
              <span className="api-bar__label">
                Calling Azure Functions HTTP Trigger&hellip;
                <code className="api-bar__endpoint">{API_ENDPOINT}</code>
              </span>
            )}
            {apiStatus.state === "success" && (
              <>
                <span className="api-bar__label">
                  HTTP Trigger response received in
                  <strong> {apiStatus.ms} ms</strong> · Status
                  <span className="api-bar__status-code">200 OK</span>
                </span>
                <span className="api-bar__meta">
                  Endpoint: <code className="api-bar__endpoint">{API_ENDPOINT}</code>
                  &nbsp;·&nbsp; Fetched at: {new Date(apiStatus.fetchedAt).toLocaleTimeString()}
                  &nbsp;·&nbsp; Source: {apiStatus.source}
                </span>
              </>
            )}
            {apiStatus.state === "fallback" && (
              <>
                <span className="api-bar__label">
                  API not reachable — loaded local data (fallback)
                </span>
                <span className="api-bar__meta">
                  To use the live trigger, run <code className="api-bar__endpoint">func start</code> inside the <code className="api-bar__endpoint">api/</code> folder
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {apiStatus.state === "loading" && (
          <div className="skeleton-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton-cell skeleton-cell--wide" />
                <div className="skeleton-cell" />
                <div className="skeleton-cell skeleton-cell--narrow" />
                <div className="skeleton-cell skeleton-cell--narrow" />
                <div className="skeleton-cell skeleton-cell--narrow" />
                <div className="skeleton-cell skeleton-cell--narrow" />
              </div>
            ))}
          </div>
        )}

        {/* ── Loaded content ── */}
        {apiStatus.state !== "loading" && (
          <>
            {/* Stats bar */}
            <div className="stats-bar">
              <div className="stat-card">
                <span className="stat-card__value">{features.length}</span>
                <span className="stat-card__label">Total Features</span>
              </div>
              <div className="stat-card stat-card--green">
                <span className="stat-card__value">{enabledCount}</span>
                <span className="stat-card__label">Enabled</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__value">{features.length - enabledCount}</span>
                <span className="stat-card__label">Disabled</span>
              </div>
              <div className="stat-card stat-card--blue">
                <span className="stat-card__value">3</span>
                <span className="stat-card__label">Business Rules Active</span>
              </div>
            </div>

            {/* Rules legend */}
            <div className="rules-legend">
              <span className="rules-legend__title">Active business rules:</span>
              <span className="rule-badge rule-badge--compliance">Compliance</span>
              <span className="rule-badge rule-badge--security">Security</span>
              <span className="rule-badge rule-badge--performance">Performance</span>
              <span className="rules-legend__note">
                All three rules must pass before a feature can be enabled.
              </span>
            </div>

            {/* Feature table */}
            <div className="feature-table-wrap">
              <table className="feature-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Category</th>
                    <th className="th-center">Compliance</th>
                    <th className="th-center">Security</th>
                    <th className="th-center">Performance</th>
                    <th className="th-center">Status</th>
                    <th className="th-center">Enable / Disable</th>
                    <th className="th-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => {
                    const evaluation = evaluateAllRules(feature);
                    return (
                      <FeatureRow
                        key={feature.id}
                        feature={feature}
                        evaluation={evaluation}
                        onToggle={() => handleToggle(feature.id)}
                        onShowRules={() => setRulesTarget(feature)}
                        onEdit={() => setEditTarget(feature)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {rulesTarget && (
        <RulesModal
          feature={rulesTarget}
          evaluation={evaluateAllRules(rulesTarget)}
          onClose={() => setRulesTarget(null)}
        />
      )}

      {editTarget && (
        <EditModal
          feature={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
