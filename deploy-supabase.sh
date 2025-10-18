#!/bin/bash

# Bagdja GPS Tracker - Supabase Deployment Script

echo "🚀 Deploying Bagdja GPS Tracker to Supabase"
echo "=========================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Installing Supabase CLI..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
    echo ""
fi

# Check if already linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 Linking to Supabase project..."
    echo "Please enter your Project Reference ID (from Supabase Dashboard > Settings > General):"
    read -p "Project Ref: " PROJECT_REF
    
    if [ -z "$PROJECT_REF" ]; then
        echo "❌ Project reference is required!"
        exit 1
    fi
    
    supabase link --project-ref "$PROJECT_REF"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to link project. Please check your project reference and try again."
        exit 1
    fi
    
    echo "✅ Project linked successfully"
    echo ""
fi

# Deploy Edge Function
echo "📡 Deploying GPS Receiver Edge Function..."
supabase functions deploy gps-receiver

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy edge function"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run migrations in Supabase Dashboard > SQL Editor"
echo "   Copy content from: supabase/migrations/20251018000001_initial_schema.sql"
echo "2. Get your credentials from Supabase Dashboard > Settings > API"
echo "3. Update frontend/.env.local with your credentials"
echo "4. Run './start-dev.sh' to start the development server"
echo ""
echo "🎉 Your GPS Tracker is ready to use!"

