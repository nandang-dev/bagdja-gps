# ⚡ Quick Start Guide - Bagdja GPS API Proxy

Get your GPS tracking proxy up and running in 5 minutes!

---

## 🚀 Step 1: Install

```bash
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
npm install
```

---

## ⚙️ Step 2: Configure

```bash
cp .env.example .env
```

Edit `.env` if needed (default configuration works for localhost):

```env
PORT=3000
GPS_RECEIVER_URL=https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=bagdja2025
```

---

## 🏃 Step 3: Start Server

```bash
npm start
```

You should see:

```
============================================================
🚀 Bagdja GPS Tracker API Proxy
============================================================
📍 Server running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api-docs
   Username: admin
   Password: bagdja2025
🔗 GPS Receiver: https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver
⚡ Environment: development
============================================================
```

---

## 🧪 Step 4: Test API

### Option A: Using cURL

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

### Option B: Using Test Script

```bash
./test-device.sh
```

---

## 📚 Step 5: View Documentation

Open browser: `http://localhost:3000/api-docs`

- **Username:** `admin`
- **Password:** `bagdja2025`

---

## 🎯 What's Next?

### For Device Integration:

1. Get your device's AVL and API Key from dashboard
2. Configure device to send HTTP POST to `http://YOUR_SERVER:3000/api/gps`
3. Include headers: `avl` and `api-key`
4. Send JSON body with `lat`, `lng`, `date_time`

### For Production Deployment:

1. Change Swagger credentials in `.env`
2. Set `NODE_ENV=production`
3. Use reverse proxy (Nginx) for HTTPS
4. Deploy with PM2 or Docker
5. Set up monitoring

---

## 🆘 Troubleshooting

### Server won't start?

```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 npm start
```

### GPS data not reaching Supabase?

- Verify GPS_RECEIVER_URL in `.env`
- Check device AVL and API Key are correct
- Review server logs for errors

### Can't access Swagger?

- Check username/password in `.env`
- Try accessing http://localhost:3000/health first

---

## 📖 Full Documentation

See `README.md` for complete documentation including:
- Detailed API reference
- Security configuration
- Production deployment
- Device integration examples
- Monitoring setup

---

**You're all set! 🎉**

Your GPS tracking proxy is now ready to receive data from devices!

