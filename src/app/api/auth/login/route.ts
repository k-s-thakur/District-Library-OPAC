import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/data/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let user = null;

    if (body.role && DEMO_USERS[body.role]) {
      user = DEMO_USERS[body.role];
    } else if (body.identifier) {
      const id = body.identifier.toLowerCase();
      if (id.includes("librarian") || id.includes("patel")) {
        user = DEMO_USERS.LIBRARIAN;
      } else if (id.includes("accounts") || id.includes("agarwal")) {
        user = DEMO_USERS.ACCOUNTS_OPERATOR;
      } else if (id.includes("admin") || id.includes("thakur")) {
        user = DEMO_USERS.SUPER_ADMIN;
      } else {
        // Default citizen member (Rahul Verma)
        user = DEMO_USERS.MEMBER;
      }
    } else {
      return NextResponse.json(
        { error: "Invalid credentials or role specified." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set cookie for session persistence (7 days)
    response.cookies.set("library_session", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Login failed." },
      { status: 500 }
    );
  }
}
