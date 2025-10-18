# Bagdja GPS Tracker

Sistem GPS tracking dengan Supabase backend dan React frontend.

## 🚀 Fitur

- 🔐 **Autentikasi** - Login dan register dengan Supabase Auth
- 📱 **Device Management** - CRUD device dengan AVL dan API key
- 📍 **GPS Data Receiver** - Edge function untuk menerima data GPS dari device
- 🔒 **Secure** - Row Level Security (RLS) untuk keamanan data

## 📋 Tech Stack

- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Inline CSS dengan modern gradient design
- **State Management**: React Context + TanStack Query

## 🛠️ Setup

### 1. Setup Supabase

#### Local Development (Optional)
```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Initialize project
cd bagdja-gps
supabase init

# Start local Supabase
supabase start

# Run migrations
supabase db push
```

#### Production (Supabase Cloud)
1. Buat project baru di [Supabase Dashboard](https://app.supabase.com)
2. Jalankan migration di SQL Editor:
   - Copy isi file `supabase/migrations/20251018000001_initial_schema.sql`
   - Paste dan run di SQL Editor

3. Deploy Edge Function:
```bash
# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy gps-receiver
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local dengan credentials Supabase Anda
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Run development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📡 API Usage

### Mengirim Data GPS

Endpoint: `https://your-project.supabase.co/functions/v1/gps-receiver`

**Headers:**
```
avl: YOUR_DEVICE_AVL
api-key: YOUR_DEVICE_API_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "lat": -6.200000,
  "lng": 106.816666,
  "date_time": 1697644800000
}
```

**Example dengan curl:**
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/gps-receiver \
  -H "avl: YOUR_AVL" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": {
    "id": "uuid",
    "device_id": "uuid",
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000,
    "created_at": "2025-10-18T10:00:00Z"
  }
}
```

## 📊 Database Schema

### Tables

#### `users`
- `id` - UUID (Primary Key, references auth.users)
- `email` - Text (Unique)
- `full_name` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `devices`
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to users)
- `name` - Text (Device name)
- `avl` - Text (Unique, untuk autentikasi)
- `api_key` - Text (Unique, untuk autentikasi)
- `description` - Text (Optional)
- `is_active` - Boolean
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `gps_data`
- `id` - UUID (Primary Key)
- `device_id` - UUID (Foreign Key to devices)
- `lat` - Decimal(10, 8) (Latitude)
- `lng` - Decimal(11, 8) (Longitude)
- `date_time` - BigInt (Unix timestamp)
- `created_at` - Timestamp

## 🔒 Security

- **Row Level Security (RLS)** aktif di semua tabel
- Users hanya bisa akses data mereka sendiri
- Device authentication menggunakan AVL + API Key
- API Key digenerate secara random dengan format `gps_[64-hex-chars]`

## 🎨 Features Detail

### 1. Login/Register
- Email & password authentication
- Auto-redirect setelah login
- Form validation
- Modern gradient UI

### 2. Device Management
- Tambah device baru dengan nama, AVL, dan deskripsi
- Auto-generate API key saat create device
- Edit device (nama, AVL, deskripsi)
- Toggle aktif/nonaktif device
- Hapus device (dengan konfirmasi)
- Display AVL dan API key untuk integrasi

### 3. GPS Receiver Edge Function
- Validasi AVL dan API key
- Validasi format GPS data
- Validasi coordinate ranges
- Auto-save ke database
- CORS enabled untuk cross-origin requests

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy folder 'dist' ke hosting pilihan Anda
```

### Backend (Sudah deployed di Supabase)
Edge function sudah otomatis deployed saat run `supabase functions deploy`

## 📝 Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Edge Function (Auto set by Supabase)
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 🐛 Troubleshooting

### Device tidak bisa send data GPS
- Pastikan AVL dan API key benar
- Pastikan device status aktif (is_active = true)
- Check format data GPS sesuai spesifikasi

### Frontend tidak bisa connect ke Supabase
- Pastikan .env.local sudah diisi dengan benar
- Restart dev server setelah update .env.local

### Migration error
- Pastikan tidak ada tabel yang bentrok
- Drop existing tables jika perlu rebuild dari awal

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

MIT

## 👨‍💻 Author

Nandan Ghermawan

