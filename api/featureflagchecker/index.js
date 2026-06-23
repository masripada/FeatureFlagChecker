const FLAGS = {
  SECURITY: {
    name: "Security Controls",
    enabled: true,
    reason: "All penetration tests passed and risk level is LOW. Security controls are active across all environments.",
  },
  PERFORMANCE: {
    name: "Performance Optimizer",
    enabled: true,
    reason: "Load impact is under 20% threshold and staging load tests have passed. Feature is live.",
  },
  COMPLIANCE: {
    name: "Compliance Engine",
    enabled: true,
    reason: "Compliance review completed with no regional restrictions. All regulatory checks passed.",
  },
  DASHBOARD: {
    name: "Analytics Dashboard",
    enabled: false,
    reason: "Compliance review pending and EU region restriction applies. Cannot enable until review is complete.",
  },
};

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Feature Flag Checker</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
  <style>
    :root{--green:#86BC25;--green-dark:#75A521;--dark:#282728;--gray:#E6E6E6;--bg:#F5F5F5;--red:#DA291C;--white:#fff;}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Open Sans',sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;}
    header{background:var(--dark);border-top:4px solid var(--green);height:64px;display:flex;align-items:center;gap:16px;padding:0 40px;}
    .wordmark{font-size:22px;font-weight:700;color:var(--white);letter-spacing:-0.5px;}
    .divider{width:1px;height:22px;background:rgba(255,255,255,0.2);}
    .app-title{font-size:13px;color:rgba(255,255,255,0.5);}
    main{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 24px;}
    .card{background:var(--white);border-radius:14px;box-shadow:0 2px 16px rgba(0,0,0,0.09);width:100%;max-width:520px;overflow:hidden;}
    .card-header{background:var(--dark);padding:24px 32px;border-bottom:3px solid var(--green);}
    .card-header h1{font-size:18px;font-weight:700;color:var(--white);margin-bottom:4px;}
    .card-header p{font-size:12px;color:rgba(255,255,255,0.45);}
    .card-body{padding:32px;display:flex;flex-direction:column;gap:24px;}
    label{font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:8px;}
    select{appearance:none;width:100%;padding:12px 44px 12px 16px;border:1.5px solid var(--gray);border-radius:10px;font-size:14px;font-family:inherit;color:var(--dark);background:var(--white) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 16px center;cursor:pointer;transition:border-color 0.15s;}
    select:focus{outline:none;border-color:var(--green);}
    button{background:var(--green);color:var(--white);border:none;border-radius:10px;padding:13px 24px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;width:100%;transition:background 0.15s;display:flex;align-items:center;justify-content:center;gap:8px;}
    button:hover:not(:disabled){background:var(--green-dark);}
    button:disabled{opacity:0.55;cursor:not-allowed;}
    .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    .result{border-radius:10px;border:1.5px solid;overflow:hidden;animation:fadeUp 0.25s ease;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    .result.enabled{border-color:#b6da7a;background:#f5fff0;}
    .result.disabled{border-color:#f5b8b5;background:#fff8f8;}
    .result.error{border-color:#f0d070;background:#fffbea;}
    .result-badge{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid rgba(0,0,0,0.08);}
    .result-icon{font-size:24px;}
    .result-name{font-size:15px;font-weight:700;color:var(--dark);}
    .result-status{font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;margin-top:2px;}
    .enabled .result-status{color:#3a7d0a;}
    .disabled .result-status{color:var(--red);}
    .error .result-status{color:#7a5500;}
    .result-body{padding:14px 20px;font-size:13px;color:#555;line-height:1.6;}
    .result-meta{padding:10px 20px;font-size:11px;color:#555;border-top:1px solid var(--gray);background:rgba(0,0,0,0.02);display:flex;align-items:center;gap:6px;}
    .meta-dot{width:6px;height:6px;border-radius:50%;}
    .enabled .meta-dot{background:var(--green);}
    .disabled .meta-dot{background:var(--red);}
    .error .meta-dot{background:#E8A317;}
  </style>
</head>
<body>
  <header>
    <span class="wordmark">Hashedin By Deloitte.</span>
    <div class="divider"></div>
    <span class="app-title">Feature Flag Checker</span>
  </header>
  <main>
    <div class="card">
      <div class="card-header">
        <h1>Check Feature Flag Status</h1>
        <p>Select a feature to check whether it is enabled or disabled via Azure Functions.</p>
      </div>
      <div class="card-body">
        <div>
          <label for="feature">Select Feature</label>
          <select id="feature" onchange="onSelect()">
            <option value="">— Choose a feature —</option>
            <option value="SECURITY">Security Controls</option>
            <option value="PERFORMANCE">Performance Optimizer</option>
            <option value="COMPLIANCE">Compliance Engine</option>
            <option value="DASHBOARD">Analytics Dashboard</option>
          </select>
        </div>
        <button id="btn" onclick="checkFlag()" disabled>Check Status</button>
        <div id="result"></div>
      </div>
    </div>
  </main>
  <script>
    const FUNCTION_URL = '/api/FeatureFlagChecker';

    function onSelect() {
      document.getElementById('btn').disabled = !document.getElementById('feature').value;
      document.getElementById('result').innerHTML = '';
    }

    async function checkFlag() {
      const featureId = document.getElementById('feature').value;
      const btn = document.getElementById('btn');
      const out = document.getElementById('result');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> Checking via Azure Function…';
      out.innerHTML = '';
      try {
        const res = await fetch(FUNCTION_URL + '?feature=' + featureId);
        const data = await res.json();
        const type = data.enabled ? 'enabled' : 'disabled';
        const icon = data.enabled ? '✅' : '🔴';
        out.innerHTML = '<div class="result ' + type + '">'
          + '<div class="result-badge">'
          + '<span class="result-icon">' + icon + '</span>'
          + '<div>'
          + '<div class="result-name">' + data.featureName + '</div>'
          + '<div class="result-status">' + type + '</div>'
          + '</div></div>'
          + '<div class="result-body">' + data.message + '</div>'
          + '<div class="result-meta"><div class="meta-dot"></div>Responded by Azure Functions &middot; ' + new Date().toLocaleTimeString() + '</div>'
          + '</div>';
      } catch(e) {
        out.innerHTML = '<div class="result error">'
          + '<div class="result-badge"><span class="result-icon">⚠️</span>'
          + '<div><div class="result-name">Error</div><div class="result-status">unreachable</div></div></div>'
          + '<div class="result-body">Could not reach the Azure Function.</div>'
          + '</div>';
      }
      btn.disabled = false;
      btn.innerHTML = 'Check Status';
    }
  </script>
</body>
</html>`;

module.exports = async function (context, req) {
  const featureId = (req.query.feature || "").toUpperCase();

  if (!featureId) {
    context.res = {
      status: 200,
      headers: { "Content-Type": "text/html" },
      body: HTML,
    };
    return;
  }

  const flag = FLAGS[featureId];
  if (!flag) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Unknown feature: " + featureId }),
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
        ? "Feature flag is ENABLED. " + flag.reason
        : "Feature flag is DISABLED. " + flag.reason,
      checkedAt: new Date().toISOString(),
    }),
  };
};
