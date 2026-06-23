const FLAGS = {
  AI_ASSIST_PRO: {
    name: "AI Assist Pro",
    enabled: true,
    reason: "All compliance, security, and performance rules pass. Live for all regions.",
  },
  CLIENT_360_DASHBOARD: {
    name: "Client 360 Dashboard",
    enabled: false,
    reason: "Restricted in EU region. Compliance review must be updated before enabling globally.",
  },
  SECURE_DATA_ROOM: {
    name: "Secure Data Room",
    enabled: false,
    reason: "Security risk is HIGH and penetration testing not completed.",
  },
  SMART_BILLING_ENGINE: {
    name: "Smart Billing Engine",
    enabled: false,
    reason: "Projected load impact 25% exceeds the 20% threshold. Load test must pass first.",
  },
};

module.exports = async function (context, req) {
  const featureId = (req.query.feature || "").toUpperCase();
  const flag = FLAGS[featureId];

  if (!featureId || !flag) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing or unknown feature parameter." }),
    };
    return;
  }

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      featureId,
      featureName: flag.name,
      enabled: flag.enabled,
      message: flag.enabled
        ? `Feature flag is ENABLED. ${flag.reason}`
        : `Feature flag is DISABLED. ${flag.reason}`,
      checkedAt: new Date().toISOString(),
    }),
  };
};
