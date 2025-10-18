#!/bin/bash

# Bagdja GPS API Proxy - Device Test Script
# Simulates GPS device sending data to proxy

echo "🧪 Testing Bagdja GPS API Proxy"
echo "================================="
echo ""

# Configuration
API_URL="http://localhost:3000/api/gps"
AVL="3ZQONE9QTBKZ00UK"
API_KEY="HNBZM1ETEK"

# Test 1: Valid GPS data
echo "📍 Test 1: Sending valid GPS data"
echo "   Location: Pasar Modern Limbangan, Garut"
curl -s -X POST "$API_URL" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.039333,"lng":107.975278,"date_time":'$(date +%s)000'}' | jq '.'

echo ""
echo "⏱️  Waiting 2 seconds..."
sleep 2

# Test 2: Another location
echo ""
echo "📍 Test 2: Sending data from different location"
echo "   Location: Moving north"
curl -s -X POST "$API_URL" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.038500,"lng":107.974800,"date_time":'$(date +%s)000'}' | jq '.'

echo ""
echo "⏱️  Waiting 2 seconds..."
sleep 2

# Test 3: Invalid credentials
echo ""
echo "❌ Test 3: Invalid AVL (should fail)"
curl -s -X POST "$API_URL" \
  -H "avl: INVALID123456789" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.039333,"lng":107.975278,"date_time":'$(date +%s)000'}' | jq '.'

echo ""
echo "⏱️  Waiting 2 seconds..."
sleep 2

# Test 4: Missing header
echo ""
echo "❌ Test 4: Missing API key header (should fail)"
curl -s -X POST "$API_URL" \
  -H "avl: $AVL" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.039333,"lng":107.975278,"date_time":'$(date +%s)000'}' | jq '.'

echo ""
echo "⏱️  Waiting 2 seconds..."
sleep 2

# Test 5: Invalid GPS data
echo ""
echo "❌ Test 5: Invalid latitude (should fail)"
curl -s -X POST "$API_URL" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat":999,"lng":107.975278,"date_time":'$(date +%s)000'}' | jq '.'

echo ""
echo ""
echo "✅ Testing complete!"
echo "================================="
echo ""
echo "Check http://localhost:3000/api-docs for full API documentation"
echo "Username: admin"
echo "Password: bagdja2025"

