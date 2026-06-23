# FeatureFlagChecker

A React app for checking feature flags, with an Azure App Service deployment workflow.

## Setup

1. Install Node.js (recommended v20.x) from https://nodejs.org
2. Open a terminal in the repository root
3. Run:
   ```bash
   npm install
   ```

## Run locally

```bash
npm start
```

## Build for production

```bash
npm run build
```

## Deployment

Deployment is configured in `.github/workflows/deploy.yml` using `azure/webapps-deploy@v3`.

The workflow expects the secret `masripadafeatureflag_PUBLISH_PROFILE` in GitHub Actions secrets.
