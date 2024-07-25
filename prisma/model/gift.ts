import prisma from '../db';

export const getGifts = async (eventId: number) => {
  const data = await prisma.gift.findMany({ where: { eventId } });

  return data;
};

export const bookGift = async (eventId: string, giftId: number, booked: boolean) => {
  const data = await prisma.gift.update({
    where: {
      id: giftId,
      event: {
        OR: [{ publicId: eventId }, { privateId: eventId }],
      },
    },
    include: {
      images: true,
    },
    data: {
      booked,
    },
  });

  return data;
};
