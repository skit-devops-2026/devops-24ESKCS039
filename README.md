# Project ELARA

Project ELARA is a full-stack web application with separate User and Admin applications, containerized with Docker, instrumented for monitoring with Prometheus and Grafana, and orchestrated on Kubernetes.

## Author

| Roll No | Name | GitHub Username |
|---|---|---|
| 24ESKCS054 | Aman Kuntal | amankuntal5008 |

## Live Deployment

- **Live URL**: https://devops-24eskcs039.onrender.com
- **Health Check**: https://devops-24eskcs039.onrender.com/health
- **Prometheus Metrics**: https://devops-24eskcs039.onrender.com/metrics

## Project Structure

- `User/` - User client application (React + Vite)
- `admin/` - Admin client application (React + Vite)
- `server.js` - Production Express server serving frontends and Prometheus metrics
- `Dockerfile` - Multi-stage container build for ELARA
- `docker-compose.yml` - Multi-service local stack (App, Prometheus, Grafana)
- `.github/workflows/ci.yml` - GitHub Actions CI/CD with automated testing and GHCR image publishing
- `monitoring/` - Prometheus configuration, alerting rules, and Grafana dashboard JSON
- `k8s/` - Kubernetes manifests (Deployment and NodePort Service)
- `docs/` - Architecture and deployment documentation and verification screenshots
- `Makefile` - Project automation commands
- `scripts/` - Repository hygiene and compliance checks
- `tests/` - Automated test suites

## Milestone 2 (MT2) Implementation

### 1. Containerization (M5)
- **Dockerfile**: Multi-stage Docker build separating frontend Vite asset compilation and production Node runtime.
- **Docker Compose**: Orchestrates `app`, `prometheus`, and `grafana` services with dedicated bridge network and persistent data volumes.
- **Container Registry**: Automated CI pipeline publishes versioned container images to GitHub Container Registry:
  `ghcr.io/skit-devops-2026/devops-24ESKCS039:latest`

### 2. Deployment and Monitoring (M6)
- **Deployment**: Live web application deployed and responding to HTTP requests with health check probe.
- **Prometheus Monitoring**: Scrapes application metrics via `/metrics` every 15 seconds.
- **Grafana Dashboard**: Tracks the Four Golden Signals:
  - *Latency*: 95th percentile response time (`http_request_duration_seconds`)
  - *Traffic*: Request rate per second (`http_requests_total`)
  - *Errors*: HTTP 5xx error rate
  - *Saturation*: Resident memory usage (`process_resident_memory_bytes`)
- **Evidence**: Complete Grafana dashboard JSON model committed to `monitoring/dashboard.json`, and deployment screenshots committed under `docs/`.

### 3. Kubernetes Orchestration (M7)
- **Deployment**: Multi-replica pod deployment with rolling update strategy, container resource limits, and HTTP liveness/readiness probes (`k8s/deployment.yaml`).
- **Service**: NodePort service routing traffic on port 80 to container port 5000 (`k8s/service.yaml`).
- **Cluster Verification**: Verified running pods under kind/k8s cluster (`docs/k8s-pods.png`).

## Repository

https://github.com/amankuntal5008/Project-ELARA

## Quickstart

Run the full stack with Docker Compose:
```bash
docker compose up --build
```
Access the services:
- ELARA Application: http://localhost:5000
- Prometheus Server: http://localhost:9090
- Grafana Dashboards: http://localhost:3000 (login: `admin` / `admin`)
