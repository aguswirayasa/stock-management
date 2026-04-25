# Sistem Manajemen Stok Multivariasi — Implementation Plan

> **Created:** 2026-04-23  
> **Status:** Design Validated ✅  
> **Tech Stack:** Next.js 16.2.4 + React 19 + TypeScript + Prisma 7.8.0 + MariaDB + Tailwind v4 + Shadcn UI

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  Next.js App Router (React 19 + Tailwind + Shadcn UI)   │
│  PWA (Phase 2) — Responsive Mobile-First                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                   Next.js Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ API Routes   │  │ Server       │  │ NextAuth      │  │
│  │ /api/*       │  │ Components   │  │ JWT Sessions  │  │
│  └──────┬───────┘  └──────────────┘  └───────────────┘  │
│         │                                                │
│  ┌──────▼───────┐  ┌──────────────┐                     │
│  │ Prisma ORM   │  │ SKU Generator│                     │
│  │ Client       │  │ Helper       │                     │
│  └──────┬───────┘  └──────────────┘                     │
└─────────┼───────────────────────────────────────────────┘
          │ TCP
┌─────────▼───────────┐    ┌──────────────────┐
│   MariaDB Database   │    │  Telegram Bot API │
│   (Docker container) │    │  (Phase 2)        │
└─────────────────────┘    └──────────────────┘
```

### Komponen Utama

| Komponen | Fungsi |
|----------|--------|
| **Next.js App Router** | Server/client rendering, API routes, middleware auth |
| **Prisma ORM** | Type-safe database access, migrations |
| **NextAuth JWT** | Authentication dengan role-based access (ADMIN/PEGAWAI) |
| **SKU Generator** | Cartesian product generator + auto SKU naming |
| **Shadcn UI + Tailwind** | Component library + responsive styling |

---

## 2. Database Design

### Design Approach: **Fully Relational (Normalized)**

**Rationale:**
- Unlimited variation levels tanpa hardcoded columns
- Shared/global variation types & values — rename otomatis konsisten
- Full referential integrity — tidak bisa ada SKU dengan nilai invalid
- Untuk skala <1000 SKU, JOIN performance bukan masalah

**Trade-offs:**
- ✅ Data integrity terjaga
- ✅ Queryable & indexable
- ⚠️ Butuh beberapa JOIN untuk query lengkap
- ⚠️ Lebih kompleks dari JSON approach, tapi lebih aman

### Schema (9 Tabel)

#### User (UPDATE existing — tambah `name`)

```prisma
model User {
  id        String     @id @default(cuid())
  username  String     @unique
  name      String                          // ⭐ BARU: untuk nama kasir
  password  String
  role      Role       @default(PEGAWAI)
  stockIns  StockIn[]
  stockOuts StockOut[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum Role {
  ADMIN
  PEGAWAI
}
```

#### Category

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### Product

```prisma
model Product {
  id             String                 @id @default(cuid())
  name           String
  description    String?
  image          String?                // URL/path gambar
  categoryId     String
  category       Category               @relation(fields: [categoryId], references: [id])
  variationTypes ProductVariationType[]
  variants       ProductVariant[]
  createdAt      DateTime               @default(now())
  updatedAt      DateTime               @updatedAt
}
```

#### VariationType (Global)

```prisma
model VariationType {
  id                    String                 @id @default(cuid())
  name                  String                 @unique  // "Warna", "Ukuran", dll
  values                VariationValue[]
  productVariationTypes ProductVariationType[]
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
}
```

#### VariationValue (Global, belongs to VariationType)

```prisma
model VariationValue {
  id                   String                @id @default(cuid())
  value                String                // "Merah", "Besar", "0.5mm"
  variationTypeId      String
  variationType        VariationType         @relation(fields: [variationTypeId], references: [id])
  productVariantValues ProductVariantValue[]
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @updatedAt

  @@unique([variationTypeId, value])  // Tidak boleh duplikat nilai per tipe
}
```

#### ProductVariationType (Variasi apa yang dipakai produk + urutan level)

```prisma
model ProductVariationType {
  id              String        @id @default(cuid())
  productId       String
  product         Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  variationTypeId String
  variationType   VariationType @relation(fields: [variationTypeId], references: [id])
  sortOrder       Int           // Urutan level: 1=Ukuran, 2=Warna, 3=Ketebalan

  @@unique([productId, variationTypeId])
  @@index([productId])
}
```

#### ProductVariant (= SKU — harga & stok ada di sini)

```prisma
model ProductVariant {
  id        String                @id @default(cuid())
  productId String
  product   Product               @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku       String                @unique  // Auto-generated: "PLT-BSR-MRH-05"
  price     Decimal               @db.Decimal(12, 2)
  stock     Int                   @default(0)  // ⭐ STOK ADA DI SINI
  minStock  Int                   @default(0)  // Threshold notifikasi
  isActive  Boolean               @default(true)
  values    ProductVariantValue[]
  stockIns  StockIn[]
  stockOuts StockOut[]
  createdAt DateTime              @default(now())
  updatedAt DateTime              @updatedAt

  @@index([productId])
}
```

#### ProductVariantValue (Junction: nilai apa yang membentuk SKU)

```prisma
model ProductVariantValue {
  id               String          @id @default(cuid())
  variantId        String
  variant          ProductVariant  @relation(fields: [variantId], references: [id], onDelete: Cascade)
  variationValueId String
  variationValue   VariationValue  @relation(fields: [variationValueId], references: [id])

  @@unique([variantId, variationValueId])
  @@index([variantId])
}
```

#### StockIn (Barang Masuk)

```prisma
model StockIn {
  id        String         @id @default(cuid())
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  note      String?
  userId    String
  user      User           @relation(fields: [userId], references: [id])
  createdAt DateTime       @default(now())

  @@index([variantId])
  @@index([createdAt])
}
```

#### StockOut (Barang Keluar — Kasir)

```prisma
model StockOut {
  id        String         @id @default(cuid())
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  note      String?
  userId    String
  user      User           @relation(fields: [userId], references: [id])  // Kasir (user.name)
  createdAt DateTime       @default(now())

  @@index([variantId])
  @@index([createdAt])
}
```

### Relationship Diagram

```
User ──────────────────────┐
                           │ userId
Category ─┐                ▼
           │ categoryId   StockIn / StockOut
           ▼                ▲
        Product             │ variantId
           │                │
           ├── ProductVariationType ── VariationType
           │     (sortOrder)               │
           │                               │
           └── ProductVariant (SKU) ◄──────┤
                 │  sku, price,            │
                 │  stock, minStock        │
                 │                         ▼
                 └── ProductVariantValue ── VariationValue
```

### Contoh Data Konkret

**Produk "Plastik HD"** dengan variasi Ukuran × Warna × Ketebalan:

| SKU | Ukuran | Warna | Ketebalan | Stock | Price | MinStock |
|-----|--------|-------|-----------|-------|-------|----------|
| PLT-BSR-MRH-05 | Besar | Merah | 0.5mm | 150 | 5000 | 10 |
| PLT-BSR-MRH-10 | Besar | Merah | 1.0mm | 80 | 7000 | 10 |
| PLT-BSR-BRU-05 | Besar | Biru | 0.5mm | 200 | 5000 | 10 |
| PLT-KCL-MRH-05 | Kecil | Merah | 0.5mm | 120 | 3500 | 10 |

---

## 3. Backend Design

### Folder Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/route.ts     ← sudah ada
│   ├── categories/
│   │   ├── route.ts                    ← GET (list), POST (create)
│   │   └── [id]/route.ts              ← GET, PUT, DELETE
│   ├── products/
│   │   ├── route.ts                    ← GET (list+filter), POST
│   │   ├── [id]/route.ts              ← GET (detail+variants), PUT, DELETE
│   │   └── [id]/variants/
│   │       ├── route.ts               ← POST (generate SKUs)
│   │       └── [variantId]/route.ts   ← PUT, DELETE
│   ├── variations/
│   │   ├── types/
│   │   │   ├── route.ts               ← GET, POST
│   │   │   └── [id]/route.ts          ← PUT, DELETE
│   │   └── values/
│   │       ├── route.ts               ← GET (by typeId), POST
│   │       └── [id]/route.ts          ← PUT, DELETE
│   ├── stock/
│   │   ├── in/route.ts                ← POST (barang masuk)
│   │   ├── out/route.ts               ← POST (barang keluar + validasi)
│   │   └── history/route.ts           ← GET (riwayat)
│   ├── dashboard/
│   │   └── route.ts                   ← GET (statistik ringkasan)
│   └── users/
│       ├── route.ts                   ← GET, POST
│       └── [id]/route.ts             ← PUT, DELETE
├── dashboard/page.tsx
├── products/
│   ├── page.tsx                        ← List produk
│   ├── new/page.tsx                    ← Wizard 3-step
│   └── [id]/page.tsx                  ← Detail + edit
├── stock/
│   ├── in/page.tsx                     ← Form barang masuk
│   ├── out/page.tsx                    ← Form kasir
│   └── history/page.tsx               ← Riwayat
├── variations/page.tsx                 ← Kelola variasi global
├── users/page.tsx                      ← User management
├── login/page.tsx                      ← sudah ada
└── layout.tsx                          ← Root layout (sidebar/bottom nav)

lib/
├── auth.ts                             ← sudah ada
├── prisma.ts                           ← sudah ada
├── api-helpers.ts                      ← response format, error handler, auth guard
├── sku-generator.ts                    ← cartesian product + auto SKU naming
└── utils.ts                            ← sudah ada

components/
├── ui/                                 ← Shadcn UI components
├── layout/
│   ├── Sidebar.tsx                     ← Desktop navigation
│   ├── BottomNav.tsx                   ← Mobile navigation
│   └── AppShell.tsx                    ← Layout wrapper
├── products/
│   ├── ProductForm.tsx                 ← Step 1: info dasar
│   ├── VariationSelector.tsx           ← Step 2: pilih variasi
│   ├── SkuMatrixEditor.tsx            ← Step 3: matrix harga/stok
│   └── ProductCard.tsx                ← Card untuk list
├── stock/
│   ├── StockInForm.tsx
│   ├── StockOutForm.tsx
│   └── StockHistoryTable.tsx
└── dashboard/
    ├── StatCard.tsx
    └── LowStockAlert.tsx
```

### Architecture Pattern: Thin Route Handlers

Logic langsung di route handler, dipecah ke helper functions jika kompleks. Untuk skala bisnis kecil, ini lebih pragmatis daripada full Clean Architecture.

### Key API Endpoints

| Endpoint | Method | Fungsi | Auth |
|----------|--------|--------|------|
| `POST /api/products` | POST | Buat produk + pilih variation types | Admin |
| `POST /api/products/[id]/variants` | POST | Generate SKU dari matrix kombinasi | Admin |
| `PUT /api/products/[id]/variants/[variantId]` | PUT | Update harga/stok/minStock per SKU | Admin |
| `POST /api/stock/in` | POST | Barang masuk + update stok (DB transaction) | Admin |
| `POST /api/stock/out` | POST | Barang keluar + validasi stok ≥ qty | Semua |
| `GET /api/dashboard` | GET | Aggregate statistics | Semua |

### Variant Generation API

`POST /api/products/[id]/variants` menerima:

```json
{
  "combinations": {
    "typeId_ukuran": ["valueId_besar", "valueId_kecil"],
    "typeId_warna": ["valueId_merah", "valueId_biru"]
  },
  "defaultPrice": 5000
}
```

Lalu generate cartesian product → 4 SKU (Besar×Merah, Besar×Biru, Kecil×Merah, Kecil×Biru).

### Stock Out Validation (Critical)

```typescript
// Gunakan raw query atau Prisma transaction untuk atomic update
const result = await prisma.$transaction(async (tx) => {
  const variant = await tx.productVariant.findUnique({
    where: { id: variantId }
  });
  
  if (!variant || variant.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  
  await tx.productVariant.update({
    where: { id: variantId },
    data: { stock: { decrement: quantity } }
  });
  
  return tx.stockOut.create({
    data: { variantId, quantity, note, userId }
  });
});
```

---

## 4. Frontend UX Flow

### Product Creation Wizard (3-Step)

```
Step 1: Info Dasar          Step 2: Pilih Variasi       Step 3: Matrix SKU
┌─────────────────┐        ┌──────────────────────┐     ┌─────────────────────────┐
│ Nama: [Plastik] │   →    │ ☑ Ukuran             │  →  │ SKU Matrix Editor       │
│ Kategori: [___] │        │   [Besar] [Kecil]    │     │                         │
│ Gambar: [📷]    │        │ ☑ Warna              │     │ Bsr×Mrh  Stok[0] Rp[__] │
│ Deskripsi: [__] │        │   [Merah] [Biru]     │     │ Bsr×Bru  Stok[0] Rp[__] │
└─────────────────┘        │ ☑ Ketebalan          │     │ Kcl×Mrh  Stok[0] Rp[__] │
                           │   [0.5mm] [1.0mm]    │     │ Kcl×Bru  Stok[0] Rp[__] │
                           │ + Tambah variasi baru │     │                         │
                           └──────────────────────┘     │ [Bulk set price: ____]  │
                                                        │ [✓ Simpan]              │
                                                        └─────────────────────────┘
```

**Step 2 — Variation Selector:**
- Tampilkan semua VariationType global sebagai checkbox
- Setelah dipilih, tampilkan VariationValue sebagai tag/chip
- User bisa tambah value baru inline (ketik, enter)
- Drag & drop untuk atur sortOrder

**Step 3 — Matrix SKU Editor:**
- Auto-generate cartesian product dari semua kombinasi
- Tabel: SKU (auto), Price, Min Stock
- Bulk actions: set harga semua, set min stock semua
- Bisa deactivate kombinasi (bukan hapus)

### Pages

| Halaman | Fungsi | Role |
|---------|--------|------|
| `/dashboard` | Ringkasan stok, low-stock alerts, statistik | Semua |
| `/products` | List produk + filter kategori | Semua |
| `/products/new` | Wizard 3-step | Admin |
| `/products/[id]` | Detail + edit variasi & harga | Admin |
| `/stock/in` | Form barang masuk (pilih SKU, qty) | Admin |
| `/stock/out` | Form kasir (pilih SKU, qty) | Semua |
| `/stock/history` | Riwayat masuk/keluar | Admin |
| `/users` | Manajemen user | Admin |
| `/variations` | Kelola tipe & nilai variasi global | Admin |

---

## 5. Responsive & Mobile-First Strategy

### Layout Adaptation

| Elemen | Desktop (≥768px) | Mobile (<768px) |
|--------|-------------------|-----------------|
| Navigation | Sidebar kiri (collapsible) | Bottom nav bar (fixed) |
| SKU Matrix | Tabel horizontal penuh | Card-based list vertikal |
| Product List | Tabel dengan kolom lengkap | Card list ringkas |
| Forms | Side-by-side layout | Stacked full-width |
| Dashboard | Grid 3-4 kolom stat cards | Grid 1-2 kolom |

### SKU Matrix Adaptation

Desktop (tabel):
```
| SKU              | Ukuran | Warna | Harga | Stok | Min |
|------------------|--------|-------|-------|------|-----|
| PLT-BSR-MRH-05  | Besar  | Merah | 5000  | 150  | 10  |
```

Mobile (card):
```
┌─────────────────────────┐
│ PLT-BSR-MRH-05          │
│ Besar · Merah · 0.5mm   │
│ ─────────────────────── │
│ Harga: Rp 5.000         │
│ Stok: 150  |  Min: 10   │
│ [Edit]                  │
└─────────────────────────┘
```

### Navigation Components

```
Desktop:                          Mobile:
┌──────┬─────────────────┐       ┌─────────────────────┐
│ Side │                  │       │     Content Area     │
│ bar  │   Content Area   │       │                     │
│      │                  │       │                     │
│ 📊   │                  │       ├──┬──┬──┬──┬──┤
│ 📦   │                  │       │📊│📦│➕│📋│👤│
│ ➕   │                  │       │  │  │  │  │  │
│ 📋   │                  │       └──┴──┴──┴──┴──┘
│ 👤   │                  │       Bottom Nav (fixed)
└──────┴─────────────────┘
```

### Tailwind Breakpoints

- `sm:` (640px) — Mobile landscape
- `md:` (768px) — Tablet → sidebar muncul
- `lg:` (1024px) — Desktop → layout penuh

Form kasir dioptimasi untuk one-handed mobile use: tombol besar, `inputMode="numeric"`.

---

## 6. Step-by-Step Implementation Plan

### Phase 1: Foundation & Database (3-4 hari)
- [ ] Update model User (tambah field `name`)
- [ ] Buat semua model baru di Prisma schema (9 tabel)
- [ ] Jalankan migration
- [ ] Buat seed data (sample produk, variasi, SKU)
- [ ] Buat `api-helpers.ts` (response format, error handler, auth guard)
- [ ] Buat layout shell (Sidebar + BottomNav + AppShell)

### Phase 2: Variation Management (2-3 hari)
- [ ] API CRUD VariationType & VariationValue
- [ ] Halaman `/variations` — UI kelola tipe & nilai variasi
- [ ] Validasi: tidak bisa hapus tipe/nilai yang sedang dipakai produk

### Phase 3: Product & SKU Core (5-7 hari) ⭐ Terberat
- [ ] API CRUD Category
- [ ] API CRUD Product (info dasar)
- [ ] API assign variation types ke produk
- [ ] `sku-generator.ts` — cartesian product + auto SKU naming
- [ ] API generate variants (POST `/products/[id]/variants`)
- [ ] UI Wizard 3-step (info → pilih variasi → matrix editor)
- [ ] UI edit harga & stok per SKU

### Phase 4: Stock Transactions (3-4 hari)
- [ ] API POST /stock/in — barang masuk + update stok (DB transaction)
- [ ] API POST /stock/out — barang keluar + validasi + update stok
- [ ] Halaman `/stock/in` dan `/stock/out` — form dengan search SKU
- [ ] Halaman `/stock/history` — riwayat transaksi

### Phase 5: Dashboard & User Management (3-4 hari)
- [ ] API dashboard statistics (aggregate queries)
- [ ] Dashboard UI — stat cards, low-stock alerts
- [ ] CRUD user + halaman `/users`
- [ ] Responsive testing & polish

### Phase 6: Polish & Testing (2-3 hari)
- [ ] Responsive testing semua halaman
- [ ] Edge cases: hapus produk yang punya stok, dll
- [ ] Loading states, error states, empty states
- [ ] UX polish: animasi, feedback toast (Sonner)

### Phase 7: Telegram & PWA (Fase 2 — nanti)
- [ ] Telegram bot setup (node-telegram-bot-api)
- [ ] Alert stok minimum otomatis
- [ ] Command bot: /cekstok [SKU]
- [ ] PWA manifest + service worker

### Phase 8: Deployment (Fase 3 — nanti)
- [ ] Dockerfile (multi-stage build)
- [ ] docker-compose.yml (app + MariaDB)
- [ ] Nginx reverse proxy
- [ ] Deploy ke VPS

---

## 7. Risiko & Tantangan Teknis

| Risiko | Impact | Mitigasi |
|--------|--------|----------|
| **Cartesian explosion** — 5 tipe × 10 nilai = 100.000 SKU | High | Limit maks kombinasi per produk (misal 500), warning di UI |
| **Race condition stok** — 2 kasir barang keluar bersamaan | Medium | DB transaction: `UPDATE SET stock = stock - qty WHERE stock >= qty` |
| **Hapus variasi yang sedang dipakai** | Medium | Soft-check sebelum hapus, tampilkan produk terdampak |
| **SKU Matrix UI lambat di mobile** | Low | Pagination jika >50 SKU per produk |
| **Orphaned variants** — ubah variasi produk, SKU lama tidak valid | Medium | Tampilkan diff SKU baru vs lama, konfirmasi user |
| **Image upload storage** | Low | Mulai dengan filesystem/public folder, migrasi ke S3 nanti jika perlu |

---

## 8. Improvement Ideas (Future)

1. **Barcode/QR generator** — generate barcode per SKU untuk scan cepat
2. **Export/Import Excel** — bulk update harga & stok via spreadsheet
3. **Audit log** — siapa mengubah apa, kapan
4. **Multi-gambar per produk** — galeri gambar
5. **Laporan periode** — stok masuk/keluar per minggu/bulan (chart)
6. **Search dengan autocomplete** — cari SKU/produk cepat di form kasir
7. **Dark mode** — sudah ada next-themes, tinggal implementasi

---

## 9. Decision Log

| # | Keputusan | Alternatif | Alasan |
|---|-----------|------------|--------|
| 1 | **Fully Relational** untuk variasi | JSON-based, Hybrid | Data integrity, shared/global values natural fit, MariaDB JSON support terbatas |
| 2 | **Shared/Global** variation types & values | Per-produk, Hybrid | Konsistensi data, rename sekali berlaku semua, menghindari duplikasi |
| 3 | **Auto-generated SKU** | Manual, Hybrid | Konsistensi format, mengurangi human error |
| 4 | **Stok di level ProductVariant** | Stok di level Product | Setiap kombinasi variasi harus punya stok sendiri |
| 5 | **Thin Route Handlers** | Clean Architecture, Repository pattern | Skala bisnis kecil, pragmatis, tidak over-engineer |
| 6 | **3-Step Wizard** untuk product creation | Single form, Tab-based | Memecah kompleksitas, mobile-friendly |
| 7 | **Sidebar (desktop) + Bottom Nav (mobile)** | Hamburger menu, Top nav | Best practice mobile UX, thumb-friendly |
| 8 | **Telegram di Phase 2** | Phase 1 | Fokus core feature dulu |
| 9 | **Docker deployment di Phase 3** | Vercel, bare metal | User preference, flexibility |
| 10 | **Kategori flat (1 level)** | Nested/hierarchical | YAGNI — bisnis kecil tidak butuh hierarki kompleks |

---

## 10. Assumptions

1. User `name` field ditambahkan ke model User (untuk nama kasir di StockOut)
2. Harga per variasi (per SKU), bukan harga global per produk
3. Stok tidak boleh minus — validasi di backend saat barang keluar
4. Kategori produk flat (1 level), bukan hierarki nested
5. Gambar produk di level produk, bukan per variasi/SKU
6. Minimum stock threshold didefinisikan per SKU
7. MariaDB digunakan sebagai database (via @prisma/adapter-mariadb)
8. Skala: 1-5 user, <500 produk, <1000 SKU variasi

---

## Non-Goals

- Tidak ada modul penjualan/invoice penuh (hanya pencatatan keluar)
- Tidak ada integrasi e-commerce
- Tidak ada multi-gudang/multi-lokasi
- Tidak ada barcode/QR scanning (bisa ditambah nanti)
- Tidak ada multi-bahasa (Bahasa Indonesia only)
