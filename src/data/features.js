// ─────────────────────────────────────────────────────────────────────────────
// FEATURE DEFINITIONS
// Each feature carries the metadata the rules engine evaluates.
// Admins can edit these properties and toggle the enabled flag.
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_FEATURES = [
  {
    id: "AI_ASSIST_PRO",
    name: "AI Assist Pro",
    description: "Advanced AI writing and summarisation assistant embedded in project workspaces. Accelerates proposal drafting, client memo generation, and knowledge synthesis.",
    category: "Productivity",
    // Compliance attributes
    complianceReviewed: true,
    restrictedRegions: [],
    // Security attributes
    securityRiskLevel: "MEDIUM",
    handlesSensitiveData: true,
    penTestCompleted: true,
    // Performance attributes
    projectedLoadImpact: 12,
    loadTestPassed: true,
    // Flag state
    enabled: true,
    enabledAt: "2025-09-01",
    enabledBy: "Marcus Bell (DL-55501)",
  },
  {
    id: "CLIENT_360_DASHBOARD",
    name: "Client 360 Dashboard",
    description: "Unified client intelligence view pulling CRM data, engagement history, and risk signals into a single, real-time screen for Engagement Partners.",
    category: "Client Intelligence",
    complianceReviewed: true,
    restrictedRegions: ["EU"],
    securityRiskLevel: "MEDIUM",
    handlesSensitiveData: true,
    penTestCompleted: true,
    projectedLoadImpact: 17,
    loadTestPassed: true,
    enabled: false,
    enabledAt: null,
    enabledBy: null,
  },
  {
    id: "SECURE_DATA_ROOM",
    name: "Secure Data Room",
    description: "Encrypted document exchange module for sensitive engagements such as M&A transactions and regulatory investigations. End-to-end encrypted with full audit trail.",
    category: "Security & Compliance",
    complianceReviewed: true,
    restrictedRegions: [],
    securityRiskLevel: "HIGH",
    handlesSensitiveData: true,
    penTestCompleted: false,
    projectedLoadImpact: 8,
    loadTestPassed: true,
    enabled: false,
    enabledAt: null,
    enabledBy: null,
  },
  {
    id: "BETA_ANALYTICS_STUDIO",
    name: "Beta Analytics Studio",
    description: "Self-serve data visualisation and reporting sandbox. Allows practitioners to build custom dashboards from approved Deloitte Navigator data sources.",
    category: "Analytics",
    complianceReviewed: false,
    restrictedRegions: [],
    securityRiskLevel: "LOW",
    handlesSensitiveData: false,
    penTestCompleted: false,
    projectedLoadImpact: 9,
    loadTestPassed: false,
    enabled: false,
    enabledAt: null,
    enabledBy: null,
  },
  {
    id: "SMART_BILLING_ENGINE",
    name: "Smart Billing Engine",
    description: "AI-powered timesheet and billing automation that categorises entries, flags anomalies, and generates draft invoices for Partner review — reducing billing cycle time by up to 40%.",
    category: "Finance & Operations",
    complianceReviewed: true,
    restrictedRegions: [],
    securityRiskLevel: "MEDIUM",
    handlesSensitiveData: true,
    penTestCompleted: true,
    projectedLoadImpact: 25,
    loadTestPassed: false,
    enabled: false,
    enabledAt: null,
    enabledBy: null,
  },
];

export const ADMIN_USER = {
  id: "DL-55501",
  name: "Marcus Bell",
  role: "IT Platform Admin",
  practice: "Internal Technology",
};
