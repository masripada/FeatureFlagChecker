# Deloitte Feature Flag Manager

An internal admin tool for managing feature flags on the **Deloitte Navigator** platform. Feature flags are gated by three business rules — Compliance, Security, and Performance — that must all pass before a feature can be enabled.

---

## Quick Start

### Prerequisites
- Node.js 16+ installed
- VS Code (or any terminal)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

The app opens at **http://localhost:3000**

---

## Login

Use the admin credential to sign in:

| User ID | Name | Role |
|---------|------|------|
| `DL-55501` | Marcus Bell | IT Platform Admin |

---

## Features Managed

| Feature ID | Name | Default State |
|---|---|---|
| `AI_ASSIST_PRO` | AI Assist Pro | ✅ Enabled |
| `CLIENT_360_DASHBOARD` | Client 360 Dashboard | ❌ Disabled (EU restriction) |
| `SECURE_DATA_ROOM` | Secure Data Room | ❌ Disabled (high security risk) |
| `BETA_ANALYTICS_STUDIO` | Beta Analytics Studio | ❌ Disabled (no compliance review) |
| `SMART_BILLING_ENGINE` | Smart Billing Engine | ❌ Disabled (load too high) |

---

## Business Rules

All three rules must pass before a feature can be enabled.

### 1. Compliance Rule
- Compliance review must be completed
- No active regional restrictions (EU, APAC, US, LATAM, ME)

### 2. Security Rule
- Security risk level must be LOW or MEDIUM (HIGH/CRITICAL blocked)
- If feature handles sensitive data, a penetration test must be completed

### 3. Performance Rule
- Projected load impact must be under 20%
- Staging load test must have passed

---

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Authentication screen
│   ├── Dashboard.js      # Main admin dashboard
│   ├── FeatureRow.js     # Table row for each feature
│   ├── RulesModal.js     # Rule evaluation detail view
│   └── EditModal.js      # Edit feature attributes + live rule preview
├── data/
│   └── features.js       # Feature definitions and admin user
├── utils/
│   └── businessRules.js  # Core rules engine (Compliance, Security, Performance)
├── App.js
├── App.css
└── index.js
```

---

## How to Add a Feature

Open `src/data/features.js` and add a new entry to `INITIAL_FEATURES`:

```js
{
  id: "MY_FEATURE",
  name: "My Feature",
  description: "What it does.",
  category: "Category",
  complianceReviewed: false,
  restrictedRegions: [],
  securityRiskLevel: "LOW",
  handlesSensitiveData: false,
  penTestCompleted: false,
  projectedLoadImpact: 5,
  loadTestPassed: false,
  enabled: false,
  enabledAt: null,
  enabledBy: null,
}
```

## How to Modify a Business Rule

Open `src/utils/businessRules.js`. Each rule is its own function:
- `evaluateCompliance(feature)` — Compliance gate
- `evaluateSecurity(feature)` — Security gate
- `evaluatePerformance(feature)` — Performance gate

Change thresholds, add conditions, or introduce new attributes as needed. The UI automatically re-evaluates rules live in the Edit modal.
