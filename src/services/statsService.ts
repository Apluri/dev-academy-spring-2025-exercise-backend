import { electricitydata, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDailyStatsService = async (): Promise<electricitydata[]> => {
  return await prisma.electricitydata.findMany();
};

export const getStatsByDateService = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
