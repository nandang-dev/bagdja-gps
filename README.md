# 📍 Bagdja GPS Tracker

Sistem GPS tracking dengan Supabase backend dan React frontend.

## 🚀 Quick Start

```bash
# 1. Setup Frontend
cd frontend
npm install
cp env-example.txt .env.local
# Edit .env.local dengan Supabase credentials
npm run dev

# 2. Test API
./test-simple.sh
```

## 📚 Documentation

Semua dokumentasi lengkap ada di folder **`docs/`**:

- **[📖 README](docs/README.md)** - Project overview lengkap
- **[⚡ QUICKSTART](docs/QUICKSTART.md)** - Setup dalam 10 menit
- **[🔧 SETUP_GUIDE](docs/SETUP_GUIDE.md)** - Panduan setup detail
- **[📡 API_DOCUMENTATION](docs/API_DOCUMENTATION.md)** - API reference lengkap
- **[💻 CURL_EXAMPLES](docs/CURL_EXAMPLES.md)** - Contoh cURL & testing
- **[✨ FEATURES](docs/FEATURES.md)** - Daftar semua fitur
- **[📊 PROJECT_SUMMARY](docs/PROJECT_SUMMARY.md)** - Summary & statistik

## 🎯 Fitur Utama

- 🔐 **Authentication** - Login & register
- 📱 **Device Management** - CRUD devices dengan AVL & API key
- 📍 **GPS Data Receiver** - Public API untuk terima data GPS
- 🔍 **Search & Filter** - Cari devices dengan mudah
- 📋 **Copy to Clipboard** - Copy AVL & API key dengan 1 klik
- 📱 **Responsive Design** - Mobile & desktop friendly

## 🛠️ Tech Stack

- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Frontend**: React 18 + TypeScript + Vite
- **Security**: Row Level Security (RLS)

## 📡 API Endpoint

```bash
POST https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver

Headers:
  avl: YOUR_DEVICE_AVL
  api-key: YOUR_DEVICE_API_KEY
  Content-Type: application/json

Body:
  {
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }
```

## 📂 Project Structure

```
bagdja-gps/
├── docs/                    # 📚 Dokumentasi lengkap
├── frontend/                # 🎨 React + Vite app
├── supabase/
│   ├── functions/          # ⚡ Edge functions
│   └── migrations/         # 🗄️ Database migrations
├── test-simple.sh          # 🧪 Quick API test
├── test-api-curl.sh        # 🧪 Detailed API test
└── README.md               # 📖 This file
```

## 🚀 Deployment

Lihat **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** untuk panduan deployment lengkap.

## 📞 Support

Untuk pertanyaan atau bantuan:
1. Baca [QUICKSTART.md](docs/QUICKSTART.md) untuk quick start
2. Check [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) untuk API reference
3. Review [CURL_EXAMPLES.md](docs/CURL_EXAMPLES.md) untuk testing examples

## 📄 License

MIT License - Copyright (c) 2025 Nandan Ghermawan

---

**Made with ❤️ for GPS Tracking**

