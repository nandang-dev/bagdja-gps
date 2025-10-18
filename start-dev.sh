#!/bin/bash

# Bagdja GPS Tracker - Development Starter Script

echo "🚀 Starting Bagdja GPS Tracker Development Environment"
echo "=================================================="
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Warning: frontend/.env.local not found!"
    echo "Please create it from env-example.txt and add your Supabase credentials."
    echo ""
    read -p "Do you want to create it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp frontend/env-example.txt frontend/.env.local
        echo "✅ Created frontend/.env.local"
        echo "Please edit this file and add your Supabase URL and API key."
        echo ""
        read -p "Press enter after you've edited the file..."
    else
        echo "❌ Cannot start without .env.local file"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo "✅ Dependencies installed"
    echo ""
fi

# Start frontend
echo "🌐 Starting frontend development server..."
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd frontend && npm run dev

