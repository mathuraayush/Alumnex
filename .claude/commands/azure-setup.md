# Command: Azure Setup

## Goal
Create all required Azure resources for deploying Alumnex.
Ask for confirmation before running every az command.
Report the output of each command before moving to the next.

## Prerequisites Check
Before starting, verify:
1. az --version returns a version number
2. az account show returns the correct subscription
3. docker images shows alumnex-backend and alumnex-frontend

If any check fails, stop and report. Do not proceed.

## Step 1 — Create Resource Group
Ask user to confirm before running:

az group create \
  --name alumnex-rg \
  --location eastus

Report output. Confirm created before moving on.

## Step 2 — Create Azure Container Registry
Ask user to confirm before running:

az acr create \
  --resource-group alumnex-rg \
  --name alumnexregistry \
  --sku Basic \
  --admin-enabled true

Report output. Save the loginServer value — it will be
alumnexregistry.azurecr.io.
Confirm created before moving on.

## Step 3 — Login to ACR and push backend image
Run in sequence, report each output:

az acr login --name alumnexregistry

docker tag alumnex-backend alumnexregistry.azurecr.io/alumnex-backend:latest

docker push alumnexregistry.azurecr.io/alumnex-backend:latest

Confirm push succeeded before moving on.

## Step 4 — Push frontend image
Run in sequence, report each output:

docker tag alumnex-frontend alumnexregistry.azurecr.io/alumnex-frontend:latest

docker push alumnexregistry.azurecr.io/alumnex-frontend:latest

Confirm push succeeded before moving on.

## Step 5 — Create App Service Plan
Ask user to confirm before running:

az appservice plan create \
  --name alumnex-plan \
  --resource-group alumnex-rg \
  --sku B1 \
  --is-linux

Report output. Confirm created before moving on.

## Step 6 — Create Web App for backend
Ask user to confirm before running:

az webapp create \
  --resource-group alumnex-rg \
  --plan alumnex-plan \
  --name alumnex-backend-app \
  --deployment-container-image-name \
    alumnexregistry.azurecr.io/alumnex-backend:latest

Report output. Note the defaultHostName value.
Confirm created before moving on.

## Step 7 — Assign Managed Identity to Web App
Ask user to confirm before running:

az webapp identity assign \
  --resource-group alumnex-rg \
  --name alumnex-backend-app

Save the principalId from the output.
Confirm before moving on.

## Step 8 — Grant Web App pull access to ACR
Replace PRINCIPAL_ID with the value saved in Step 7.
Ask user to confirm before running:

az role assignment create \
  --assignee PRINCIPAL_ID \
  --scope $(az acr show \
    --name alumnexregistry \
    --query id --output tsv) \
  --role AcrPull

Confirm before moving on.

## Step 9 — Set environment variables on Web App
Ask user to provide values for each variable before running.
Do not read or assume values from .env.
Run once with all values:

az webapp config appsettings set \
  --resource-group alumnex-rg \
  --name alumnex-backend-app \
  --settings \
    MONGODB_URI="[ask user]" \
    JWT_SECRET="[ask user]" \
    PORT="5000" \
    NODE_ENV="production" \
    CORS_ORIGIN="[ask user for Azure Static Web Apps URL — available after Step 10]"

Note: CORS_ORIGIN can be set after Step 10 once the frontend URL is known.
Confirm before moving on.

## Step 10 — Create Azure Static Web App for frontend
Ask user to confirm before running.
This command links directly to the GitHub repo for automatic deployment:

az staticwebapp create \
  --name alumnex-frontend-app \
  --resource-group alumnex-rg \
  --source https://github.com/[ask user for their GitHub username]/Alumnex \
  --location eastus2 \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist" \
  --login-with-github

This will open a GitHub OAuth flow. Follow the prompts.
Report the defaultHostname of the Static Web App once created.
Go back to Step 9 and update CORS_ORIGIN with this URL.

## Step 11 — Verify backend is live
curl https://alumnex-backend-app.azurewebsites.net/api/health

Should return {"status":"healthy",...}
If it returns an error wait 2 minutes and retry — cold start can be slow.

## Done
Report:
- Resource Group: alumnex-rg
- Container Registry: alumnexregistry.azurecr.io
- Backend URL: https://alumnex-backend-app.azurewebsites.net
- Frontend URL: from Static Web App defaultHostname
- Managed Identity: configured
- Environment variables: set