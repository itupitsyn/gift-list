import { NextResponse } from 'next/server';
import { getEvent } from '../../../../../prisma/model/event';
import type * as PrismaTypes from '@prisma/client';
import prisma from '../../../../../prisma/db';

type RouteParams = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteParams) {
  const event = await getEvent(params.id);

  if (!event.isPrivate) {
    return new NextResponse('', { status: 403 });
  }

  const body = await request.formData();
  const data: PrismaTypes.Prisma.EventUpdateInput = {};

  const name = body.get('name') as string;
  if (name) data.name = name;

  const description = body.get('description') as string;
  if (description) data.description = description;

  const updatedEvent = await prisma.event.update({ where: { privateId: params.id }, data });

  const gifts: PrismaTypes.Prisma.GiftUpdateInput[] = [];

  for (let i = 0; body.get(`gifts[${i}].name`); i += 1) {
    const newGift: PrismaTypes.Prisma.GiftUpdateInput = {};

    // const id = body.get(`gifts[${i}].id`) as string;
    // if (id) newGift.id = id;

    const name = body.get(`gifts[${i}].name`) as string;
    if (name) newGift.name = name;

    const link = body.get(`gifts[${i}].link`) as string;
    if (link) newGift.link = link;

    const price = body.get(`gifts[${i}].price`);
    if (price) newGift.price = Number(price);

    const booked = body.get(`gifts[${i}].booked`) as string;
    if (booked) newGift.booked = booked === 'true';

    gifts.push(newGift);
  }

  return new NextResponse(JSON.stringify(updatedEvent));
}
