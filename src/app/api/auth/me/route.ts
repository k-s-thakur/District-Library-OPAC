import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/data/mockData";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("library_session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const role = sessionCookie.value.toUpperCase();
    const user = DEMO_USERS[role];
    if (user) {
      return NextResponse.json({ user });
    }
    // Also support JSON in cookie
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed && parsed.role && DEMO_USERS[parsed.role]) {
        return NextResponse.json({ user: DEMO_USERS[parsed.role] });
      }
    } catch {}
    
    // Default to Rahul Verma if valid session cookie exists
    return NextResponse.json({ user: DEMO_USERS.MEMBER });
  } catch {
    return NextResponse.json({ user: null });
  }
}
