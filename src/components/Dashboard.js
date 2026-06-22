import React, { useState } from "react";
import { INITIAL_FEATURES } from "../data/features";
import { evaluateAllRules } from "../utils/businessRules";
import FeatureRow from "./FeatureRow";
import RulesModal from "./RulesModal";
import EditModal from "./EditModal";

export default function Dashboard({ admin, onLogout }) {
  const [features, setFeatures] = useState(INITIAL_FEATURES);
  const [rulesTarget, setRulesTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);

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
          // Trying to ENABLE
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
          // Disabling always allowed
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
