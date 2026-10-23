# Project ELARA

> **Live Public URL (User Frontend):** https://projectelara-user.onrender.com

Project ELARA is a full-stack healthcare service booking web application with separate User and Admin frontends backed by an Express application server, instrumented with Prometheus metrics and Grafana dashboards, and orchestrated with Kubernetes.

## Author

| Roll No | Name | GitHub Username |
|---|---|---|
| 24ESKCS039 | Aman Kuntal | amankuntal5008 |

## Live Deployment

- **Live URL**: https://projectelara-user.onrender.com
- **Health Check**: https://projectelara-user.onrender.com/health
- **Prometheus Metrics**: https://projectelara-user.onrender.com/metrics

## Project Structure

```
devops-24ESKCS039/
├── User/               — User-facing React application
├── admin/              — Admin React application
├── k8s/                — Kubernetes Deployment and Service manifests
├── monitoring/         — Prometheus scrape configuration and Grafana dashboard
├── docs/               — Architecture and verification screenshots
├── tests/              — Automated test suites
├── .github/workflows/  — GitHub Actions CI/CD pipeline
├── Dockerfile          — Multi-stage production container image
├── docker-compose.yml  — Multi-container local stack
├── Jenkinsfile         — Jenkins automation pipeline
├── Makefile            — Project automation tasks
├── server.js           — Production Express server with /metrics & /health
└── scripts/            — Repository hygiene checks
```

## Milestone 2 (MT2) Implementation

### 1. Containerization (M5)
- **Dockerfile**: Multi-stage production build in `Dockerfile` that packages dependencies, compiles Vite frontends, and runs an optimized Node.js runtime.
- **Docker Compose**: `docker-compose.yml` configures the application, Prometheus, and Grafana with a shared bridge network and named persistent volumes.
- **Container Registry Push**: Automated GitHub Actions CI workflow in `.github/workflows/ci.yml` builds, tests, and publishes container images to GitHub Container Registry (`ghcr.io/skit-devops-2026/devops-24eskcs039`).

### 2. Deployment and Monitoring (M6)
- **Live URL**: https://projectelara-user.onrender.com
- **Prometheus Scraper**: Configured via `monitoring/prometheus.yml` to scrape `/metrics` every 15s.
- **Grafana Dashboard**: Tracks the Four Golden Signals in `monitoring/dashboard.json`:
  - Latency: 95th percentile response duration
  - Traffic: HTTP request rate
  - Errors: 5xx error percentage
  - Saturation: Process resident memory and event loop lag
- **Evidence**: Deployment and monitoring verification screenshots committed under `docs/`.

### 3. Kubernetes Orchestration (M7)
- **Deployment**: `k8s/deployment.yaml` with 2 replicas, rolling updates, resource limits, and HTTP probes.
- **Service**: `k8s/service.yaml` exposing NodePort on port 80.
- **Cluster Verification**: Verified pod state committed in `docs/k8s-pods.png`.

## Running Locally

```bash
docker compose up --build -d
```
- Web Application: http://localhost:5000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000
