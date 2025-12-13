# Deploy DevTools.site via Command Line (CLI)

Quick deployment guide using Cloudflare Wrangler CLI.

## Prerequisites

1. **Node.js 18+** installed
2. **Cloudflare account** (free tier works)
3. **npm** or **pnpm** installed

---

## Step 1: Install Cloudflare Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Or use npx (no global install needed)
npx wrangler --version
```

**Verify installation:**
```bash
wrangler --version
```

---

## Step 2: Login to Cloudflare

```bash
# Login to Cloudflare
wrangler login

# This will:
# 1. Open your browser
# 2. Ask you to authorize Wrangler
# 3. Save credentials locally
```

**Alternative (non-interactive):**
```bash
# Set API token (if you have one)
export CLOUDFLARE_API_TOKEN="your-api-token"
```

---

## Step 3: Build Your Project

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Verify dist folder exists
ls -la dist
```

---

## Step 4: Deploy to Cloudflare Pages

### Option A: Direct Deployment (Quick)

```bash
# Deploy from dist folder
wrangler pages deploy dist --project-name=devtools-site

# With custom domain
wrangler pages deploy dist --project-name=devtools-site --branch=main
```

### Option B: Create Project First, Then Deploy

```bash
# Create a new Pages project
wrangler pages project create devtools-site

# Deploy to the project
wrangler pages deploy dist --project-name=devtools-site
```

### Option C: Full Command with All Options

```bash
wrangler pages deploy dist \
  --project-name=devtools-site \
  --branch=main \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="$(git log -1 --pretty=%B)"
```

---

## Step 5: Set Up Custom Domain (Optional)

```bash
# Add custom domain to your project
wrangler pages domain add devtools.site --project-name=devtools-site

# List domains
wrangler pages domain list --project-name=devtools-site

# Remove domain (if needed)
wrangler pages domain remove devtools.site --project-name=devtools-site
```

---

## Step 6: Environment Variables (If Needed)

```bash
# Set environment variable for production
wrangler pages secret put GA_MEASUREMENT_ID --project-name=devtools-site

# List secrets
wrangler pages secret list --project-name=devtools-site

# Delete secret
wrangler pages secret delete GA_MEASUREMENT_ID --project-name=devtools-site
```

---

## Complete Deployment Script

Create a file `deploy.sh` (or `deploy.bat` for Windows):

### For Linux/Mac (deploy.sh):

```bash
#!/bin/bash

echo "🚀 Deploying DevTools.site to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

# Deploy to Cloudflare
echo "☁️  Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=devtools-site --branch=main

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://devtools-site.pages.dev"
```

### For Windows (deploy.bat):

```batch
@echo off
echo 🚀 Deploying DevTools.site to Cloudflare Pages...

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Wrangler not found. Installing...
    npm install -g wrangler
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build project
echo 🔨 Building project...
call npm run build

REM Deploy to Cloudflare
echo ☁️  Deploying to Cloudflare Pages...
call wrangler pages deploy dist --project-name=devtools-site --branch=main

echo ✅ Deployment complete!
echo 🌐 Your site should be live at: https://devtools-site.pages.dev
pause
```

**Make executable (Linux/Mac):**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Run on Windows:**
```cmd
deploy.bat
```

---

## Quick Deploy Commands

### One-Line Deploy

```bash
npm run build && wrangler pages deploy dist --project-name=devtools-site
```

### With Git Info

```bash
npm run build && wrangler pages deploy dist \
  --project-name=devtools-site \
  --branch=$(git branch --show-current) \
  --commit-hash=$(git rev-parse HEAD)
```

---

## Useful Wrangler Commands

### List Projects
```bash
wrangler pages project list
```

### View Deployment History
```bash
wrangler pages deployment list --project-name=devtools-site
```

### View Deployment Details
```bash
wrangler pages deployment tail --project-name=devtools-site
```

### Delete Deployment
```bash
wrangler pages deployment delete <deployment-id> --project-name=devtools-site
```

### Create Preview Deployment
```bash
wrangler pages deploy dist \
  --project-name=devtools-site \
  --branch=preview \
  --env=preview
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: devtools-site
          directory: dist
```

**Set secrets in GitHub:**
- `CLOUDFLARE_API_TOKEN` - Get from Cloudflare dashboard
- `CLOUDFLARE_ACCOUNT_ID` - Get from Cloudflare dashboard

---

## Troubleshooting

### Error: "Not authenticated"

```bash
# Re-login
wrangler login
```

### Error: "Project not found"

```bash
# Create project first
wrangler pages project create devtools-site
```

### Error: "Build failed"

```bash
# Test build locally first
npm run build

# Check dist folder
ls -la dist
```

### Error: "Permission denied"

```bash
# Check you're logged in
wrangler whoami

# Re-authenticate if needed
wrangler logout
wrangler login
```

---

## Quick Reference

### Essential Commands

```bash
# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name=devtools-site

# Check status
wrangler pages project list
```

### Get API Token (for CI/CD)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Add permissions:
   - Account: Cloudflare Pages: Edit
   - Zone: (your domain)
5. Copy token and save securely

---

## Deployment Checklist

- [ ] Wrangler CLI installed
- [ ] Logged in to Cloudflare
- [ ] Dependencies installed (`npm install`)
- [ ] Project builds successfully (`npm run build`)
- [ ] `dist` folder exists
- [ ] Deployed via CLI
- [ ] Site accessible at `*.pages.dev` URL
- [ ] Custom domain configured (optional)

---

## Success! 🎉

After deployment, your site will be live at:
- **Cloudflare Pages URL**: `https://devtools-site.pages.dev`
- **Custom Domain**: `https://devtools.site` (if configured)

**Next Steps:**
1. Test all features
2. Set up custom domain
3. Configure analytics
4. Set up CI/CD for auto-deployment

---

## Need Help?

```bash
# Get help
wrangler pages --help

# Get help for specific command
wrangler pages deploy --help
wrangler pages project --help
```

Happy deploying! 🚀

