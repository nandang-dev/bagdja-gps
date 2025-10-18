#!/bin/bash

SUPABASE_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co"
AVL="3ZQONE9QTBKZ00UK"
API_KEY="HNBZM1ETEK"

echo "🚗 SIMULASI PERJALANAN REAL-TIME"
echo "================================="
echo "📍 Dari: Pasar Modern Limbangan, Garut"
echo "📍 Ke  : Jatinangor Town Square, Sumedang"
echo "📏 Jarak: ~20 km"
echo "⏱️  Durasi: ~30 menit (simulasi 30 detik)"
echo ""
echo "🔴 LIVE TRACKING - Watch your browser!"
echo "================================="
echo ""

# Waypoints perjalanan (interpolasi antara 2 titik)
# Start: Pasar Modern Limbangan (-7.039333, 107.975278)
# End: Jatinangor Town Square (-6.9338, 107.7745)

waypoints=(
  "1:📍 Berangkat dari Parkiran Pasar Modern Limbangan:-7.039333:107.975278"
  "2:🚦 Keluar Pasar, menuju Jl. Raya Limbangan:-7.038500:107.974800"
  "3:🛣️  Jl. Raya Limbangan Tasik:-7.035000:107.970000"
  "4:🌳 Melewati area persawahan:-7.030000:107.960000"
  "5:🏘️  Masuk area Garut Kota:-7.020000:107.945000"
  "6:🚗 Perjalanan menuju Bandung:-7.005000:107.925000"
  "7:🌄 Melewati perbukitan:-6.990000:107.900000"
  "8:🏙️  Masuk wilayah Sumedang:-6.975000:107.875000"
  "9:🛣️  Jl. Raya Jatinangor:-6.960000:107.850000"
  "10:🏪 Mendekati Jatinangor Town Square:-6.945000:107.825000"
  "11:🅿️  Area parkir Jatinangor Town Square:-6.935000:107.780000"
  "12:🎯 SAMPAI: Jatinangor Town Square:-6.9338:107.7745"
)

for waypoint in "${waypoints[@]}"; do
  IFS=':' read -r num desc lat lng <<< "$waypoint"
  
  echo "$num $desc"
  echo "   → ($lat, $lng)"
  
  response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/gps-receiver" \
    -H "avl: $AVL" \
    -H "api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"lat\":$lat,\"lng\":$lng,\"date_time\":$(date +%s)000}")
  
  if echo "$response" | grep -q "success"; then
    echo "   ✅ GPS data sent"
  else
    echo "   ❌ Error: $response"
  fi
  
  echo ""
  
  # Delay antar waypoint (2.5 detik per titik = ~30 detik total)
  if [ "$num" != "12" ]; then
    sleep 2.5
  fi
done

echo "================================="
echo "✅ PERJALANAN SELESAI!"
echo "🎯 Total: 12 waypoints"
echo "📍 Posisi akhir: Jatinangor Town Square"
echo ""
echo "Check browser untuk melihat:"
echo "  - Marker bergerak smooth dari Garut ke Sumedang"
echo "  - Map auto-pan mengikuti perjalanan"
echo "  - [●LIVE] badge aktif"
echo "  - Timestamp update setiap 2.5 detik"
echo "================================="
