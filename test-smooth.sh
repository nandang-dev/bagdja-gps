#!/bin/bash

SUPABASE_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co"
AVL="3ZQONE9QTBKZ00UK"
API_KEY="HNBZM1ETEK"

echo "🎯 Test Smooth Marker Movement - Pasar Modern Limbangan"
echo "======================================================="
echo ""
echo "Watch browser - marker harus bergerak SMOOTH tanpa flickering!"
echo ""

# Posisi 1: Start point
echo "1️⃣  Posisi Awal (-7.039333, 107.975278)"
curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" -H "api-key: $API_KEY" -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039333,\"lng\":107.975278,\"date_time\":$(date +%s)000}" | jq -r '.message'
sleep 2

# Posisi 2
echo "2️⃣  Gerak ke Utara (-7.039250, 107.975278)"
curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" -H "api-key: $API_KEY" -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039250,\"lng\":107.975278,\"date_time\":$(date +%s)000}" | jq -r '.message'
sleep 2

# Posisi 3
echo "3️⃣  Gerak ke Timur (-7.039250, 107.975350)"
curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" -H "api-key: $API_KEY" -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039250,\"lng\":107.975350,\"date_time\":$(date +%s)000}" | jq -r '.message'
sleep 2

# Posisi 4
echo "4️⃣  Gerak ke Selatan (-7.039400, 107.975350)"
curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" -H "api-key: $API_KEY" -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039400,\"lng\":107.975350,\"date_time\":$(date +%s)000}" | jq -r '.message'
sleep 2

# Posisi 5
echo "5️⃣  Kembali ke Awal (-7.039333, 107.975278)"
curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" -H "api-key: $API_KEY" -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039333,\"lng\":107.975278,\"date_time\":$(date +%s)000}" | jq -r '.message'

echo ""
echo "✅ Done! Map seharusnya SMOOTH tanpa flickering!"
echo ""
echo "Check browser console untuk log:"
echo "  🗺️ Initializing map...        (1x saja di awal)"
echo "  📍 Updating marker position... (5x untuk setiap update)"
