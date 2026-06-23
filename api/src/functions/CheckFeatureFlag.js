const { app } = require("@azure/functions");

const FLAGS = {
  AI_ASSIST_PRO: {
    name: "AI Assist Pro",
    enabled: true,
    reason:
      "All compliance, security, and performance rules pass. This feature is live for all regions.",
  },
  CLIENT_360_DASHBOARD: {
    name: "Client 360 Dashboard",
    enabled: false,
    reason:
      "Feature is restricted in the EU region. Compliance review must be updated before enabling globally.",
  },
  SECURE_DATA_ROOM: {
    name: "Secure Data Room",
    enabled: false,
    reason:
      "Security risk level is HIGH and penetration testing has not been completed. Cannot enable until pen-test passes.",
  },
  SMART_BILLING_ENGINE: {
    name: "Smart Billing Engine",
    enabled: false,
    reason:
      "Projected load impact is 25% — exceeds the 20% threshold. Load test in staging must pass before enabling.",
  },
};

app.http("CheckFeatureFlag", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`CheckFeatureFlag called. URL: ${request.url}`);

    const featureId = request.query.get("feature");

    if (!featureId) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing required query parameter: feature" }),
      };
    }

    const flag = FLAGS[featureId.toUpperCase()];

    if (!flag) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: `Unknown feature: ${featureId}`,
          availableFeatures: Object.keys(FLAGS),
        }),
      };
    }

    return {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        featureId: featureId.toUpperCase(),
        featureName: flag.name,
        enabled: flag.enabled,
        message: flag.enabled
          ? `Feature flag is ENABLED. ${flag.reason}`
          : `Feature flag is DISABLED. ${flag.reason}`,
        checkedAt: new Date().toISOString(),
      }),
    };
  },
});
