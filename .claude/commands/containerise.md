# Command: Containerise

## Goal
Write production-ready Dockerfiles for backend and frontend.
Do not touch any existing application code.

## Step 1 — Backend .dockerignore at root
Create .dockerignore at root with these exact contents:
- node_modules
- npm-debug.log
- .env
- .env.*
- frontend
- .git
- .gitignore
- .vscode
- README.md
- .claude

Confirm file is created before moving on.

## Step 2 — Backend Dockerfile at root
Create Dockerfile at root:
- Base image: node:18-alpine
- WORKDIR: /app
- Copy package*.json first (layer caching)
- Run npm ci --only=production
- Copy remaining source files
- Expose port 5000
- Add HEALTHCHECK hitting /api/health every 30s
- CMD: node server.js

Confirm file is created before moving on.

## Step 3 — Health endpoint
Check if /api/health route already exists in the codebase by searching
all route files and server.js.
If it does not exist, add it to server.js after middleware setup:

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

Do not add it if it already exists.
Confirm before moving on.

## Step 4 — Frontend .dockerignore inside frontend/
Create frontend/.dockerignore:
- node_modules
- dist
- .env
- .env.*

Confirm file is created before moving on.

## Step 5 — Frontend Dockerfile inside frontend/
Create frontend/Dockerfile using multi-stage build:

Stage 1 — builder:
- Base image: node:18-alpine
- WORKDIR: /app
- Copy package*.json
- Run npm ci
- Copy all frontend source files
- Run npm run build
- Output goes to /app/dist

Stage 2 — serve:
- Base image: nginx:alpine
- Copy dist from builder to /usr/share/nginx/html
- Copy nginx.conf to /etc/nginx/conf.d/default.conf
- Expose port 80
- CMD: nginx -g daemon off

Confirm file is created before moving on.

## Step 6 — nginx.conf inside frontend/
Create frontend/nginx.conf:
- Listen on port 80
- Root /usr/share/nginx/html
- index index.html
- try_files for React Router support (all routes fall back to index.html)
- gzip compression enabled
- Cache static assets for 1 year

Confirm file is created before moving on.

## Step 7 — Local build test (backend)
Run these commands and report full output:
docker build -t alumnex-backend .
docker images | grep alumnex-backend

Do not proceed if build fails. Report exact error.

## Step 8 — Local build test (frontend)
Run these commands and report full output:
cd frontend
docker build -t alumnex-frontend .
docker images | grep alumnex-frontend

Do not proceed if build fails. Report exact error.

## Done
Report:
- Both images built successfully with their sizes
- List of all files created in this command
- Confirm no existing application files were modified