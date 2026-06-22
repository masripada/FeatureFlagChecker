import React from "react";
import { RULE_IDS } from "../utils/businessRules";

function RuleIndicator({ result }) {
  return (
    <td className="th-center">
      <span className={`rule-dot ${result.passed ? "rule-dot--pass" : "rule-dot--fail"}`}
            title={result.reason}>
        {result.passed ? "✓" : "✗"}
      </span>
    </td>
  );
}

export default function FeatureRow({ feature, evaluation, onToggle, onShowRules, onEdit }) {
  return (
    <tr className={`feature-row ${feature.enabled ? "feature-row--enabled" : ""}`}>
      {/* Feature name + description */}
      <td className="feature-row__name-cell">
        <div className="feature-name">{feature.name}</div>
        <div className="feature-id">{feature.id}</div>
        {feature.enabled && (
          <div className="feature-enabled-meta">
            Enabled {feature.enabledAt} by {feature.enabledBy}
          </div>
        )}
      </td>

      {/* Category */}
      <td>
        <span className="category-badge">{feature.category}</span>
      </td>

      {/* Rule indicators */}
      <RuleIndicator result={evaluation.rules[RULE_IDS.COMPLIANCE]} />
      <RuleIndicator result={evaluation.rules[RULE_IDS.SECURITY]} />
      <RuleIndicator result={evaluation.rules[RULE_IDS.PERFORMANCE]} />

      {/* Status */}
      <td className="th-center">
        <span className={`status-badge ${feature.enabled ? "status-badge--on" : "status-badge--off"}`}>
          {feature.enabled ? "ENABLED" : "DISABLED"}
        </span>
      </td>

      {/* Toggle */}
      <td className="th-center">
        <label className="toggle">
          <input
            type="checkbox"
            checked={feature.enabled}
            onChange={onToggle}
          />
          <span className="toggle__slider" />
        </label>
      </td>

      {/* Actions */}
      <td className="th-center">
        <div className="action-buttons">
          <button className="btn-action btn-action--rules" onClick={onShowRules}
                  title="View rule evaluation">
            Rules
          </button>
          <button className="btn-action btn-action--edit" onClick={onEdit}
                  title="Edit feature attributes">
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
