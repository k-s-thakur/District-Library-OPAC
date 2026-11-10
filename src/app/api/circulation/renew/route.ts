import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { loanId } = body;

    if (!loanId) {
      return NextResponse.json(
        { error: "loanId is required for renewal." },
        { status: 400 }
      );
    }

    // Call Central Admin Portal Circulation Renew API
    const adminUrl = process.env.ADMIN_PORTAL_URL || "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/circulation/renew`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loanId }),
      signal: AbortSignal.timeout(6000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to renew loan in central library system." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Loan successfully renewed for 14 additional calendar days.",
      newDueDate: data.loan?.dueDate,
      renewalCount: data.loan?.renewalCount,
      ...data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Central library circulation service is unreachable." },
      { status: 500 }
    );
  }
}
