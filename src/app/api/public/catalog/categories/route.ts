import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/supabase";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ categories });
  } catch (err: any) {
    console.error("Categories API route error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch categories" }, { status: 500 });
  }
}
