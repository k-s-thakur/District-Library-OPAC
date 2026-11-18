import { Book, Category, Member } from "@/types";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dakuefvvwkpjsyiiwqwh.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3VlZnZ2d2twanN5aWl3cXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyOTI1NTYsImV4cCI6MjEwOTg2ODU1Nn0.Ol6a74ugU9ncEpOULKAcCfSdfoM6WtMvHhzrnXFKD4A";

function getHeaders(preferCount = false): HeadersInit {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
  if (preferCount) {
    headers["Prefer"] = "count=exact";
  }
  return headers;
}

export function mapSupabaseBook(b: any): Book {
  const copies = b.BookCopy || [];
  const totalCopies = copies.length;
  const availableCopies = copies.filter((c: any) => c.status === "AVAILABLE").length;
  const issuedCopies = copies.filter((c: any) => c.status === "ISSUED").length;
  const referenceOnlyCopies = copies.filter(
    (c: any) => c.status === "REFERENCE_ONLY" || c.status === "REFERENCE"
  ).length;

  const shelfLocations: string[] = Array.from(
    new Set(copies.map((c: any) => c.shelfLocation).filter(Boolean))
  ) as string[];

  const primaryLocation = shelfLocations[0] || "Main Stacks";

  let availabilityStatus: Book["availabilityStatus"] = "Available";
  if (availableCopies > 1) {
    availabilityStatus = "Available";
  } else if (availableCopies === 1) {
    availabilityStatus = "Low Stock";
  } else if (availableCopies === 0 && referenceOnlyCopies > 0) {
    availabilityStatus = "Reference Only";
  } else if (totalCopies > 0 && availableCopies === 0) {
    availabilityStatus = "Checked Out";
  } else {
    availabilityStatus = "Available";
  }

  const authors =
    b.BookAuthor?.map((ba: any) => ba.Author?.name).filter(Boolean).join(", ") ||
    "Author Not Listed";

  const category: Category = b.Category
    ? {
        id: b.Category.id,
        name: b.Category.name,
        code: b.Category.code || "GENERAL",
        ddcPrefix: b.Category.ddcPrefix || "000",
        description: b.Category.description || undefined,
        iconName: b.Category.iconName || "BookOpen",
        accentColor: b.Category.accentColor || "teal",
      }
    : {
        id: "cat-general",
        name: "General Collection",
        code: "GENERAL",
        ddcPrefix: "000",
        description: "General literature and books",
        iconName: "BookOpen",
        accentColor: "teal",
      };

  return {
    id: b.id,
    isbn: b.isbn || "",
    title: b.title || "Untitled",
    subtitle: b.subtitle || undefined,
    edition: b.edition || undefined,
    publicationYear: b.publicationYear || new Date().getFullYear(),
    language: b.language || "Hindi/English",
    ddcCode: b.ddcCode || category.ddcPrefix || "000",
    bookNumber: b.bookNumber || "STACK-1",
    description: b.description || "Public district library catalog holding.",
    coverImageUrl: b.coverImageUrl || undefined,
    publisher: b.Publisher?.name || "Library Press",
    category,
    authors,
    totalCopies: Math.max(1, totalCopies),
    availableCopies,
    issuedCopies,
    referenceOnlyCopies,
    primaryLocation,
    availabilityStatus,
    shelfLocations: shelfLocations.length > 0 ? shelfLocations : ["Main Stacks"],
    isFeatured: Boolean(b.isFeatured),
    isEditorChoice: Boolean(b.isEditorChoice),
    isPopular: Boolean(b.isPopular),
  };
}

export interface SearchCatalogOptions {
  query?: string;
  category?: string;
  available?: boolean;
  sort?: "relevance" | "title_asc" | "title_desc" | "newest" | string;
  page?: number;
  limit?: number;
}

export async function fetchCatalogBooks(options: SearchCatalogOptions = {}): Promise<{
  items: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(50, options.limit || 12));
  const offset = (page - 1) * limit;

  const selectFields =
    "id,title,subtitle,isbn,edition,publicationYear,language,ddcCode,bookNumber,description,coverImageUrl,isFeatured,isEditorChoice,isPopular,createdAt,Category(id,name,code,ddcPrefix,description,iconName,accentColor),Publisher(name),BookAuthor(Author(name)),BookCopy(id,accessionNo,status,shelfLocation)";

  const urlParams = new URLSearchParams();
  urlParams.set("select", selectFields);
  urlParams.set("limit", limit.toString());
  urlParams.set("offset", offset.toString());

  // Sorting
  if (options.sort === "title_asc") {
    urlParams.set("order", "title.asc");
  } else if (options.sort === "title_desc") {
    urlParams.set("order", "title.desc");
  } else if (options.sort === "newest") {
    urlParams.set("order", "publicationYear.desc.nullslast");
  } else {
    urlParams.set("order", "createdAt.desc");
  }

  // Text search query across title, isbn, description
  if (options.query && options.query.trim().length > 0) {
    const q = options.query.trim().replace(/[*%]/g, "");
    urlParams.set(
      "or",
      `(title.ilike.*${encodeURIComponent(q)}*,isbn.ilike.*${encodeURIComponent(q)}*,description.ilike.*${encodeURIComponent(q)}*)`
    );
  }

  // Category filter
  if (options.category && options.category.trim().length > 0) {
    const cat = options.category.trim();
    // Support category code or UUID
    urlParams.set("Category.code", `eq.${cat}`);
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/Book?${urlParams.toString()}`;

  try {
    const res = await fetch(endpoint, {
      headers: getHeaders(true),
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      console.error("Supabase catalog fetch failed:", res.status, await res.text());
      return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    // Read total count from Content-Range header: "0-11/17"
    const contentRange = res.headers.get("content-range");
    let total = 0;
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)/);
      if (match) {
        total = parseInt(match[1], 10);
      }
    }

    const data = await res.json();
    let books: Book[] = Array.isArray(data) ? data.map(mapSupabaseBook) : [];

    // In-memory filter for availability if requested
    if (options.available) {
      books = books.filter((b) => b.availableCopies > 0);
    }

    const totalPages = Math.max(1, Math.ceil((total || books.length) / limit));

    return {
      items: books,
      pagination: {
        page,
        limit,
        total: total || books.length,
        totalPages,
      },
    };
  } catch (err) {
    console.error("Error in fetchCatalogBooks:", err);
    return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const selectFields =
    "id,title,subtitle,isbn,edition,publicationYear,language,ddcCode,bookNumber,description,coverImageUrl,isFeatured,isEditorChoice,isPopular,createdAt,Category(id,name,code,ddcPrefix,description,iconName,accentColor),Publisher(name),BookAuthor(Author(name)),BookCopy(id,accessionNo,status,shelfLocation)";

  const endpoint = `${SUPABASE_URL}/rest/v1/Book?select=${selectFields}&id=eq.${encodeURIComponent(id)}&limit=1`;

  try {
    const res = await fetch(endpoint, {
      headers: getHeaders(),
      next: { revalidate: 15 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return mapSupabaseBook(data[0]);
    }
    return null;
  } catch (err) {
    console.error(`Error in fetchBookById(${id}):`, err);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const endpoint = `${SUPABASE_URL}/rest/v1/Category?select=id,name,code,ddcPrefix,description,accentColor,iconName,Book(id)&order=name.asc`;

  try {
    const res = await fetch(endpoint, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      code: c.code || c.id,
      ddcPrefix: c.ddcPrefix || "000",
      description: c.description || "",
      accentColor: c.accentColor || "teal",
      iconName: c.iconName || "BookOpen",
      booksCount: Array.isArray(c.Book) ? c.Book.length : 0,
    }));
  } catch (err) {
    console.error("Error in fetchCategories:", err);
    return [];
  }
}

export async function authenticateMember(identifier: string) {
  const trimmed = identifier.trim().replace(/[*%]/g, "");
  const enc = `*${encodeURIComponent(trimmed)}*`;

  const endpoint = `${SUPABASE_URL}/rest/v1/Member?select=id,memberNo,fullName,email,phone,address,category,status,registrationDate,expiryDate,maxBooks&or=(memberNo.ilike.${enc},email.ilike.${enc},fullName.ilike.${enc})&limit=1`;

  try {
    const res = await fetch(endpoint, {
      headers: getHeaders(),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const m = data[0];
      return {
        id: m.id,
        memberNo: m.memberNo,
        fullName: m.fullName,
        email: m.email,
        phone: m.phone || "N/A",
        role: "MEMBER",
        category: m.category,
        status: m.status,
        maxBooks: m.maxBooks || 3,
        expiryDate: m.expiryDate,
      };
    }
    return null;
  } catch (err) {
    console.error("Error in authenticateMember:", err);
    return null;
  }
}

export async function fetchMemberProfile(idOrMemberNo: string): Promise<Member | null> {
  const trimmed = encodeURIComponent(idOrMemberNo.trim());

  // 1. Fetch Member info
  const memberRes = await fetch(
    `${SUPABASE_URL}/rest/v1/Member?select=id,memberNo,fullName,email,phone,address,category,status,registrationDate,expiryDate,maxBooks&or=(id.eq.${trimmed},memberNo.eq.${trimmed})&limit=1`,
    { headers: getHeaders() }
  );

  if (!memberRes.ok) return null;
  const memberData = await memberRes.json();
  if (!Array.isArray(memberData) || memberData.length === 0) return null;
  const m = memberData[0];

  // 2. Fetch Loans for this member
  const loansRes = await fetch(
    `${SUPABASE_URL}/rest/v1/Loan?memberId=eq.${m.id}&select=id,status,issuedAt,dueDate,returnedAt,renewalCount,BookCopy(id,accessionNo,shelfLocation,status,Book(id,title,isbn,authors:BookAuthor(Author(name))))&order=issuedAt.desc`,
    { headers: getHeaders() }
  );
  const loansData = loansRes.ok ? await loansRes.json() : [];

  // 3. Fetch Reservations for this member
  const resRes = await fetch(
    `${SUPABASE_URL}/rest/v1/Reservation?memberId=eq.${m.id}&select=id,status,queuePosition,reservedAt,expiresAt,Book(id,title,isbn)&order=reservedAt.desc`,
    { headers: getHeaders() }
  );
  const reservationsData = resRes.ok ? await resRes.json() : [];

  // 4. Fetch Fee Charges for this member
  const chargesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/FeeCharge?memberId=eq.${m.id}&select=id,chargeType,description,amount,paidAmount,balance,status,createdAt&order=createdAt.desc`,
    { headers: getHeaders() }
  );
  const chargesData = chargesRes.ok ? await chargesRes.json() : [];

  const outstandingDues = Array.isArray(chargesData)
    ? chargesData
        .filter((c: any) => ["OUTSTANDING", "PARTIALLY_PAID"].includes(c.status))
        .reduce((sum: number, c: any) => sum + (c.balance || 0), 0)
    : 0;

  const mappedLoans = Array.isArray(loansData)
    ? loansData.map((l: any) => {
        const copy = l.BookCopy || {};
        const book = copy.Book || {};
        const authors =
          Array.isArray(book.authors)
            ? book.authors.map((ba: any) => ba.Author?.name).filter(Boolean).join(", ")
            : "Library Collection";

        return {
          id: l.id,
          copyId: copy.id || "",
          memberId: m.id,
          issuedAt: l.issuedAt,
          dueDate: l.dueDate,
          returnedAt: l.returnedAt,
          renewalCount: l.renewalCount || 0,
          status: l.status,
          issuedBy: "Circulation Desk",
          returnedBy: null,
          createdAt: l.issuedAt,
          updatedAt: l.dueDate,
          copy: {
            id: copy.id || "",
            bookId: book.id || "",
            accessionNo: copy.accessionNo || "ACC-STACK",
            copyNumber: 1,
            qrCodeToken: copy.accessionNo || "",
            shelfLocation: copy.shelfLocation || "Main Stacks",
            acquisitionDate: l.issuedAt,
            acquisitionCost: 250,
            condition: "GOOD",
            status: copy.status || "ISSUED",
            book: {
              id: book.id || "",
              isbn: book.isbn || "",
              title: book.title || "Library Book",
              authors,
              publicationYear: 2026,
              language: "Hindi/English",
              ddcCode: "000",
              bookNumber: "STACK-1",
              description: "",
            },
          },
        };
      })
    : [];

  const mappedReservations = Array.isArray(reservationsData)
    ? reservationsData.map((r: any) => ({
        id: r.id,
        bookId: r.Book?.id || "",
        memberId: m.id,
        queuePosition: r.queuePosition || 1,
        status: r.status,
        reservedAt: r.reservedAt,
        expiresAt: r.expiresAt || undefined,
        bookTitle: r.Book?.title || "Reserved Title",
      }))
    : [];

  return {
    id: m.id,
    memberNo: m.memberNo,
    fullName: m.fullName,
    email: m.email,
    phone: m.phone || "N/A",
    address: m.address || "District Registered Citizen",
    category: m.category,
    status: m.status,
    registrationDate: m.registrationDate,
    expiryDate: m.expiryDate,
    maxBooks: m.maxBooks || 3,
    activeLoansCount: mappedLoans.filter((l: any) => l.status === "ACTIVE").length,
    overdueLoansCount: mappedLoans.filter(
      (l: any) => l.status === "ACTIVE" && new Date(l.dueDate) < new Date()
    ).length,
    totalOutstandingDues: Number(outstandingDues.toFixed(2)),
    loans: mappedLoans,
    reservations: mappedReservations,
    feeCharges: Array.isArray(chargesData) ? chargesData : [],
    payments: [],
    receipts: [],
    createdAt: m.registrationDate || new Date().toISOString(),
    updatedAt: m.expiryDate || new Date().toISOString(),
  };
}
