#!/bin/bash

# Routiq Frontend SaaS - Deployment Script
# This script prepares and deploys the app to Vercel

echo "🚀 Routiq Frontend SaaS - Deployment Script"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔍 Pre-deployment checks..."

# Check for required files
echo "✅ Checking required files..."
required_files=("package.json" "next.config.js" "vercel.json" ".gitignore")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "   ✓ $file"
done

# Run tests and build
echo "🧪 Running tests and build..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix errors before deploying."
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ All checks passed!"

# Git status check
echo "📝 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Commit them first:"
    git status --short
    echo ""
    read -p "Do you want to commit and push changes now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_message
        git commit -m "$commit_message"
        git push
    else
        echo "❌ Please commit your changes before deploying."
        exit 1
    fi
fi

echo "🌐 Deploying to Vercel..."

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check your Vercel dashboard for the deployment URL"
    echo "2. Test the deployed application"
    echo "3. Configure custom domain (optional)"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo "🔗 Important URLs to test:"
    echo "   - Homepage: https://your-app.vercel.app"
    echo "   - API Health: https://your-app.vercel.app/api/health"
    echo "   - Active Patients: https://your-app.vercel.app/api/active-patients"
    echo ""
    echo "✅ Your Routiq Frontend SaaS is now live!"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi 