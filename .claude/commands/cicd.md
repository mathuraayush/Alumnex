# Command: CI/CD Pipeline

## Goal
Create a GitHub Actions workflow that automatically builds, pushes,
and deploys both backend and frontend on every push to main.
No manual deployment steps after this is set up.

## Prerequisites Check
Before starting verify:
1. Both Azure resources from /azure-setup are confirmed live
2. Backend health check returns healthy
3. User has access to GitHub repo Settings to add secrets

If any check fails stop and report.

## Step 1 — Create workflow directory
mkdir -p .github/workflows

## Step 2 — Get required values from user
Ask the user to provide:
1. ACR username (from: az acr credential show --name alumnexregistry --query username)
2. ACR password (from: az acr credential show --name alumnexregistry --query passwords[0].value)
3. Azure Web App publish profile
   (from: Azure Portal → alumnex-backend-app → Overview → Get publish profile → download file → paste contents)
4. Static Web App deployment token
   (from: az staticwebapp secrets list --name alumnex-frontend-app --query properties.apiKey)

Tell user to add these as GitHub Secrets:
- ACR_USERNAME
- ACR_PASSWORD
- AZURE_WEBAPP_PUBLISH_PROFILE
- STATIC_WEB_APPS_API_TOKEN

Do not proceed until user confirms all four secrets are added.

## Step 3 — Create workflow file
Create .github/workflows/deploy.yml with these exact jobs:

Trigger: push to main branch only

Job 1 — deploy-backend:
- runs-on: ubuntu-latest
- Steps:
  1. Checkout code (actions/checkout@v4)
  2. Login to ACR using ACR_USERNAME and ACR_PASSWORD secrets
  3. Build Docker image tagged with both :latest and :${{ github.sha }}
  4. Push both tags to ACR
  5. Deploy to Azure Web App using azure/webapps-deploy@v2
     with the AZURE_WEBAPP_PUBLISH_PROFILE secret
     using the :${{ github.sha }} tagged image

Job 2 — deploy-frontend:
- runs-on: ubuntu-latest
- Steps:
  1. Checkout code (actions/checkout@v4)
  2. Deploy using Azure/static-web-apps-deploy@v1
     with STATIC_WEB_APPS_API_TOKEN secret
     app_location: /frontend
     output_location: dist

Confirm file is created before moving on.

## Step 4 — Commit and push to trigger pipeline
git add .github/workflows/deploy.yml
git commit -m "ci: add Azure deployment pipeline for backend and frontend"
git push origin main

## Step 5 — Monitor the pipeline
Tell user to go to:
GitHub repo → Actions tab → watch the workflow run

Report what to look for:
- Green checkmark on both jobs = success
- Red X = failure, check logs and report exact error message

## Step 6 — Verify deployment
After pipeline succeeds run:
curl https://alumnex-backend-app.azurewebsites.net/api/health

Should return healthy. Frontend should be live at Static Web App URL.

## Done
Report:
- Workflow file location: .github/workflows/deploy.yml
- Backend auto-deploys on every push to main via Docker + ACR
- Frontend auto-deploys on every push to main via Static Web Apps
- Both tagged with git SHA for traceability