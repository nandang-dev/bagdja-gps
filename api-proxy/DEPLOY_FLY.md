# 🚀 Deploy Bagdja GPS API Proxy ke Fly.io

Panduan lengkap deploy Express.js API Proxy ke Fly.io - **GRATIS & MUDAH!**

---

## ✨ Kenapa Fly.io?

✅ **Free tier generous** - 3 GB persistent volume storage  
✅ **Tidak perlu credit card** untuk trial  
✅ **Auto-scaling** - suspend saat tidak dipakai  
✅ **Global CDN** - Deploy di Singapore (dekat Indonesia)  
✅ **Simple setup** - 5 menit deploy!  

---

## 📋 Prerequisites

- ✅ Akun Fly.io (https://fly.io/app/sign-up) - GRATIS!
- ✅ Project sudah tested locally

---

## 🛠️ Step 1: Install Fly CLI

### macOS/Linux:

```bash
curl -L https://fly.io/install.sh | sh
```

### Verify Installation:

```bash
flyctl version
```

---

## 🔐 Step 2: Login ke Fly.io

```bash
flyctl auth login
```

Browser akan terbuka untuk login/signup. **Tidak perlu credit card!**

---

## 🚀 Step 3: Deploy Project

### Navigate ke project:

```bash
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
```

### Launch app:

```bash
flyctl launch
```

Akan ditanya beberapa pertanyaan:

```
? Choose an app name: bagdja-gps-proxy (atau biarkan kosong untuk auto-generate)
? Choose a region for deployment: sin (Singapore - terdekat)
? Would you like to set up a Postgresql database? No
? Would you like to set up an Upstash Redis database? No
? Would you like to deploy now? No (set secrets dulu)
```

File `fly.toml` sudah dibuat otomatis! ✅

---

## ⚙️ Step 4: Set Environment Variables (Secrets)

```bash
# Set secrets
flyctl secrets set GPS_RECEIVER_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver"
flyctl secrets set SWAGGER_USERNAME="admin"
flyctl secrets set SWAGGER_PASSWORD="bagdja2025_secure"
flyctl secrets set API_TIMEOUT="30000"
```

⚠️ **PENTING:** Ganti `SWAGGER_PASSWORD` dengan password yang aman!

**PORT** dan **NODE_ENV** sudah di-set di `fly.toml`, tidak perlu secret.

---

## 🌐 Step 5: Deploy!

```bash
flyctl deploy
```

Deploy process:
1. Build Docker image
2. Push ke Fly.io registry
3. Deploy ke Singapore region
4. Health check
5. Done! ✅

---

## 🧪 Step 6: Test Deployment

### Get your app URL:

```bash
flyctl info
```

URL akan seperti: `https://bagdja-gps-proxy.fly.dev`

### Test endpoints:

```bash
# Set your URL
FLY_URL="https://bagdja-gps-proxy.fly.dev"

# Health check
curl $FLY_URL/health

# Test GPS endpoint
curl -X POST $FLY_URL/api/gps \
  -H "avl: 3ZQONE9QTBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{"lat":-7.039333,"lng":107.975278,"date_time":'$(date +%s)000'}'

# Open Swagger (will ask for username/password)
open $FLY_URL/api-docs
```

---

## 📊 Monitoring

### View logs:

```bash
flyctl logs
```

### Check status:

```bash
flyctl status
```

### View metrics:

```bash
flyctl dashboard
```

---

## 🔄 Update Deployment

Setelah make changes:

```bash
# Deploy update
flyctl deploy

# Or auto-deploy on file change
flyctl deploy --watch
```

---

## ⚙️ Configuration Files

### 1. `fly.toml`

```toml
app = 'bagdja-gps-proxy'
primary_region = 'sin'  # Singapore

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = 'suspend'  # Auto-sleep when idle
  auto_start_machines = true      # Auto-wake on request
```

✅ Sudah dibuat!

### 2. `Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

✅ Sudah dibuat!

---

## 💰 Pricing (Free Tier)

Fly.io Free Tier includes:
- ✅ Up to 3 shared-cpu-1x VMs with 256MB RAM each
- ✅ 3GB persistent volume storage
- ✅ 160GB outbound data transfer
- ✅ Auto-suspend when idle (save resources!)

**Perfect untuk GPS Proxy!** 🎉

---

## 🌍 Custom Domain (Optional)

### Add custom domain:

```bash
flyctl certs create api.bagdja-gps.com
```

### Update DNS:

Add CNAME record:
```
Type: CNAME
Name: api
Value: bagdja-gps-proxy.fly.dev
```

### Verify:

```bash
flyctl certs show api.bagdja-gps.com
```

---

## 📈 Scaling

### Scale machines:

```bash
# Add more machines
flyctl scale count 2

# Change machine size
flyctl scale vm shared-cpu-2x

# Scale memory
flyctl scale memory 512
```

Free tier: 1 machine cukup!

---

## 🔒 Security

### View secrets:

```bash
flyctl secrets list
```

### Update secret:

```bash
flyctl secrets set SWAGGER_PASSWORD="new_secure_password"
```

### Remove secret:

```bash
flyctl secrets unset SECRET_NAME
```

---

## 🚨 Troubleshooting

### App not responding?

```bash
# Check status
flyctl status

# View logs
flyctl logs

# Restart app
flyctl restart
```

### Health check failing?

```bash
# SSH into machine
flyctl ssh console

# Check if server running
ps aux | grep node
```

### Deploy failed?

```bash
# Check deploy logs
flyctl logs

# Rebuild
flyctl deploy --no-cache
```

---

## 🔧 Useful Commands

```bash
# Launch app
flyctl launch

# Deploy
flyctl deploy

# View logs
flyctl logs

# Open dashboard
flyctl dashboard

# SSH into machine
flyctl ssh console

# List apps
flyctl apps list

# Delete app
flyctl apps destroy bagdja-gps-proxy

# View secrets
flyctl secrets list

# Check status
flyctl status

# Monitor
flyctl monitor
```

---

## 📱 Update Device Configuration

Setelah deploy, update GPS devices:

```cpp
// Arduino/ESP32
const char* serverName = "https://bagdja-gps-proxy.fly.dev/api/gps";
```

---

## 🎯 Production Checklist

- [ ] Fly CLI installed
- [ ] Logged in to Fly.io
- [ ] App launched
- [ ] Secrets configured
- [ ] App deployed
- [ ] Health check passed
- [ ] GPS endpoint tested
- [ ] Swagger accessible
- [ ] Custom domain (optional)
- [ ] Monitoring setup
- [ ] Devices updated

---

## 🌟 Auto-Scaling

Fly.io automatically:
- **Suspends** machines when no traffic (save resources)
- **Wakes up** in ~1 second when request comes
- **Scales** based on demand

Perfect untuk GPS tracking yang intermittent! 📡

---

## 📚 Resources

- [Fly.io Docs](https://fly.io/docs)
- [Fly.io Dashboard](https://fly.io/dashboard)
- [Fly.io Status](https://status.fly.io)
- [Community Forum](https://community.fly.io)

---

## ✅ Quick Deploy Script

Save as `deploy-fly.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying to Fly.io..."

# Check if flyctl installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not installed"
    echo "Install: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Login check
if ! flyctl auth whoami &> /dev/null; then
    echo "⚠️  Not logged in"
    flyctl auth login
fi

# Deploy
flyctl deploy

echo "✅ Deployment complete!"
flyctl info
```

---

## 🎉 Success!

Your GPS API Proxy is now live on Fly.io! 🚀✨

**Next Steps:**
1. Test all endpoints
2. Update device configurations
3. Monitor logs
4. Set up custom domain (optional)

---

**Fly.io URL:** https://bagdja-gps-proxy.fly.dev  
**API Docs:** https://bagdja-gps-proxy.fly.dev/api-docs  
**Health:** https://bagdja-gps-proxy.fly.dev/health

**Happy Tracking! 📡🗺️**

