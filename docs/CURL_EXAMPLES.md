# 📡 Contoh cURL untuk Test API GPS Tracker

## 🚀 Quick Test

### 1. Basic cURL Command

**Simple & Easy!** Hanya butuh AVL dan API Key dari device Anda.

```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": {
    "id": "...",
    "device_id": "...",
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000,
    "created_at": "2025-10-18T..."
  }
}
```

---

## 🎯 Test dengan Koordinat Berbeda

### Jakarta (Monas)
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.1751,
    "lng": 106.8270,
    "date_time": '$(date +%s)000'
  }'
```

### Bandung
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.9175,
    "lng": 107.6191,
    "date_time": '$(date +%s)000'
  }'
```

### Surabaya
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -7.2575,
    "lng": 112.7521,
    "date_time": '$(date +%s)000'
  }'
```

---

## 🔄 Test dengan Auto Timestamp

Gunakan timestamp saat ini:
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }'
```

---

## 🎨 cURL dengan Pretty Print

### Dengan jq (JSON formatter)
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }' | jq
```

### Dengan python3
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }' | python3 -m json.tool
```

---

## 📊 Test dengan Verbose Output

Lihat detail request/response:
```bash
curl -v -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }'
```

---

## ❌ Test Error Scenarios

### 1. Missing AVL Header
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }'
```
**Response:** `{"error":"Missing authentication headers (avl or api-key)"}`

### 2. Invalid Credentials
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: INVALID_AVL" \
  -H "api-key: INVALID_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }'
```
**Response:** `{"error":"Invalid authentication credentials"}`

### 3. Invalid Latitude (> 90)
```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 200.0,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }'
```
**Response:** `{"error":"Latitude must be between -90 and 90"}`

---

## 🔁 Loop Test (Kirim Data Berulang)

Kirim data setiap 10 detik:
```bash
while true; do
  echo "Sending GPS data at $(date)"
  curl -X POST \
    https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
    -H "avl: 3ZQ0NE90TBKZ00UK" \
    -H "api-key: HNBZM1ETEK" \
    -H "Content-Type: application/json" \
    -d '{
      "lat": -6.200000,
      "lng": 106.816666,
      "date_time": '$(date +%s)000'
    }' | python3 -m json.tool
  echo "---"
  sleep 10
done
```

---

## 🛠️ Variables untuk Mudah Edit

```bash
# Set variables
AVL="3ZQ0NE90TBKZ00UK"
API_KEY="HNBZM1ETEK"
LAT="-6.200000"
LNG="106.816666"
ENDPOINT="https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver"

# Send request
curl -X POST "$ENDPOINT" \
  -H "avl: $AVL" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": '"$LAT"',
    "lng": '"$LNG"',
    "date_time": '$(date +%s)000'
  }'
```

---

## 📝 Save Response to File

```bash
curl -X POST \
  https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": '$(date +%s)000'
  }' > response.json

cat response.json | python3 -m json.tool
```

---

## 🚀 Quick Start Script

Gunakan script yang sudah disediakan:
```bash
chmod +x test-api-curl.sh
./test-api-curl.sh
```

**Note:** Jangan lupa edit variabel AVL dan API_KEY di dalam script!

---

## 📌 Tips

1. **Ganti AVL dan API_KEY** dengan credentials device Anda dari dashboard
2. **Gunakan timestamp real-time**: `$(date +%s)000`
3. **Check device status** harus AKTIF di dashboard
4. **Test dengan verbose** (`-v`) untuk debug
5. **Simpan response** untuk analisis

## ⚠️ Troubleshooting

| Error | Solusi |
|-------|--------|
| `Missing authentication headers` | Pastikan header `avl` dan `api-key` ada |
| `Invalid authentication credentials` | Check AVL dan API Key di dashboard |
| `Device is inactive` | Aktifkan device di dashboard |
| `Latitude must be between -90 and 90` | Check nilai latitude |
| `Longitude must be between -180 and 180` | Check nilai longitude |

---

**Happy Testing! 🎉**

