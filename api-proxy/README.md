# 📡 Bagdja GPS Tracker API Proxy

HTTP Proxy API for GPS tracking devices to communicate with Supabase Edge Functions. This proxy is designed for devices that require HTTP-only connections or cannot directly connect to Supabase.

---

## 🚀 Features

✅ **HTTP Proxy** - Bridge for GPS devices to Supabase Edge Functions  
✅ **Swagger Documentation** - Interactive API documentation with authentication  
✅ **Request Validation** - Validate GPS data and coordinates  
✅ **Error Handling** - Comprehensive error messages  
✅ **Logging** - Request/response logging for monitoring  
✅ **CORS Support** - Cross-origin resource sharing enabled  
✅ **Health Check** - Service health monitoring endpoint  

---

## 📋 Prerequisites

- Node.js >= 14.x
- npm or yarn
- Supabase account with Edge Function deployed

---

## 🛠️ Installation

### 1. Clone or Navigate to Project

```bash
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# GPS Receiver Endpoint
GPS_RECEIVER_URL=https://YOUR_PROJECT.supabase.co/functions/v1/gps-receiver

# Swagger Authentication
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=your_secure_password

# API Configuration
API_TIMEOUT=30000
```

---

## 🏃 Running the Server

### Development Mode

```bash
npm start
```

### With Nodemon (Auto-restart)

```bash
npm install -g nodemon
npm run dev
```

Server will start on `http://localhost:3000`

---

## 📚 API Documentation

### Access Swagger UI

Navigate to: `http://localhost:3000/api-docs`

**Authentication:**
- **Username:** `admin` (or as configured in `.env`)
- **Password:** `bagdja2025` (or as configured in `.env`)

---

## 🔌 API Endpoints

### 1. Health Check

**GET** `/health`

Check if the API proxy is running properly.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-18T17:00:00.000Z",
  "uptime": 12345.67,
  "environment": "development"
}
```

---

### 2. Send GPS Data

**POST** `/api/gps`

Send GPS location data from device.

**Headers:**
```
avl: 3ZQONE9QTBKZ00UK       (16-digit device AVL)
api-key: HNBZM1ETEK          (10-digit API key)
Content-Type: application/json
```

**Request Body:**
```json
{
  "lat": -7.039333,
  "lng": 107.975278,
  "date_time": 1697644800000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": {
    "id": "81fa2354-f68c-4e63-8abb-caba165a512b",
    "device_id": "1af661ff-0544-4d1f-83f5-e861f4fcec54",
    "lat": -7.039333,
    "lng": 107.975278,
    "date_time": 1697644800000,
    "created_at": "2025-10-18T17:08:28.51833+00:00"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid authentication credentials"
}
```

---

## 🧪 Testing with cURL

### Basic Test

```bash
curl -X POST http://localhost:3000/api/gps \
  -H "avl: 3ZQONE9QTBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -7.039333,
    "lng": 107.975278,
    "date_time": 1697644800000
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

### Access Root

```bash
curl http://localhost:3000/
```

---

## 📱 Device Integration

### Sample Code for GPS Device (Arduino/ESP32)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* serverName = "http://YOUR_SERVER_IP:3000/api/gps";
const char* avl = "3ZQONE9QTBKZ00UK";
const char* apiKey = "HNBZM1ETEK";

void sendGPSData(float lat, float lng) {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("avl", avl);
    http.addHeader("api-key", apiKey);
    
    // Get current timestamp in milliseconds
    unsigned long timestamp = millis();
    
    String jsonData = "{\"lat\":" + String(lat, 6) + 
                      ",\"lng\":" + String(lng, 6) + 
                      ",\"date_time\":" + String(timestamp) + "}";
    
    int httpResponseCode = http.POST(jsonData);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}
```

---

## 🔒 Security

### Swagger Authentication

The API documentation is protected with HTTP Basic Authentication:

- Change default credentials in `.env`
- Use strong passwords in production
- Consider IP whitelisting for production

### Device Authentication

Each device must have:
- **AVL**: 16-digit unique identifier
- **API Key**: 10-digit authentication token

Both are validated by the Supabase Edge Function.

---

## 📊 Monitoring & Logging

### Console Logs

The proxy logs all requests:

```
[2025-10-18T17:08:28.518Z] POST /api/gps - IP: 192.168.1.100
[PROXY] Forwarding GPS data to Supabase - AVL: 3ZQONE9QTBKZ00UK
[PROXY] Success - Device: 3ZQONE9QTBKZ00UK, Lat: -7.039333, Lng: 107.975278
```

### Production Logging

For production, consider integrating:
- Winston for structured logging
- Morgan for HTTP request logging
- PM2 for process management and logs

---

## 🚀 Deployment

### Using Fly.io (Recommended for Production)

**Quick Deploy:**

```bash
# Option 1: Automated script
./deploy-fly.sh

# Option 2: Manual
flyctl auth login
flyctl launch
flyctl deploy
```

**Full Guide:** See `DEPLOY_FLY.md` for complete Fly.io deployment instructions.

**Why Fly.io?**
- ✅ **FREE tier** (no credit card needed!)
- ✅ **Auto-scaling** (suspend when idle)
- ✅ **Global CDN** (Singapore region)
- ✅ **Simple setup** (5 minutes!)

---

### Using PM2

```bash
npm install -g pm2

# Start
pm2 start server.js --name bagdja-gps-proxy

# Monitor
pm2 monit

# Logs
pm2 logs bagdja-gps-proxy

# Restart
pm2 restart bagdja-gps-proxy

# Stop
pm2 stop bagdja-gps-proxy
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t bagdja-gps-proxy .
docker run -p 3000:3000 --env-file .env bagdja-gps-proxy
```

---

## 🌐 Production Checklist

- [ ] Change default Swagger credentials
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (reverse proxy with Nginx/Apache)
- [ ] Implement rate limiting
- [ ] Set up monitoring (Uptime Robot, Pingdom)
- [ ] Configure firewall rules
- [ ] Enable PM2 or Docker for process management
- [ ] Set up log rotation
- [ ] Implement request/response caching if needed
- [ ] Add API versioning

---

## 📁 Project Structure

```
api-proxy/
├── server.js           # Main Express server
├── swagger.js          # Swagger configuration
├── package.json        # Dependencies
├── .env               # Environment variables (gitignored)
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Connection Timeout

- Check Supabase URL in `.env`
- Verify Edge Function is deployed
- Increase `API_TIMEOUT` value
- Check network/firewall settings

### 401 Unauthorized

- Verify AVL and API Key are correct
- Check device exists in database
- Ensure device is active

---

## 📄 License

MIT License - feel free to use for your projects!

---

## 🤝 Support

For issues or questions:
- Check Swagger documentation: http://localhost:3000/api-docs
- Review logs for error details
- Ensure Supabase Edge Function is deployed and working

---

**Made with ❤️ for Bagdja GPS Tracker**

