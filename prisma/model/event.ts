import type * as prismaTypes from '@prisma/client';
import prisma from '../db';

const getId = () => {
  let result = '';
  for (let i = 0; i < 11; i += 1) {
    result += Math.random().toString(32);
  }

  return result.replaceAll('.', '').slice(0, 128);
};

export const createEvent = async () => {
  const newEvent: prismaTypes.Prisma.EventCreateInput = {
    name: '',
    ownerContact: '',
    privateId: getId(),
    publicId: getId(),
  };

  const result = await prisma.event.create({ data: newEvent });

  return result;
};

export const getEvent = async (id: string) => {
  const [byPrivate, byPublic] = await Promise.all([
    prisma.event.findFirst({
      where: {
        privateId: id,
      },
    }),
    prisma.event.findFirst({
      where: {
        publicId: id,
      },
    }),
  ]);

  if (byPublic) {
    byPublic.privateId = '';
  }

  return byPrivate ? { isPrivate: true, event: byPrivate } : { isPrivate: false, event: byPublic };
};
