module.exports = async function (context, req) {
  context.log("HTTP trigger: GetFeatureFlags called");

  const features = [
    {
      id: "AI_ASSIST_PRO",
      name: "AI Assist Pro",
      description:
        "Advanced AI writing and summarisation assistant embedded in project workspaces.",
      category: "Productivity",
      complianceReviewed: true,
      restrictedRegions: [],
      securityRiskLevel: "MEDIUM",
      handlesSensitiveData: true,
      penTestCompleted: true,
      projectedLoadImpact: 12,
      loadTestPassed: true,
      enabled: true,
      enabledAt: "2025-09-01",
      enabledBy: "Marcus Bell (DL-55501)",
    },
    {
      id: "CLIENT_360_DASHBOARD",
      name: "Client 360 Dashboard",
      description:
        "Unified client intelligence view pulling CRM data, engagement history, and risk signals.",
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
      description:
        "Encrypted document exchange module for sensitive engagements such as M&A transactions.",
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
      description:
        "Self-serve data visualisation and reporting sandbox for custom dashboards.",
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
      description:
        "AI-powered timesheet and billing automation that categorises entries and flags anomalies.",
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

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: {
      features,
      fetchedAt: new Date().toISOString(),
      source: "Azure Functions HTTP Trigger — GetFeatureFlags",
    },
  };
};
