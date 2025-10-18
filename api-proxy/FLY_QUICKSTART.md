# ⚡ Fly.io Quick Deploy - 5 Menit!

Deploy GPS API Proxy ke Fly.io dalam 5 menit! **NO CREDIT CARD NEEDED!** 🎉

---

## 🚀 One-Command Deploy

```bash
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
./deploy-fly.sh
```

Script akan otomatis:
1. ✅ Check/install Fly CLI
2. ✅ Login ke Fly.io
3. ✅ Launch app
4. ✅ Set secrets
5. ✅ Deploy!

---

## 📋 Manual Steps (if needed)

### 1. Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login

```bash
flyctl auth login
```

Browser akan buka - **Sign up GRATIS, tidak perlu credit card!**

### 3. Launch

```bash
cd /Users/nandanghermawan/Project/bagdja-gps/api-proxy
flyctl launch --no-deploy
```

Pilih:
- **Region:** sin (Singapore)
- **PostgreSQL:** No
- **Redis:** No

### 4. Set Secrets

```bash
flyctl secrets set GPS_RECEIVER_URL="https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver"
flyctl secrets set SWAGGER_USERNAME="admin"
flyctl secrets set SWAGGER_PASSWORD="your_secure_password"
flyctl secrets set API_TIMEOUT="30000"
```

### 5. Deploy!

```bash
flyctl deploy
```

---

## 🧪 Test

```bash
# Get your URL
flyctl info

# Test (replace with your URL)
curl https://your-app.fly.dev/health

# Open Swagger
open https://your-app.fly.dev/api-docs
```

---

## 🎯 Your App is LIVE!

**URLs:**
- **API:** https://your-app.fly.dev
- **Docs:** https://your-app.fly.dev/api-docs
- **Health:** https://your-app.fly.dev/health

---

## 💰 Cost

**100% FREE!** 🎉

Fly.io free tier:
- 3 shared VMs
- 3GB storage
- 160GB bandwidth
- Auto-suspend (save resources!)

Perfect untuk GPS tracking! 📡

---

## 📚 Full Documentation

See `DEPLOY_FLY.md` for complete guide.

---

**Deploy time: < 5 minutes!** ⚡
**No credit card required!** 💳❌

