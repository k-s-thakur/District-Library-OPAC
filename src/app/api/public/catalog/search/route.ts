import { NextRequest, NextResponse } from "next/server";
import { fetchCatalogBooks } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "relevance";
    const available = searchParams.get("available") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));

    const result = await fetchCatalogBooks({
      query: q,
      category,
      available,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Search API route error:", err);
    return NextResponse.json({ error: err.message || "Failed to search catalogue" }, { status: 500 });
  }
}
