# Alumnex — Claude Code Project Instructions

## Project Overview
Full-stack MERN application being containerised and deployed to Azure.
- Backend: root level, entry point server.js, port 5000
- Frontend: frontend/ subfolder, React + Vite + Tailwind CSS
- Environment variables: .env file using dotenv
- Current deployment: Render (backend), Vercel (frontend)
- Target deployment: Azure App Service (backend), Azure Static Web Apps (frontend)

## Absolute Rules
- Never modify existing business logic, routes, controllers, models, or middleware
- Never modify or read .env contents — treat it as a black box
- Never expose or log any secret, key, or connection string
- Always ask before running az commands that create billable Azure resources
- Always verify locally in Codespaces before pushing anything to Azure
- One step at a time — complete and confirm before moving to the next

## Stack
- Backend: Node.js, Express.js, MongoDB, JWT
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit
- Cloud: Microsoft Azure
- CI/CD: GitHub Actions

## Commands — Run in This Order
/containerise   → Step 1: Write Dockerfiles and .dockerignore files
/azure-setup    → Step 2: Create all required Azure resources
/cicd           → Step 3: Wire GitHub Actions deployment pipeline
/verify         → Step 4: Test every piece locally and on Azure

## Before Starting Any Command
Read the full repo structure first:
- List all files at root level
- List all files inside frontend/
- Check package.json at root for start script and dependencies
- Check frontend/package.json for build script and dependencies
Confirm findings before proceeding.