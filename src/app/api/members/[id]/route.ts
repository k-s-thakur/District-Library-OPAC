import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_MEMBER, IN_MEMORY_RESERVATIONS, BOOKS } from "@/data/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionCookie = request.cookies.get("library_session");

  if (!sessionCookie) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  // Clone member data and enrich with any in-memory reservations
  const member = JSON.parse(JSON.stringify(SAMPLE_MEMBER));
  
  // Attach any active reservations made during the session
  const activeReservations = IN_MEMORY_RESERVATIONS.filter(r => r.memberId === id || r.memberId === member.id);
  activeReservations.forEach(r => {
    const book = BOOKS.find(b => b.id === r.bookId);
    member.reservations.push({
      id: r.id,
      bookId: r.bookId,
      queuePosition: r.queuePosition,
      status: r.status,
      reservedAt: r.createdAt,
      bookTitle: book?.title || "Reserved Title",
    });
  });

  return NextResponse.json({ member });
}
