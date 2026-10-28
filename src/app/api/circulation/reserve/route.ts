import { NextRequest, NextResponse } from "next/server";
import { addReservation, DEMO_USERS } from "@/data/mockData";

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("library_session");
  
  if (!sessionCookie || sessionCookie.value.toUpperCase() !== "MEMBER") {
    return NextResponse.json(
      { error: "Please sign in as a registered library member to reserve this title." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const bookId = body.bookId;

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required for reservation." },
        { status: 400 }
      );
    }

    const member = DEMO_USERS.MEMBER;
    const reservation = addReservation(bookId, member.id);

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      queuePosition: reservation.queuePosition,
      message: `Reservation confirmed! You are position #${reservation.queuePosition} in queue.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Reservation request could not be processed." },
      { status: 500 }
    );
  }
}
