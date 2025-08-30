import type * as PrismaTypes from '@prisma/client';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

import prisma from '../../../../../prisma/db';
import { getEvent } from '../../../../../prisma/model/event';

type RouteParams = { params: Promise<{ eventId: string }> };

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
  isCreation: boolean,
  existedImages: PrismaTypes.Image[] | undefined,
) => {
  const name = body.get(`gifts[${idx}].name`) as string;
  if (name) gift.name = name;
  const link = body.get(`gifts[${idx}].link`) as string;
  if (link) gift.link = link;
  const price = body.get(`gifts[${idx}].price`);
  if (price) gift.price = Number(price);
  const booked = body.get(`gifts[${idx}].booked`) as string;
  gift.booked = booked === 'true';

  const imagesToSave: File[] = [];
  const idsToDelete = existedImages?.map((item) => item.id) || [];

  for (let i = 0; i < 10000; i += 1) {
    const img = body.get(`gifts[${idx}].images[${i}]`) as File | string;
    if (!img) break;

    if (typeof img === 'string') {
      const foundIdx = idsToDelete.findIndex((item) => item === Number(img));
      if (foundIdx >= 0) {
        idsToDelete.splice(foundIdx, 1);
      }
    } else {
      imagesToSave.push(img);
    }
  }

  if (imagesToSave.length || idsToDelete.length) {
    const fileNames = await Promise.all(imagesToSave.map(saveImage));
    if (isCreation) {
      gift.images = {
        createMany: {
          data: fileNames.map((fileName) => ({ fileName })),
        },
      };
    } else {
      gift.images = {
        createMany: {
          data: fileNames.map((fileName) => ({ fileName })),
        },
        deleteMany: {
          id: {
            in: idsToDelete,
          },
        },
      };
    }
  }
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

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

    const existedGift = event.event.gifts.find((item) => item.id === Number(id));

    if (id) {
      const newGift: PrismaTypes.Prisma.GiftUpdateInput = {};
      await fillGiftItem(body, i, newGift, false, existedGift?.images);
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
      await fillGiftItem(body, i, newGift, true, existedGift?.images);
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
    where: { privateId: eventId },
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
