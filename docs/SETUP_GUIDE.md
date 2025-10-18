# Panduan Setup Bagdja GPS Tracker

## Langkah-langkah Setup

### 1. Setup Supabase Project

#### A. Buat Project di Supabase
1. Buka https://app.supabase.com
2. Klik "New Project"
3. Isi nama project: `bagdja-gps`
4. Pilih password database
5. Pilih region terdekat
6. Tunggu hingga project selesai dibuat (~2 menit)

#### B. Jalankan Database Migration
1. Di Supabase Dashboard, buka menu "SQL Editor"
2. Klik "New Query"
3. Copy seluruh isi file `supabase/migrations/20251018000001_initial_schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" atau tekan Ctrl+Enter
6. Tunggu hingga selesai (akan muncul "Success. No rows returned")

#### C. Deploy Edge Function
```bash
# Install Supabase CLI jika belum
npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project Anda (ganti YOUR_PROJECT_REF dengan project ref Anda)
# Project ref bisa dilihat di Settings > General > Reference ID
cd bagdja-gps
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge function
supabase functions deploy gps-receiver

# Set secrets (optional, sudah auto-set oleh Supabase)
# supabase secrets set SUPABASE_URL=your-url
# supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

#### D. Dapatkan API Credentials
1. Di Supabase Dashboard, buka "Settings" > "API"
2. Copy:
   - Project URL (contoh: https://xxxxx.supabase.co)
   - anon public key (key yang panjang, bukan service_role key)
3. Simpan untuk digunakan di frontend

### 2. Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Buat file .env.local
# Di Windows: copy env-example.txt .env.local
# Di Mac/Linux: cp env-example.txt .env.local

# Edit file .env.local dengan text editor
# Isi dengan credentials dari Supabase:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc....(your-anon-key)

# Jalankan development server
npm run dev
```

### 3. Testing

#### A. Test Frontend
1. Buka browser ke http://localhost:5173
2. Klik "Daftar" untuk membuat akun
3. Isi form registrasi
4. Login dengan akun yang baru dibuat
5. Tambah device baru
6. Copy AVL dan API Key yang tergenerate

#### B. Test GPS Receiver API
```bash
# Ganti values dengan data Anda
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/gps-receiver \
  -H "avl: YOUR_AVL_FROM_DEVICE" \
  -H "api-key: YOUR_API_KEY_FROM_DEVICE" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }'
```

Response sukses:
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": { ... }
}
```

### 4. Verifikasi Database

1. Di Supabase Dashboard, buka "Table Editor"
2. Check tabel-tabel berikut sudah ada:
   - `users`
   - `devices`
   - `gps_data`
3. Buka tabel `gps_data`, seharusnya ada data yang baru masuk dari test curl

## Troubleshooting

### Error: "Invalid authentication credentials"
- Pastikan AVL dan API Key benar (case-sensitive)
- Pastikan device status aktif di dashboard
- Check di Table Editor > devices, pastikan is_active = true

### Error: "Missing Supabase environment variables"
- Pastikan file .env.local sudah dibuat di folder frontend
- Pastikan nama variabel benar (VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY)
- Restart development server setelah buat/update .env.local

### Edge Function tidak bisa di-deploy
- Pastikan sudah login: `supabase login`
- Pastikan sudah link ke project: `supabase link --project-ref YOUR_REF`
- Check Supabase CLI version: `supabase --version` (minimal v1.0.0)

### Tidak bisa login/register
- Check browser console untuk error message
- Pastikan Supabase URL dan Anon Key benar
- Di Supabase Dashboard, check Settings > Authentication > Enable Email provider

### Migration error: "relation already exists"
- Drop existing tables:
```sql
DROP TABLE IF EXISTS public.gps_data CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```
- Jalankan migration lagi

## Production Deployment

### Frontend
```bash
cd frontend
npm run build

# Upload folder 'dist' ke hosting:
# - Vercel: vercel deploy
# - Netlify: netlify deploy --prod
# - Firebase: firebase deploy
```

Jangan lupa set environment variables di hosting:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend
Edge function sudah otomatis production-ready setelah deploy ke Supabase.

### Security Checklist
- [ ] Enable RLS di semua tabel (sudah auto-enabled via migration)
- [ ] Pastikan tidak expose Service Role Key di frontend
- [ ] Set Row Level Security policies (sudah via migration)
- [ ] Enable email confirmation (optional, di Supabase Auth settings)
- [ ] Set rate limiting di Supabase dashboard

## Monitoring

### Check Logs
```bash
# Edge function logs
supabase functions logs gps-receiver

# Real-time logs
supabase functions logs gps-receiver --follow
```

### Supabase Dashboard
- Monitor requests di "Database" > "API"
- Check errors di "Edge Functions" > "gps-receiver" > "Logs"
- Monitor auth users di "Authentication" > "Users"

## Tips

1. **API Key Security**: Jangan commit .env.local ke git
2. **Testing**: Gunakan curl atau Postman untuk test API
3. **Monitoring**: Check logs secara berkala untuk detect issues
4. **Backup**: Export database secara rutin di Settings > Database > Backups
5. **Update**: Pastikan dependencies up-to-date: `npm update`

## Support

Jika ada masalah:
1. Check logs di Supabase Dashboard
2. Check browser console untuk frontend errors
3. Verify credentials di .env.local
4. Test API dengan curl
5. Check RLS policies jika ada permission errors

