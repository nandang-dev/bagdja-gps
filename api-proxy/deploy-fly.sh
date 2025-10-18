#!/bin/bash

# Bagdja GPS API Proxy - Fly.io Deployment Script

echo "🚀 Fly.io Deployment Helper"
echo "============================"
echo ""

# Check if Fly CLI is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not installed"
    echo ""
    echo "Install with:"
    echo "  curl -L https://fly.io/install.sh | sh"
    echo ""
    read -p "Install now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        curl -L https://fly.io/install.sh | sh
        echo ""
        echo "✅ Fly CLI installed!"
        echo "Please restart terminal or run: source ~/.bashrc"
        echo "Then run this script again."
        exit 0
    else
        exit 1
    fi
fi

echo "✅ Fly CLI found"
echo ""

# Login check
echo "Checking Fly.io login..."
if flyctl auth whoami &> /dev/null; then
    echo "✅ Already logged in"
else
    echo "⚠️  Not logged in to Fly.io"
    echo "Opening browser for authentication..."
    flyctl auth login
fi

echo ""
echo "📋 Ready to deploy!"
echo "==================="
echo ""

# Check if app exists
if flyctl status &> /dev/null 2>&1; then
    echo "App already exists. Deploying update..."
    flyctl deploy
else
    echo "First time deployment!"
    echo ""
    read -p "Launch app now? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🚀 Launching app..."
        flyctl launch --no-deploy
        
        echo ""
        echo "⚙️  Setting secrets..."
        flyctl secrets set \
          GPS_RECEIVER_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver" \
          SWAGGER_USERNAME="admin" \
          API_TIMEOUT="30000"
        
        echo ""
        read -p "Enter SWAGGER_PASSWORD (secure!): " swagger_pass
        flyctl secrets set SWAGGER_PASSWORD="$swagger_pass"
        
        echo ""
        echo "🚀 Deploying..."
        flyctl deploy
        
        echo ""
        echo "✅ Deployment complete!"
        echo ""
        flyctl info
    else
        echo "Cancelled. Run 'flyctl launch' when ready."
    fi
fi

echo ""
echo "============================"
echo "✨ Deployment helper complete!"
echo ""
echo "Useful commands:"
echo "  flyctl logs        # View logs"
echo "  flyctl dashboard   # Open dashboard"
echo "  flyctl status      # Check status"
echo "  flyctl info        # Show app info"
echo ""

