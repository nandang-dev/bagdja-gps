# Quick Start Guide - Bagdja GPS Tracker

Panduan cepat untuk mulai menggunakan Bagdja GPS Tracker dalam 10 menit!

## Prerequisites

- Node.js 18+ (download di https://nodejs.org)
- Akun Supabase (gratis di https://supabase.com)
- Text editor (VS Code recommended)

## 🚀 Setup dalam 5 Langkah

### 1️⃣ Setup Supabase (3 menit)

1. Login ke https://app.supabase.com
2. Klik **"New Project"**
   - Nama: `bagdja-gps`
   - Password: (buat password database)
   - Region: pilih yang terdekat
3. Tunggu ~2 menit hingga selesai
4. Buka **SQL Editor** → **New Query**
5. Copy-paste isi file `supabase/migrations/20251018000001_initial_schema.sql`
6. Klik **Run** (atau Ctrl+Enter)
7. Done! ✅

### 2️⃣ Deploy Edge Function (2 menit)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project (ganti YOUR_PROJECT_REF)
cd bagdja-gps
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy gps-receiver
```

**Note**: Project REF bisa dilihat di **Settings → General → Reference ID**

### 3️⃣ Setup Frontend (2 menit)

```bash
# Install dependencies
cd frontend
npm install

# Buat file .env.local
cp env-example.txt .env.local

# Edit .env.local (gunakan text editor)
# Isi dengan:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Start dev server
npm run dev
```

**Get Credentials**: Buka Supabase Dashboard → **Settings → API**
- Copy **Project URL** dan **anon public** key

### 4️⃣ Buat Akun & Device (1 menit)

1. Buka http://localhost:5173
2. Klik **"Daftar"**
3. Isi email, password, nama
4. Login
5. Klik **"+ Tambah Device"**
6. Isi:
   - Nama: `Test Device`
   - AVL: `TEST001`
   - Deskripsi: (optional)
7. Klik **"Simpan"**
8. Copy **API Key** yang tergenerate

### 5️⃣ Test API (2 menit)

```bash
# Edit test-gps-api.sh (ganti dengan data Anda)
SUPABASE_URL="https://your-project.supabase.co"
AVL="TEST001"
API_KEY="gps_xxxxx..."

# Run test
chmod +x test-gps-api.sh
./test-gps-api.sh
```

**Atau gunakan curl langsung:**
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/gps-receiver \
  -H "avl: TEST001" \
  -H "api-key: gps_xxxxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": { ... }
}
```

## ✅ Verification

1. **Check Database**: 
   - Supabase Dashboard → **Table Editor** → `gps_data`
   - Should see new row with your test data

2. **Check Logs**:
   - Supabase Dashboard → **Edge Functions** → `gps-receiver` → **Logs**

## 🎯 Next Steps

### Integrate dengan Device Hardware

#### Arduino/ESP32
```cpp
// Install libraries:
// - WiFi
// - HTTPClient
// - ArduinoJson

#include <WiFi.h>
#include <HTTPClient.h>

const char* serverUrl = "https://your-project.supabase.co/functions/v1/gps-receiver";
const char* avl = "TEST001";
const char* apiKey = "gps_xxxxx...";

void sendGPS(float lat, float lng) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("avl", avl);
  http.addHeader("api-key", apiKey);
  
  String payload = "{\"lat\":" + String(lat, 8) + 
                   ",\"lng\":" + String(lng, 8) + 
                   ",\"date_time\":" + String(millis()) + "}";
  
  int code = http.POST(payload);
  Serial.println("Response: " + String(code));
  http.end();
}
```

#### Python
```python
import requests
import time

def send_gps(lat, lng):
    requests.post(
        'https://your-project.supabase.co/functions/v1/gps-receiver',
        headers={
            'avl': 'TEST001',
            'api-key': 'gps_xxxxx...',
            'Content-Type': 'application/json'
        },
        json={
            'lat': lat,
            'lng': lng,
            'date_time': int(time.time() * 1000)
        }
    )

# Send GPS every 60 seconds
while True:
    send_gps(-6.200000, 106.816666)
    time.sleep(60)
```

### Production Deployment

#### Frontend (Vercel)
```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables di Vercel dashboard
```

#### Backend
Already deployed! ✅ Edge function otomatis production-ready.

## 📚 Documentation

- **Full Setup**: `SETUP_GUIDE.md`
- **API Docs**: `API_DOCUMENTATION.md`
- **README**: `README.md`

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Frontend tidak connect | Check `.env.local` sudah benar, restart dev server |
| Edge function error | Run `supabase functions logs gps-receiver` |
| API 401 error | Check AVL dan API key benar (case-sensitive) |
| Device inactive | Toggle status di dashboard |
| Migration error | Drop tables dan run migration lagi |

## 🎉 Done!

Sekarang Anda punya GPS tracker system yang:
- ✅ Secure authentication
- ✅ Device management
- ✅ Real-time GPS data collection
- ✅ Production-ready API

**Happy tracking! 🚗📍**

