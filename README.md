# Government Public Library · Online Public Access Catalogue (OPAC)

A high-fidelity clone of [district-library-opac.vercel.app](https://district-library-opac.vercel.app/) built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS.

---

## 🏛️ About the Project

**GPLMS OPAC** (Government Public Library Management System – Online Public Access Catalogue) serves as the citizen-facing discovery node under the Ministry of Culture & Digital India. It provides public catalog searching, stack coordinates (Aisle, Rack, Shelf), physical holding statuses, member portals with digital library cards, and role simulation.

---

## ✨ Features & Pages

1. **Discovery Homepage (`/`)**
   - Live status indicator (National Digital Library Node · CGO Complex, New Delhi).
   - Top role switcher (`Citizen (Rahul)`, `Librarian (Patel)`, `Accounts`, `Super Admin`).
   - "Discover" dropdown menu for quick category taxonomy & trending shelves.
   - Hero search box with quick suggestions (`Constitution`, `Wings of Fire`, `Munshi Premchand`, `Operating Systems`, `Tagore`, `Science`).
   - Interactive carousels:
     - *Editor's Choice & Essential Classics*
     - *Popular in Circulation*
     - *Recently Added to the Stacks*
   - Physical Library visiting guide & Reading Hall timings.
   - Dewey Decimal Classification (DDC) quick index.

2. **Catalogue Search (`/search`)**
   - Full keyword searching across Title, Author, Description, Publisher, ISBN, and Dewey Decimal Code.
   - Category filtering across all 7 subject taxonomies.
   - Availability toggling (*"Available on shelf now"*).
   - Sort options (*Relevance*, *Newest Editions*, *Title A–Z*, *Publication Year*).
   - Pagination and instant filter reset.

3. **Catalogue Categories & DDC Taxonomy (`/categories`)**
   - Subject classification browser covering Dewey Decimal classes (000–900).
   - Category cards with book count badges and accent colors.
   - Explanatory guide on library call numbers.

4. **Book Detail & Physical Location Tracking (`/books/[id]`)**
   - Complete bibliographical details: Title, Subtitle, Author, Publisher, Year, Language, Edition, ISBN.
   - Circulation status & physical stack coordinates (*Aisle, Rack, Shelf*).
   - Call number and available vs. total holding counts.
   - Interactive Hold / Reserve title functionality (`/api/circulation/reserve`) with real-time queue position.
   - Related titles in the same category.

5. **Member Portal & Digital Library Card (`/account`)**
   - Protected dashboard with official Digital Library Card pass (Card No, Category, Validity date).
   - Active Borrowing Quota and metrics: *Active Loans*, *Active Holds*, *Outstanding Dues*.
   - Currently Borrowed Books list with accession numbers, due dates, renewal counts, and Overdue / Active status badges.
   - Active reservations list.

6. **Citizen & Staff Authentication (`/login`)**
   - Member login form.
   - Quick Demo Access buttons:
     - `Citizen (Rahul)` -> Logs in as Rahul Verma (`GPL-2026-00001`, `STUDENT`) -> Redirects to `/account`.
     - `Librarian (Patel)` -> Devendra Patel (`LIBRARIAN`).
     - `Accounts Officer` -> Manoj Agarwal (`ACCOUNTS_OPERATOR`).
     - `Super Admin` -> Dr. K. S. Thakur (`SUPER_ADMIN`).

7. **Library Information & Rules (`/library-information`)**
   - Hours of operation (General Reading Hall, Circulation Desk, Reference Section).
   - Citizen membership categories, security deposits, and borrowing quotas (`#membership`).
   - Stack rules, renewal policies, and overdue fine schedule (`#rules`).
   - Physical transit guide & contact coordinates.

8. **API Endpoints (`/api/...`)**
   - `GET /api/public/catalog/categories` - Returns category list with metadata.
   - `GET /api/public/catalog/search` - Searches and filters book holdings.
   - `POST /api/auth/login` - Authenticates credentials or role switch.
   - `POST /api/auth/logout` - Terminates session.
   - `GET /api/auth/me` - Returns active session.
   - `POST /api/circulation/reserve` - Processes hold requests for checked-out books.
   - `GET /api/members/[id]` - Returns member details and loan history.

---

## 🚀 Running the Project Locally

```bash
# Install dependencies (already completed)
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```
