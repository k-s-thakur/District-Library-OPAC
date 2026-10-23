# District Library OPAC (Public Discovery Portal)

Citizen-facing Online Public Access Catalog (OPAC) website for the District Public Library System. Inspired by ManyBooks discovery patterns with curated book rows, visual Dewey categories, real-time physical copy availability, and shelf locations.

---

## 🌟 Key Features

- **ManyBooks Inspired Discovery**:
  - Live global search by title, author, subject, category, and ISBN.
  - Curated rows: Editor's Choice, Popular Titles, Academic Classics.
  - Interactive Dewey Decimal System category tiles.
- **Real-Time Holdings & Availability**:
  - Live physical book copy availability and shelf location mapping (e.g. Rack A-12).
  - Member book reservations and holds.
- **Citizen Account & Information**:
  - Member profile view with active loans and reservation history.
  - Library opening hours, membership guidelines, borrowing rules, and contact information.
- **Privacy & Security**:
  - Public discovery only — internal audit logs, staff details, and fine collections are isolated to the Admin Portal.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: SQLite / PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS & Lucide Icons

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   # In development, points to the shared database
   DATABASE_URL="file:../District-Library-Admin/prisma/library.db"
   PORT=3000
   ```
3. **Generate Prisma Client**:
   ```bash
   npm run build
   # or
   npx prisma generate
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Related Portals
- **Staff & Admin Management Portal**: [District-Library-Admin](../District-Library-Admin)
