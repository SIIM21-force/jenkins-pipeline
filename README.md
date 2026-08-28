# CI/CD Automated Deployment Pipeline with Jenkins & Podman

An end-to-end Continuous Integration and Continuous Deployment (CI/CD) pipeline for a Node.js Express web application using **Jenkins Declarative Pipeline** and **Podman** container engine.

---

## 📌 Project Overview

This project automates the testing, container image building, deployment, and health verification of a containerized Node.js application. Whenever changes are committed and built, Jenkins orchestrates the lifecycle:

```
[Git Commit / SCM]
       │
       ▼
[Jenkins Pipeline]
       ├─► 1. Install & Test (Node.js test suite)
       ├─► 2. Build Container Image (Podman)
       ├─► 3. Deploy Application (Run rootless container)
       └─► 4. Health Check (Automated curl verification)
       │
       ▼
[Running Container] ──► http://localhost:3000
```

---

## 📂 Repository Structure

```tree
.
├── Jenkinsfile         # Declarative CI/CD pipeline definition
├── Dockerfile          # Multi-stage container definition for Node.js
├── app.js              # Express web application with health endpoint
├── package.json        # Project metadata and dependencies
├── test/
│   └── app.test.js     # Native Node.js test suite
├── 2nd-build.txt       # Build console log demonstrating successful pipeline
├── errorcode.txt       # Log from initial troubleshooting phase
└── README.md           # Project documentation
```

---

## 🚀 Application Details

* **Runtime:** Node.js 20 (Alpine Linux base)
* **Framework:** Express.js
* **Endpoints:**
  * `GET /` — Landing page with deployment confirmation.
  * `GET /health` — Service health check returning JSON `{ "status": "OK", "uptime": <seconds> }`.
* **Testing:** Built-in Node test runner (`node --test`).

---

## ⚙️ CI/CD Pipeline Breakdown (`Jenkinsfile`)

The pipeline is written as a Jenkins Declarative Pipeline with the following stages:

| Stage | Action | Description |
|---|---|---|
| **Install & Test** | `npm install`<br>`npm test` | Installs dependencies and runs automated test suite. |
| **Build Container Image** | `podman build --cgroup-manager=cgroupfs -t simple-web-app:latest .` | Builds the OCI container image using Podman. |
| **Deploy Application** | `podman run --cgroup-manager=cgroupfs -d --name simple-web-app-container -p 3000:3000 simple-web-app:latest` | Stops previous container and spins up the newly built instance. |
| **Health Check** | `curl -f http://localhost:3000/health` | Validates that the application is alive and responding with HTTP 200. |
| **Post Actions** | `cleanWs()` | Cleans up the workspace on completion. |

---

## 🐳 Containerization (`Dockerfile`)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 💡 Troubleshooting & Technical Notes

### Rootless Podman in Jenkins (cgroupv2 / systemd session issue)
* **Issue:** When Jenkins runs as a non-interactive service user (`jenkins`), systemd does not automatically allocate a user session bus, causing `crun` / `systemd` cgroup manager to return `Permission denied` / `Access denied`.
* **Resolution:**
  1. Enabled lingering for the Jenkins user:
     ```bash
     sudo loginctl enable-linger jenkins
     ```
  2. Configured Podman to use `cgroupfs` in the `Jenkinsfile`:
     ```bash
     podman build --cgroup-manager=cgroupfs -t simple-web-app:latest .
     podman run --cgroup-manager=cgroupfs -d --name simple-web-app-container -p 3000:3000 simple-web-app:latest
     ```

---

## 🧪 Local Testing & Manual Run

### 1. Run Tests Locally
```bash
npm install
npm test
```

### 2. Build and Run with Podman
```bash
# Build the container image
podman build -t simple-web-app:latest .

# Run the container
podman run -d --name simple-web-app-container -p 3000:3000 simple-web-app:latest

# Check status
curl http://localhost:3000/health
```

---
