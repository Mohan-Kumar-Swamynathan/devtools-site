@echo off
REM DevTools.site - Cloudflare Pages Deployment Script (Windows)
REM Usage: deploy.bat

echo 🚀 Deploying DevTools.site to Cloudflare Pages...
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Wrangler CLI not found.
    echo 📦 Installing Wrangler...
    call npm install -g wrangler
    echo ✅ Wrangler installed!
    echo.
)

REM Check if logged in
echo 🔐 Checking Cloudflare authentication...
wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Not logged in to Cloudflare
    echo 🔑 Please login:
    call wrangler login
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo.

REM Build project
echo 🔨 Building project...
call npm run build

REM Verify dist folder
if not exist "dist" (
    echo ❌ Error: dist folder not found!
    echo Build may have failed. Check the output above.
    pause
    exit /b 1
)

echo.
echo ✅ Build complete!
echo.

REM Deploy to Cloudflare
echo ☁️  Deploying to Cloudflare Pages...
call wrangler pages deploy dist --project-name=devtools-site --branch=main

echo.
echo ✅ Deployment complete!
echo 🌐 Your site should be live at: https://devtools-site.pages.dev
echo.
echo 💡 To add a custom domain:
echo    wrangler pages domain add devtool.site --project-name=devtools-site
echo.
pause

