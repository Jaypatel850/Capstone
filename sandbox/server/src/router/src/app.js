const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
app.use(morgan("combined"));
app.get("/api/status/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/status/readyz", (req, res) => {
  res.status(200).json({ status: "ready" });
});
const proxies = {};
const agentproxies = {}; //*.agent.localhost
function getProxy(sandboxId) {
  if (!proxies[sandboxId]) {
    const target = `http://sandbox-service-${sandboxId}`;
    proxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }
  return proxies[sandboxId];
}
function getAgentProxy(sandboxId) {
  if (!agentproxies[sandboxId]) {
    const target = `http://sandbox-agent-${sandboxId}:3000`;
    agentproxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }
  return agentproxies[sandboxId];
}
app.use((req, res, next) => {
  const host = req.headers.host;
  const SandboxId = host.split(".")[0];
  if (host.split(".")[1] == "agent") {
    const agentproxy = getAgentProxy(SandboxId);
    return agentproxy(req, res, next);
  }
  else if(host.split(".")[1] == "preview"){ {
    return getProxy(SandboxId)(req, res, next);
  }};
});
module.exports = app;
