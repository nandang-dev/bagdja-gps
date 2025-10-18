#!/bin/bash

# ============================================
# Bagdja GPS Tracker - API Test Script
# ============================================

# Configuration - GANTI dengan credentials Anda!
SUPABASE_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co"
AVL="3ZQ0NE90TBKZ00UK"          # Ganti dengan AVL dari device Anda
API_KEY="HNBZM1ETEK"            # Ganti dengan API Key dari device Anda

# GPS Coordinates - GANTI dengan koordinat Anda!
LAT="-6.200000"                 # Latitude (Jakarta)
LNG="106.816666"                # Longitude (Jakarta)
DATE_TIME=$(date +%s)000        # Current timestamp in milliseconds

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Testing GPS Receiver API${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Endpoint: $SUPABASE_URL/functions/v1/gps-receiver"
echo "AVL: $AVL"
echo "API Key: ${API_KEY:0:8}..."
echo "Coordinates: $LAT, $LNG"
echo "Timestamp: $DATE_TIME"
echo ""
echo -e "${BLUE}Sending request...${NC}"
echo ""

# Send POST request
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"lat\": $LAT,
    \"lng\": $LNG,
    \"date_time\": $DATE_TIME
  }")

# Extract body and status
HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

# Pretty print JSON response
echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"

echo ""
echo "---"

# Check status and show result
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ Success! (HTTP $HTTP_STATUS)${NC}"
  echo -e "${GREEN}GPS data berhasil dikirim ke server!${NC}"
else
  echo -e "${RED}❌ Error! (HTTP $HTTP_STATUS)${NC}"
  echo -e "${RED}Pastikan AVL dan API Key benar, dan device dalam status aktif.${NC}"
fi

echo ""
echo -e "${BLUE}================================${NC}"

