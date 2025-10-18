#!/bin/bash

# Test GPS Receiver API
# Usage: ./test-gps-api.sh

# Configuration
SUPABASE_URL="https://your-project.supabase.co"
AVL="your-device-avl"
API_KEY="your-device-api-key"

# Test data
LAT=-6.200000
LNG=106.816666
DATE_TIME=$(date +%s)000  # Current timestamp in milliseconds

echo "Testing GPS Receiver API..."
echo "URL: $SUPABASE_URL/functions/v1/gps-receiver"
echo "AVL: $AVL"
echo "API Key: ${API_KEY:0:20}..."
echo "---"

curl -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"lat\": $LAT,
    \"lng\": $LNG,
    \"date_time\": $DATE_TIME
  }" \
  | python3 -m json.tool

echo ""
echo "---"
echo "Test completed!"

