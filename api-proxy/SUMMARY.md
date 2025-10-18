# 📋 Bagdja GPS API Proxy - Summary

## 🎯 What is This?

HTTP Proxy server yang berfungsi sebagai **jembatan** antara **GPS tracking devices** dengan **Supabase Edge Functions**. 

**Kenapa perlu proxy?**
- Device GPS sering **tidak support HTTPS**
- Device butuh **HTTP plain** connection
- Proxy menangani authentication dan forwarding ke Supabase

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **HTTP Proxy** | Bridge HTTP requests to HTTPS Supabase |
| **Swagger Docs** | Interactive API documentation (protected) |
| **Validation** | GPS coordinates & data validation |
| **Auth** | AVL + API Key authentication |
| **Logging** | Full request/response logging |
| **CORS** | Cross-origin support enabled |
| **Health Check** | Service monitoring endpoint |

---

## 📁 Project Structure

```
api-proxy/
├── server.js           # Main Express server
├── swagger.js          # Swagger/OpenAPI configuration
├── package.json        # Dependencies & scripts
├── .env               # Environment variables
├── .env.example       # Environment template
├── README.md          # Full documentation
├── QUICK_START.md     # Quick setup guide
├── test-device.sh     # Device simulation script
└── .gitignore         # Git ignore rules
```

---

## 🔌 API Endpoints

### 1. **Root** - `GET /`
Get API information

### 2. **Health Check** - `GET /health`
Check service status

### 3. **GPS Data** - `POST /api/gps`
Main endpoint for GPS devices
- **Headers:** `avl`, `api-key`
- **Body:** `{ lat, lng, date_time }`

### 4. **Documentation** - `GET /api-docs`
Swagger UI (protected with username/password)

---

## 🚀 Quick Commands

```bash
# Start server
npm start

# Test with cURL
curl -X POST http://localhost:3000/api/gps \
  -H "avl: 3ZQONE9QTBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.039333,"lng":107.975278,"date_time":1697644800000}'

# Run test script
./test-device.sh

# Check health
curl http://localhost:3000/health
```

---

## 🔐 Swagger Access

**URL:** `http://localhost:3000/api-docs`

**Credentials:**
- Username: `admin`
- Password: `bagdja2025`

---

## 🌐 How It Works

```
GPS Device → HTTP → API Proxy → HTTPS → Supabase Edge Function → PostgreSQL
  (Plain)            :3000                (Secure)               (Database)
```

### Flow:
1. **Device sends HTTP POST** to proxy (`/api/gps`)
2. **Proxy validates** data & credentials
3. **Proxy forwards** to Supabase Edge Function (HTTPS)
4. **Edge Function** stores data in PostgreSQL
5. **Response** back through proxy to device

---

## 🛠️ Configuration (.env)

```env
PORT=3000                                          # API server port
GPS_RECEIVER_URL=https://xxx.../gps-receiver      # GPS Receiver Edge Function URL
SWAGGER_USERNAME=admin                             # Swagger username
SWAGGER_PASSWORD=bagdja2025                        # Swagger password
API_TIMEOUT=30000                                  # Request timeout (ms)
```

---

## 📱 Device Integration Example

### Arduino/ESP32

```cpp
#include <HTTPClient.h>

void sendGPS(float lat, float lng) {
  HTTPClient http;
  http.begin("http://YOUR_SERVER:3000/api/gps");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("avl", "3ZQONE9QTBKZ00UK");
  http.addHeader("api-key", "HNBZM1ETEK");
  
  String json = "{\"lat\":" + String(lat) + 
                ",\"lng\":" + String(lng) + 
                ",\"date_time\":" + String(millis()) + "}";
  
  http.POST(json);
  http.end();
}
```

---

## 🧪 Testing

### Automated Test
```bash
./test-device.sh
```

### Manual Test
```bash
curl -X POST http://localhost:3000/api/gps \
  -H "avl: YOUR_AVL" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.0,"lng":107.9,"date_time":'$(date +%s)000'}'
```

---

## 🚀 Deployment Options

### Option 1: Fly.io (Recommended)

```bash
# Install CLI
curl -L https://fly.io/install.sh | sh

# Deploy
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
./deploy-fly.sh
```

**Benefits:**
- ✅ FREE (no credit card!)
- ✅ Auto-scaling
- ✅ Global CDN
- ✅ 5-minute setup

---

### Option 2: PM2 (Self-hosted)
```bash
npm install -g pm2
pm2 start server.js --name gps-proxy
pm2 save
pm2 startup
```

### Option 2: Docker
```bash
docker build -t gps-proxy .
docker run -p 3000:3000 --env-file .env gps-proxy
```

### Option 3: Systemd Service
Create `/etc/systemd/system/gps-proxy.service`

---

## 📊 Monitoring

### View Logs
```bash
# PM2
pm2 logs gps-proxy

# Direct
npm start  # See console output
```

### Check Status
```bash
curl http://localhost:3000/health
```

---

## 🔒 Security

### Production Checklist:
- [ ] Change Swagger username/password
- [ ] Use HTTPS (Nginx reverse proxy)
- [ ] Implement rate limiting
- [ ] Set up firewall rules
- [ ] Enable request logging
- [ ] Monitor for anomalies

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICK_START.md** - 5-minute setup guide
- **SUMMARY.md** - This file
- **Swagger UI** - Interactive API docs

---

## 🤝 Support

**Documentation:** http://localhost:3000/api-docs  
**Health Check:** http://localhost:3000/health  
**Repository:** `/Users/nandanghermawan/Project/bagdja-gps/api-proxy`

---

## 📈 Next Steps

1. ✅ **Tested locally** - API working
2. 🔄 **Deploy to server** - Make it accessible
3. 🔐 **Configure SSL** - Add HTTPS with Nginx
4. 📱 **Connect devices** - Program GPS trackers
5. 📊 **Monitor** - Set up logging & alerts

---

**Status:** ✅ **READY TO USE**  
**Version:** 1.0.0  
**Created:** 18 Oktober 2025

