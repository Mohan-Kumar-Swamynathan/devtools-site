#!/bin/bash

# DevTools.site Setup Script
# This script sets up the project for development

echo "🚀 Setting up DevTools.site..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create placeholder icon files if they don't exist
echo "📁 Creating placeholder assets..."
mkdir -p public/icons public/images

# Generate tool pages if script exists
if [ -f "scripts/generate-tool-pages.js" ]; then
  echo "📄 Generating tool pages..."
  node scripts/generate-tool-pages.js || echo "⚠️  Tool page generation skipped (some pages may already exist)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development server"
echo "  2. Run 'npm run build' to build for production"
echo "  3. See DEPLOYMENT.md for deployment instructions"
echo ""


