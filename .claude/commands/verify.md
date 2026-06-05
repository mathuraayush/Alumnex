# Command: Verify

## Goal
Systematically test every piece of the deployment is working correctly.
Run these checks in order. Stop and report any failure immediately.

## Local Checks

Check 1 — Backend image runs cleanly
docker run -p 5000:5000 --env-file .env alumnex-backend
In a second terminal: curl http://localhost:5000/api/health
Expected: {"status":"healthy","timestamp":"...","uptime":...}
Stop container after test.

Check 2 — Frontend image runs cleanly
docker run -p 3000:80 alumnex-frontend
In a second terminal: curl http://localhost:3000
Expected: HTML response (React app shell)
Stop container after test.

Check 3 — Both images exist in ACR
az acr repository list --name alumnexregistry
Expected: ["alumnex-backend", "alumnex-frontend"]

az acr repository show-tags \
  --name alumnexregistry \
  --repository alumnex-backend
Expected: ["latest"] plus one or more git SHA tags

## Azure Checks

Check 4 — Backend health on Azure
curl https://alumnex-backend-app.azurewebsites.net/api/health
Expected: {"status":"healthy",...}
If timeout: wait 2 minutes, retry once. Cold start is normal.

Check 5 — Backend environment variables set correctly
az webapp config appsettings list \
  --name alumnex-backend-app \
  --resource-group alumnex-rg \
  --query "[].{name:name}" \
  --output table
Expected: MONGODB_URI, JWT_SECRET, PORT, NODE_ENV, CORS_ORIGIN all present
Do not print values — only confirm keys exist.

Check 6 — Managed Identity is assigned
az webapp identity show \
  --name alumnex-backend-app \
  --resource-group alumnex-rg \
  --query principalId
Expected: a non-empty GUID

Check 7 — Frontend is live
curl -I https://[static-web-app-hostname]
Expected: HTTP/2 200

Check 8 — CI/CD pipeline ran successfully
Instruct user to check:
GitHub repo → Actions → most recent workflow run
Both deploy-backend and deploy-frontend jobs should show green.

## Integration Check

Check 9 — Frontend can reach backend
Open the frontend URL in browser.
Try to load data that requires an API call.
Open browser DevTools → Network tab.
Confirm API calls go to the Azure backend URL not Render.
Confirm no CORS errors in console.

## Final Report
After all checks pass, report:
- Backend URL: https://alumnex-backend-app.azurewebsites.net
- Frontend URL: https://[static-web-app-hostname]
- ACR: alumnexregistry.azurecr.io
- CI/CD: active, both jobs green
- Health check: passing
- CORS: clean
- Deployment is production-ready