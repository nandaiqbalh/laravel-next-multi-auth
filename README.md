# Fullstack Starter: Next.js + Laravel API

Template fullstack profesional dan scalable dengan arsitektur clean untuk backend dan layered architecture untuk frontend.

## Stack

- Frontend: Next.js App Router + TypeScript + NextAuth + Tailwind CSS
- Backend: Laravel API + Service Layer + Repository Layer + Sanctum + RBAC
- Database: PostgreSQL
- Container: Docker + Compose (`docker-compose.dev.yml`, `docker-compose-prod.yml`)

## Arsitektur

### Backend (`backend`)

- `app/Http/Controllers`: hanya request/response
- `app/Http/Requests`: validasi input (FormRequest)
- `app/Services`: business logic
- `app/Repositories`: data access
- `app/Models`: entity Eloquent
- `app/Http/Middleware/RoleMiddleware.php`: RBAC middleware

Semua endpoint menggunakan format response:

```json
{
  "error": false,
  "message": "string",
  "data": {}
}
```

### Frontend (`frontend`)

- `lib/repositories`: API calls
- `lib/services`: business logic frontend
- `lib/actions`: server actions
- `app/*/page.tsx`: server page ambil initial data
- `components/**`: client UI components

## Endpoint API

- Auth:
  - `POST /api/login`
  - `POST /api/register`
  - `POST /api/logout`
  - `GET /api/me`
- Admin only:
  - `GET|POST|PUT|DELETE /api/roles`
  - `GET|POST|PUT|DELETE /api/users`

## Auth Flow

1. User login via NextAuth Credentials (frontend login page).
2. NextAuth call Laravel `POST /api/login`.
3. Laravel return token Sanctum + profile user + role.
4. Token disimpan di JWT session NextAuth.
5. Semua request CRUD admin membawa `Authorization: Bearer <token>`.
6. Backend cek `auth:sanctum` + middleware `role:admin`.

## Seeder Default

- Roles:
  - `admin`
  - `user`
- Admin:
  - email: `admin@example.com`
  - password: `password123`

## Setup

### 1. Isi environment root

File root `.env` dipakai oleh semua service Docker. Pastikan nilai ini valid:

- `FRONTEND_PORT`
- `BACKEND_PORT`
- `POSTGRES_PORT`
- `NEXTAUTH_SECRET`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `NEXT_PUBLIC_API_BASE_URL`

Contoh konfigurasi port via ENV:

```env
FRONTEND_PORT=3000
BACKEND_PORT=8000
POSTGRES_PORT=5432
```

Semua mapping port container menggunakan variabel di atas lewat compose.

### 2. Build dan Run Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

Akses:

- Frontend: `http://localhost:${FRONTEND_PORT}`
- Backend API: `http://localhost:${BACKEND_PORT}/api`

### 3. Seed Database Manual (opsional)

Jika ingin jalankan seed ulang:

```bash
docker compose -f docker-compose.dev.yml exec backend php artisan db:seed
```

Atau reset + migrate + seed:

```bash
docker compose -f docker-compose.dev.yml exec backend php artisan migrate:fresh --seed
```

### 4. Run Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Build dan Test Sampai Clean

### Backend otomatis test

```bash
cd backend
composer install
php artisan test
```

### Frontend lint + build + smoke test

```bash
cd frontend
npm install
npm run lint
npm run build
npm run smoke
```

Smoke test akan:

1. Build Next.js
2. Menjalankan `next start`
3. Mengecek endpoint `/login` merespons dan halaman termuat

## Struktur Folder Ringkas

```text
.
├── .env
├── docker-compose.dev.yml
├── docker-compose-prod.yml
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── Http
│   │   │   ├── Controllers
│   │   │   ├── Middleware
│   │   │   └── Requests
│   │   ├── Models
│   │   ├── Repositories
│   │   └── Services
│   ├── database
│   │   ├── migrations
│   │   └── seeders
│   └── routes
│       ├── api.php
│       └── web.php
└── frontend
    ├── Dockerfile
    ├── auth.ts
    ├── middleware.ts
    ├── app
    │   ├── (auth)
    │   ├── admin
    │   ├── user
    │   └── api/auth/[...nextauth]
    ├── components
    ├── lib
    │   ├── actions
    │   ├── repositories
    │   └── services
    └── types
```

## Catatan Penting

- Jalankan `composer install` di backend dan `npm install` di frontend jika tidak menggunakan Docker.
- APP key Laravel akan di-generate saat startup dev (`php artisan key:generate --force`).
- Untuk production, set `APP_KEY` permanen di root `.env`.
