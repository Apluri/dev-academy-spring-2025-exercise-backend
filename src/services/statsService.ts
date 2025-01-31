import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDailyStatsService = async () => {
  return await prisma.electricitydata.findMany();
};

export const getStatsByDateService = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
