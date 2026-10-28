import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({ categories: CATEGORIES });
}
