import { NextResponse } from 'next/server';
import { getEvent } from '../../../../../prisma/model/event';
import type * as PrismaTypes from '@prisma/client';
import prisma from '../../../../../prisma/db';
import fs from 'fs';
import path from 'path';

type RouteParams = { params: { eventId: string } };

const saveImage = async (file: File) => {
  const fnParts = file.name.split('.');
  const extension = fnParts[fnParts.length - 1];

  const fileName = `${Math.random().toString(32).replace('.', '')}.${extension}`;
  const buffer = await file.arrayBuffer();
  const filePath = path.join(process.env.PATH_TO_FILES || '', fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer));

  return fileName;
};

const fillGiftItem = async (
  body: FormData,
  idx: number,
  gift: PrismaTypes.Prisma.GiftCreateInput | PrismaTypes.Prisma.GiftUpdateInput,
) => {
  const name = body.get(`gifts[${idx}].name`) as string;
  if (name) gift.name = name;
  const link = body.get(`gifts[${idx}].link`) as string;
  if (link) gift.link = link;
  const price = body.get(`gifts[${idx}].price`);
  if (price) gift.price = Number(price);
  const booked = body.get(`gifts[${idx}].booked`) as string;
  gift.booked = booked === 'true';

  const img = body.get(`gifts[${idx}].image`) as File;
  if (img && typeof img !== 'string') {
    const fileName = await saveImage(img);
    gift.images = {
      create: {
        fileName,
      },
      deleteMany: {
        NOT: {
          fileName,
        },
      },
    };
  }
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const event = await getEvent(params.eventId);

  if (!event.event) {
    return new NextResponse('', { status: 404 });
  }

  if (!event.isPrivate) {
    return new NextResponse('', { status: 403 });
  }

  const body = await request.formData();
  const data: PrismaTypes.Prisma.EventUpdateInput = {};

  const name = body.get('name') as string;
  if (name) data.name = name;

  const description = body.get('description') as string;
  if (description) data.description = description;

  const date = body.get('date') as string;
  if (date) data.date = new Date(date);

  const idsToDelete = event.event.gifts.map((item) => item.id);

  const prms: Promise<unknown>[] = [];

  for (let i = 0; body.get(`gifts[${i}].name`); i += 1) {
    const id = body.get(`gifts[${i}].id`) as string;
    const foundIdx = idsToDelete.indexOf(Number(id));
    if (foundIdx >= 0) {
      idsToDelete.splice(foundIdx, 1);
    }

    if (id) {
      const newGift: PrismaTypes.Prisma.GiftUpdateInput = {};
      await fillGiftItem(body, i, newGift);
      prms.push(
        prisma.gift.update({
          data: newGift,
          where: { id: Number(id) },
        }),
      );
    } else {
      const newGift: PrismaTypes.Prisma.GiftCreateInput = {
        name: '',
        event: {
          connect: {
            id: event.event.id,
          },
        },
      };
      await fillGiftItem(body, i, newGift);
      prms.push(
        prisma.gift.create({
          data: newGift,
        }),
      );
    }
  }

  if (idsToDelete.length) {
    prms.push(
      prisma.gift.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      }),
    );
  }

  await Promise.all(prms);

  const updatedEvent = await prisma.event.update({
    where: { privateId: params.eventId },
    data,
    include: {
      gifts: {
        orderBy: {
          id: 'desc',
        },
        include: {
          images: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify(updatedEvent));
}
