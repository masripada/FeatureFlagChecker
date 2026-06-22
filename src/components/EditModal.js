import React, { useState } from "react";
import { evaluateAllRules } from "../utils/businessRules";

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const ALL_REGIONS = ["EU", "APAC", "US", "LATAM", "ME"];

export default function EditModal({ feature, onSave, onClose }) {
  const [form, setForm] = useState({ ...feature });

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRegion(region) {
    const current = form.restrictedRegions || [];
    const next = current.includes(region)
      ? current.filter((r) => r !== region)
      : [...current, region];
    set("restrictedRegions", next);
  }

  const preview = evaluateAllRules(form);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <div className="modal__title">Edit Feature Attributes</div>
            <div className="modal__subtitle">{feature.name} · {feature.id}</div>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body edit-grid">
          {/* ── Left: form fields ── */}
          <div className="edit-fields">
            <div className="edit-section-title">⚖️ Compliance</div>

            <div className="field-group">
              <label className="field-label">Compliance review completed</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="cr" checked={form.complianceReviewed === true}
                    onChange={() => set("complianceReviewed", true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="cr" checked={form.complianceReviewed === false}
                    onChange={() => set("complianceReviewed", false)} />
                  No
                </label>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Restricted regions</label>
              <div className="checkbox-group">
                {ALL_REGIONS.map((r) => (
                  <label key={r} className="radio-label">
                    <input type="checkbox" checked={form.restrictedRegions?.includes(r)}
                      onChange={() => toggleRegion(r)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="edit-section-title" style={{ marginTop: "1.5rem" }}>🔒 Security</div>

            <div className="field-group">
              <label className="field-label">Security risk level</label>
              <select className="field-input" value={form.securityRiskLevel}
                onChange={(e) => set("securityRiskLevel", e.target.value)}>
                {RISK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Handles sensitive data</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="hsd" checked={form.handlesSensitiveData === true}
                    onChange={() => set("handlesSensitiveData", true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="hsd" checked={form.handlesSensitiveData === false}
                    onChange={() => set("handlesSensitiveData", false)} />
                  No
                </label>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Penetration test completed</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="pt" checked={form.penTestCompleted === true}
                    onChange={() => set("penTestCompleted", true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="pt" checked={form.penTestCompleted === false}
                    onChange={() => set("penTestCompleted", false)} />
                  No
                </label>
              </div>
            </div>

            <div className="edit-section-title" style={{ marginTop: "1.5rem" }}>⚡ Performance</div>

            <div className="field-group">
              <label className="field-label">
                Projected load impact: <strong>{form.projectedLoadImpact}%</strong>
                <span style={{ marginLeft: 8, color: form.projectedLoadImpact > 20 ? "#DA291C" : "#3a7d0a", fontSize: 12 }}>
                  {form.projectedLoadImpact > 20 ? "⚠ Exceeds 20% threshold" : "✓ Within threshold"}
                </span>
              </label>
              <input type="range" min={1} max={50} step={1} value={form.projectedLoadImpact}
                onChange={(e) => set("projectedLoadImpact", Number(e.target.value))}
                className="range-input" />
            </div>

            <div className="field-group">
              <label className="field-label">Staging load test passed</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="lt" checked={form.loadTestPassed === true}
                    onChange={() => set("loadTestPassed", true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="lt" checked={form.loadTestPassed === false}
                    onChange={() => set("loadTestPassed", false)} />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* ── Right: live rule preview ── */}
          <div className="edit-preview">
            <div className="edit-section-title">Live Rule Preview</div>
            <div className={`verdict ${preview.canEnable ? "verdict--pass" : "verdict--fail"}`}
                 style={{ marginBottom: "1rem" }}>
              {preview.canEnable ? "✓ Can be enabled" : "✗ Cannot be enabled"}
            </div>
            {Object.entries(preview.rules).map(([ruleId, result]) => (
              <div key={ruleId} className={`preview-rule ${result.passed ? "preview-rule--pass" : "preview-rule--fail"}`}>
                <div className="preview-rule__header">
                  <span>{ruleId}</span>
                  <span>{result.passed ? "✓" : "✗"}</span>
                </div>
                <div className="preview-rule__reason">{result.reason}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
