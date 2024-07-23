import { NextResponse } from 'next/server';
import { bookGift } from '../../../../../../../prisma/model/gift';

type RouteParams = { params: { eventId: string; giftId: string } };

export async function PATCH(request: Request, { params }: RouteParams) {
  const body = await request.json();
  try {
    const gift = await bookGift(params.eventId, Number(params.giftId), body.booked);
    return new NextResponse(JSON.stringify(gift));
  } catch {
    return new NextResponse('', { status: 404 });
  }
}
