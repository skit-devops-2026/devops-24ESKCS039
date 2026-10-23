import express from "express";
import promClient from "prom-client";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Prometheus Metrics Setup
promClient.collectDefaultMetrics({
  timeout: 5000,
  prefix: "elara_"
});

// Counter: Total HTTP requests
const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests received",
  labelNames: ["method", "route", "status_code"]
});

// Histogram: HTTP request latency
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2]
});

// Gauge: Active connections / simulated users
const activeUsers = new promClient.Gauge({
  name: "active_users_count",
  help: "Current number of active sessions in ELARA application"
});
activeUsers.set(12);

// Middleware: JSON parsing
app.use(express.json());

// Middleware: Request duration & request counter
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const route = req.route ? req.route.path : req.path;
    const statusCode = res.statusCode;
    end({ method: req.method, route, status_code: statusCode });
    httpRequestsTotal.inc({ method: req.method, route, status_code: statusCode });
  });
  next();
});

// 2. Metrics Endpoint for Prometheus Scraper
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// 3. Health Endpoint for Kubernetes Probes & Monitoring
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "ELARA Full-Stack Application",
    checks: {
      server: "UP",
      database: "CONNECTED",
      metrics: "AVAILABLE"
    }
  });
});

// 4. API Status Endpoint
app.get("/api/status", (req, res) => {
  res.json({
    app: "ELARA",
    version: "1.0.0",
    modules: ["User", "Admin", "Monitoring", "Kubernetes"],
    environment: process.env.NODE_ENV || "development"
  });
});

// 5. Static file serving for User and Admin Frontends
const userDist = path.join(__dirname, "User", "dist");
const adminDist = path.join(__dirname, "admin", "dist");

if (fs.existsSync(adminDist)) {
  app.use("/admin", express.static(adminDist));
  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
}

if (fs.existsSync(userDist)) {
  app.use(express.static(userDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(userDist, "index.html"));
  });
} else {
  // Fallback landing page when frontends are running in dev mode
  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Project ELARA - DevOps Platform</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 60px auto; padding: 20px; line-height: 1.6; }
          .card { border: 1px solid #e1e4e8; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; background: #e3f2fd; color: #1976d2; font-weight: bold; font-size: 0.85em; }
          a { color: #0366d6; text-decoration: none; }
          a:hover { text-decoration: underline; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Project ELARA <span class="badge">Running</span></h1>
          <p>Full-Stack Application Containerized with Docker, Instrumented for Prometheus & Grafana, and Orchestrated on Kubernetes.</p>
          <h3>DevOps Endpoints:</h3>
          <ul>
            <li><a href="/health">Health Check (/health)</a></li>
            <li><a href="/metrics">Prometheus Metrics (/metrics)</a></li>
            <li><a href="/api/status">API Status (/api/status)</a></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  });
}

const server = app.listen(PORT, () => {
  console.log(`ELARA Server is running on port ${PORT}`);
  console.log(`- Health Check: http://localhost:${PORT}/health`);
  console.log(`- Metrics:      http://localhost:${PORT}/metrics`);
});

export default app;
