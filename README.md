# Task Manager — Full Stack MVC Application

A multi-user task management application built with Node.js, React, and PostgreSQL.
Deployed using Docker Compose with a local CI/CD pipeline and Kubernetes simulation via Minikube.

## Architecture Overview
Browser → Nginx (Port 80)
├── /api/*  → Backend (Express + Node.js)
│                └── PostgreSQL Database
└── /*      → Frontend (React + Vite)

## MVC Structure

Models      → Sequelize ORM (User, Task)        backend/src/models/
Controllers → Business logic (auth, tasks)      backend/src/controllers/
Views       → React UI components               frontend/src/

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (production), SQLite (testing) |
| Auth | JWT (JSON Web Tokens) |
| Proxy | Nginx |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Kubernetes | Minikube, kubectl |

## Project Structure
task-manager/
├── backend/
│   ├── src/
│   │   ├── models/          # User and Task schemas (Sequelize)
│   │   ├── controllers/     # Auth and Task business logic
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/       # JWT auth middleware
│   │   └── app.js           # Express app entry point
│   ├── tests/               # Jest test suites (14 tests)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Tasks pages
│   │   ├── services/        # Axios API service layer
│   │   └── App.jsx          # React Router setup
│   └── Dockerfile
├── nginx/
│   └── nginx.conf           # Reverse proxy configuration
├── k8s/
│   ├── namespace.yaml
│   ├── postgres-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD pipeline
└── docker-compose.yml

## Prerequisites

- Docker Desktop
- Node.js 20+
- Git
- Minikube (for Kubernetes simulation)
- kubectl

## Setup and Run

### Option 1 — Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/keerthanajalla/task-manager.git
cd task-manager

# Start all services
docker compose up --build

# Open browser
http://localhost
```

### Option 2 — Kubernetes with Minikube

```bash
# Start Minikube
minikube start --driver=docker

# Load images into Minikube
minikube image load task-manager-backend:latest
minikube image load task-manager-frontend:latest

# Enable ingress
minikube addons enable ingress

# Deploy all resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check pods are running
kubectl get pods -n taskmanager

# Access the app
minikube service frontend -n taskmanager --url
```

## Running Tests

```bash
cd backend
npm test
```

Expected output:
Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total

## Running Linter

```bash
cd backend
npm run lint
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|---------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/tasks | Get all user tasks | Yes |
| POST | /api/tasks | Create new task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| GET | /health | Health check | No |

## CI/CD Pipeline

GitHub Actions runs automatically on every push to `main`:

CI Pipeline
├── Lint and Test Backend    → ESLint + 14 Jest tests
├── Build Docker Images      → backend + frontend images
└── Integration Tests        → health + auth endpoint tests

## Kubernetes Deployment

```bash
# View all resources
kubectl get all -n taskmanager

# Scale backend replicas
kubectl scale deployment backend -n taskmanager --replicas=3

# View logs
kubectl logs -n taskmanager -l app=backend
```

## Design Decisions

- **MVC Architecture** — Clear separation of Models, Views, Controllers
- **JWT Authentication** — Stateless, scalable auth with 24h token expiry
- **Relative API URL** — Frontend uses `/api` to route through Nginx
- **SQLite for tests** — No database dependency during CI/CD
- **2 Backend replicas** — Demonstrates Kubernetes high availability
- **Non-persistent containers** — App logic is stateless, only DB persists data
- **Init containers** — Backend waits for PostgreSQL before starting

## Assumptions

- Single machine local deployment
- JWT tokens stored in browser localStorage
- PostgreSQL data persisted in Docker named volume
- Minikube uses Docker driver on Windows

## How to Stop

```bash
# Docker Compose
docker compose down

# Minikube
minikube stop
```