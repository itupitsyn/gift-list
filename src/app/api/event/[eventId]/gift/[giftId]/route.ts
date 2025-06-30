import { NextResponse } from 'next/server';
import { bookGift } from '../../../../../../../prisma/model/gift';

type RouteParams = { params: Promise<{ eventId: string; giftId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { eventId, giftId } = await params;
  const body = await request.json();
  try {
    const gift = await bookGift(eventId, Number(giftId), body.booked);
    return new NextResponse(JSON.stringify(gift));
  } catch {
    return new NextResponse('', { status: 404 });
  }
}
