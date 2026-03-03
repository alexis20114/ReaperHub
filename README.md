# 💀 ReaperHub — The Bloodiest Roblox Script Hub

> Dark horror-themed Roblox script repository with Supabase backend, React + TypeScript + Vite frontend.

---

## 📁 Project Structure

```
reaperhub/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── particles/
│   │   │   └── BloodParticles.tsx
│   │   └── ui/
│   │       ├── ScriptCard.tsx
│   │       └── toaster.tsx
│   ├── lib/
│   │   ├── supabase.ts        ← Supabase client + TypeScript types
│   │   ├── particles.config.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BrowsePage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── ContributorsPage.tsx
│   │   ├── MailboxPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── AuthPage.tsx
│   ├── store/
│   │   └── index.ts           ← Zustand stores (auth, scripts, mail)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase_schema.sql        ← Run this in Supabase SQL Editor
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Local Development

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/reaperhub.git
cd reaperhub
npm install
```

### 2. Set up Supabase
1. Go to https://supabase.com → New project
2. Open **SQL Editor** → paste entire contents of `supabase_schema.sql` → Run
3. Go to **Settings → API** → copy your Project URL and anon key

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in your Supabase URL + anon key
```

### 4. Run dev server
```bash
npm run dev
# → http://localhost:3000
```

---

## 🌐 Deploy to Render (Static Site)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial ReaperHub"
git remote add origin https://github.com/YOUR_USERNAME/reaperhub.git
git push -u origin main
```

### Step 2 — Create Render Static Site
1. Go to https://render.com → **New → Static Site**
2. Connect your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |
   | **Node Version** | `20` |

### Step 3 — Add Environment Variables
In Render dashboard → **Environment** tab → Add:
```
VITE_SUPABASE_URL      = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
```

### Step 4 — Deploy
Click **Deploy** — Render will build and serve your site on a `.onrender.com` URL.

### Step 5 — Configure SPA routing (VERY IMPORTANT)
Render needs to redirect all routes to `index.html` for React Router to work.

Create a file `public/_redirects`:
```
/*    /index.html   200
```

This is already included in the repo. ✅

---

## 🗄️ Supabase Setup Details

### Auth configuration
- Go to **Authentication → Providers** → Enable **Email** provider
- Disable "Confirm email" for easier testing (optional, but recommended)
- Set **Site URL** to your Render URL (e.g. `https://reaperhub.onrender.com`)

### Storage (for avatars & script thumbnails)
1. Go to **Storage** → Create bucket named `avatars` (public)
2. Create bucket named `thumbnails` (public)
3. Add storage policies:
```sql
-- Allow authenticated users to upload their own avatar
create policy "Avatar uploads"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Public read for avatars
create policy "Avatar public read"
on storage.objects for select
using (bucket_id = 'avatars');
```

---

## 🩸 Features

| Page | Route | Auth Required |
|---|---|---|
| Home | `/` | No |
| Browse Scripts | `/browse` | No |
| Upload Script | `/upload` | ✅ Yes |
| Hall of Fame | `/contributors` | No |
| Mailbox | `/mailbox` | ✅ Yes |
| Settings | `/settings` | ✅ Yes |
| Login/Register | `/auth` | No |

### Anti-Multi-Account
On registration, the user's **public IP** is automatically collected via `https://api.ipify.org` and stored in `profiles.ip_address`. Staff with Supabase dashboard access can query:
```sql
select username, ip_address, created_at
from profiles
group by ip_address
having count(*) > 1;
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + custom CSS
- **Animations**: Framer Motion
- **Particles**: tsParticles (blood/gore theme)
- **State**: Zustand (with localStorage persistence for auth)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Fonts**: Creepster (horror) + Orbitron (tech) + Chakra Petch (body)

---

*ReaperHub is not affiliated with Roblox Corporation.*
