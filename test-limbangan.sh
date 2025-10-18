#!/bin/bash

# Configuration - UPDATED CREDENTIALS
SUPABASE_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co"
AVL="3ZQONE9QTBKZ00UK"
API_KEY="HNBZM1ETEK"

echo "🚗 Simulasi GPS Tracking di Pasar Modern Limbangan"
echo "=================================================="

# Posisi 1: Parkiran
echo ""
echo "📍 Posisi 1: Parkiran (-7.039333, 107.975278)"
curl -v -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039333,\"lng\":107.975278,\"date_time\":$(date +%s)000}"
echo ""
echo "⏳ Tunggu 3 detik..."
sleep 3

# Posisi 2: Bergerak ke Timur
echo ""
echo "📍 Posisi 2: Bergerak ke Timur (-7.039400, 107.975350)"
curl -s -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039400,\"lng\":107.975350,\"date_time\":$(date +%s)000}"
echo ""
echo "⏳ Tunggu 3 detik..."
sleep 3

# Posisi 3: Bergerak ke Selatan
echo ""
echo "📍 Posisi 3: Bergerak ke Selatan (-7.039500, 107.975400)"
curl -s -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039500,\"lng\":107.975400,\"date_time\":$(date +%s)000}"
echo ""
echo "⏳ Tunggu 3 detik..."
sleep 3

# Posisi 4: Kembali ke Parkiran
echo ""
echo "📍 Posisi 4: Kembali ke Parkiran (-7.039333, 107.975278)"
curl -s -X POST \
  "$SUPABASE_URL/functions/v1/gps-receiver" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"lat\":-7.039333,\"lng\":107.975278,\"date_time\":$(date +%s)000}"
echo ""

echo ""
echo "✅ Selesai! Check browser - marker harus sudah bergerak!"
