import prisma from '../db';

export const getGifts = async (eventId: number) => {
  const data = await prisma.gift.findMany({ where: { eventId } });

  return data;
};
