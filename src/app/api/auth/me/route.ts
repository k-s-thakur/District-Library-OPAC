import { NextRequest, NextResponse } from "next/server";
import { authenticateMember } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("library_session");

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const rawVal = sessionCookie.value;

    // Try decoding JSON user payload
    try {
      const decoded = decodeURIComponent(rawVal);
      const parsed = JSON.parse(decoded);
      if (parsed && (parsed.id || parsed.role)) {
        return NextResponse.json({ user: parsed });
      }
    } catch {}

    // Fallback: look up member by value
    const member = await authenticateMember(rawVal);
    if (member) {
      return NextResponse.json({ user: member });
    }

    return NextResponse.json({ user: null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
