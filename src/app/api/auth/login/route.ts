import { NextRequest, NextResponse } from "next/server";
import { authenticateMember } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let user: any = null;

    if (body.identifier) {
      // Look up real member from Supabase database
      const member = await authenticateMember(body.identifier);
      if (member) {
        user = member;
      } else {
        return NextResponse.json(
          { error: `Member "${body.identifier}" not found in library register. Please check your Member ID or register.` },
          { status: 404 }
        );
      }
    } else if (body.role) {
      // Quick sign-in support
      if (body.role === "MEMBER") {
        const defaultMember = await authenticateMember("GPL-2026-00001");
        user = defaultMember || {
          id: "bd8a3fd9-8065-4240-8272-0eabea1324b9",
          memberNo: "GPL-2026-00001",
          fullName: "Rahul Verma",
          email: "rahul.verma@student.delhiuniv.ac.in",
          role: "MEMBER",
        };
      } else {
        user = {
          id: "staff-1",
          fullName: body.role === "SUPER_ADMIN" ? "Khagendra Singh (Admin)" : "Library Staff",
          role: body.role,
        };
      }
    } else {
      return NextResponse.json(
        { error: "Invalid credentials or Member ID required." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Store user JSON in cookie for session persistence (7 days)
    response.cookies.set("library_session", encodeURIComponent(JSON.stringify(user)), {
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
