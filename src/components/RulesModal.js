import React from "react";
import { RULE_IDS } from "../utils/businessRules";

const RULE_META = {
  [RULE_IDS.COMPLIANCE]: {
    label: "Compliance",
    icon: "⚖️",
    description: "Confirms regulatory review is complete and no active regional restrictions block the feature.",
  },
  [RULE_IDS.SECURITY]: {
    label: "Security",
    icon: "🔒",
    description: "Validates security risk level is LOW or MEDIUM, and pen testing is complete for features handling sensitive data.",
  },
  [RULE_IDS.PERFORMANCE]: {
    label: "Performance",
    icon: "⚡",
    description: "Ensures projected load impact stays under 20% and a staging load test has passed.",
  },
};

export default function RulesModal({ feature, evaluation, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <div className="modal__title">Business Rule Evaluation</div>
            <div className="modal__subtitle">{feature.name} · {feature.id}</div>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__verdict">
          {evaluation.canEnable ? (
            <div className="verdict verdict--pass">
              ✓ All rules passed — feature can be enabled
            </div>
          ) : (
            <div className="verdict verdict--fail">
              ✗ One or more rules failed — feature cannot be enabled
            </div>
          )}
        </div>

        <div className="modal__body">
          {Object.entries(RULE_META).map(([ruleId, meta]) => {
            const result = evaluation.rules[ruleId];
            return (
              <div key={ruleId} className={`rule-card ${result.passed ? "rule-card--pass" : "rule-card--fail"}`}>
                <div className="rule-card__header">
                  <span className="rule-card__icon">{meta.icon}</span>
                  <div>
                    <div className="rule-card__name">{meta.label} Rule</div>
                    <div className="rule-card__desc">{meta.description}</div>
                  </div>
                  <span className={`rule-card__badge ${result.passed ? "rule-card__badge--pass" : "rule-card__badge--fail"}`}>
                    {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="rule-card__reason">
                  <span className="rule-card__reason-label">Evaluation detail:</span> {result.reason}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-note">
            Use the <strong>Edit</strong> button on the feature row to update attributes and re-evaluate rules.
          </div>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
