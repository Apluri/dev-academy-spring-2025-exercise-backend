import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDailyStatsService = async () => {
  throw new Error("Not implemented");
  return await prisma.electricitydata.findMany();
};

export const getStatsByDateService = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
