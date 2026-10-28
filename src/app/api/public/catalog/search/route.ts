import { NextRequest, NextResponse } from "next/server";
import { BOOKS } from "@/data/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "relevance";
  const available = searchParams.get("available") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));

  let results = [...BOOKS];

  if (category) {
    results = results.filter(
      (b) => b.category.code.toUpperCase() === category.toUpperCase()
    );
  }

  if (available) {
    results = results.filter((b) => b.availableCopies > 0);
  }

  if (q) {
    results = results.filter((b) => {
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchSubtitle = b.subtitle?.toLowerCase().includes(q) || false;
      const matchAuthors = b.authors.toLowerCase().includes(q);
      const matchIsbn = b.isbn.includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchPublisher = b.publisher.toLowerCase().includes(q);
      const matchDdc = b.ddcCode.includes(q);
      const matchCategory = b.category.name.toLowerCase().includes(q);

      return (
        matchTitle ||
        matchSubtitle ||
        matchAuthors ||
        matchIsbn ||
        matchDesc ||
        matchPublisher ||
        matchDdc ||
        matchCategory
      );
    });
  }

  // Sorting
  if (sort === "newest") {
    results.sort((a, b) => b.publicationYear - a.publicationYear);
  } else if (sort === "year") {
    results.sort((a, b) => a.publicationYear - b.publicationYear);
  } else if (sort === "title") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Relevance: if search term, prioritize title matches
    if (q) {
      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
        return bTitle - aTitle;
      });
    }
  }

  const total = results.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    items: paginatedItems,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}
