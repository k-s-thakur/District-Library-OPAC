import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/mockData";

export async function GET() {
  const adminUrl = process.env.ADMIN_PORTAL_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${adminUrl}/api/public/catalog/categories`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // Admin portal not reachable or timed out, fallback to mock data
  }

  return NextResponse.json({ categories: CATEGORIES });
}

