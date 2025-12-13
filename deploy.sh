#!/bin/bash

# DevTools.site - Cloudflare Pages Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Deploying DevTools.site to Cloudflare Pages..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found."
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
    echo "✅ Wrangler installed!"
    echo ""
fi

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare"
    echo "🔑 Please login:"
    wrangler login
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build project
echo "🔨 Building project..."
npm run build

# Verify dist folder
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found!"
    echo "Build may have failed. Check the output above."
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""

# Deploy to Cloudflare
echo "☁️  Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=devtools-site --branch=main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://devtools-site.pages.dev"
echo ""
echo "💡 To add a custom domain:"
echo "   wrangler pages domain add devtools.site --project-name=devtools-site"

