// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS RULES ENGINE
// Three gates that a feature must pass before a flag can be set to ENABLED.
// Each rule returns { passed: boolean, reason: string }
// ─────────────────────────────────────────────────────────────────────────────

export const RULE_IDS = {
  COMPLIANCE: "COMPLIANCE",
  SECURITY: "SECURITY",
  PERFORMANCE: "PERFORMANCE",
};

// ── Rule 1: Compliance ───────────────────────────────────────────────────────
// A feature can only be enabled if it has completed a compliance review AND
// is not restricted in any active regulatory region it operates in.
export function evaluateCompliance(feature) {
  if (!feature.complianceReviewed) {
    return {
      passed: false,
      reason: "Compliance review not completed. Feature must pass regulatory review before activation.",
    };
  }
  if (feature.restrictedRegions && feature.restrictedRegions.length > 0) {
    return {
      passed: false,
      reason: `Feature is restricted in active regions: ${feature.restrictedRegions.join(", ")}. Resolve regional restrictions first.`,
    };
  }
  return {
    passed: true,
    reason: "Compliance check passed. Review complete and no active regional restrictions.",
  };
}

// ── Rule 2: Security ─────────────────────────────────────────────────────────
// A feature can only be enabled if its security risk level is LOW or MEDIUM,
// AND it has completed a penetration test (if it handles sensitive data).
export function evaluateSecurity(feature) {
  const blockedRiskLevels = ["HIGH", "CRITICAL"];
  if (blockedRiskLevels.includes(feature.securityRiskLevel)) {
    return {
      passed: false,
      reason: `Security risk level is "${feature.securityRiskLevel}". Only LOW or MEDIUM risk features may be enabled.`,
    };
  }
  if (feature.handlesSensitiveData && !feature.penTestCompleted) {
    return {
      passed: false,
      reason: "Feature handles sensitive data but penetration testing has not been completed.",
    };
  }
  return {
    passed: true,
    reason: `Security check passed. Risk level: ${feature.securityRiskLevel}${feature.handlesSensitiveData ? ", pen test verified" : ""}.`,
  };
}

// ── Rule 3: Performance ──────────────────────────────────────────────────────
// A feature can only be enabled if its projected load impact is below 20%
// of baseline AND it has passed a load test in staging.
export function evaluatePerformance(feature) {
  const MAX_LOAD_IMPACT_PERCENT = 20;
  if (feature.projectedLoadImpact > MAX_LOAD_IMPACT_PERCENT) {
    return {
      passed: false,
      reason: `Projected load impact is ${feature.projectedLoadImpact}%, exceeding the 20% threshold. Optimise before enabling.`,
    };
  }
  if (!feature.loadTestPassed) {
    return {
      passed: false,
      reason: "Load test in staging environment has not been completed or did not pass.",
    };
  }
  return {
    passed: true,
    reason: `Performance check passed. Load impact: ${feature.projectedLoadImpact}%, staging load test verified.`,
  };
}

// ── Master Evaluator ─────────────────────────────────────────────────────────
// Runs all three rules and returns a summary. If any rule fails, the feature
// cannot be enabled — the admin is shown which rules blocked it and why.
export function evaluateAllRules(feature) {
  const compliance = evaluateCompliance(feature);
  const security = evaluateSecurity(feature);
  const performance = evaluatePerformance(feature);

  const allPassed = compliance.passed && security.passed && performance.passed;

  return {
    canEnable: allPassed,
    rules: {
      [RULE_IDS.COMPLIANCE]: compliance,
      [RULE_IDS.SECURITY]: security,
      [RULE_IDS.PERFORMANCE]: performance,
    },
  };
}
