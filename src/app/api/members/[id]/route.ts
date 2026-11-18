import { NextRequest, NextResponse } from "next/server";
import { fetchMemberProfile } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionCookie = request.cookies.get("library_session");

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const member = await fetchMemberProfile(id);

    if (!member) {
      return NextResponse.json({ error: "Member not found in library register." }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch member details" }, { status: 500 });
  }
}
