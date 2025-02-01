import { electricitydata, Prisma, PrismaClient } from "@prisma/client";
import { FlatFilter, QueryParams } from "../controllers/statsController";

const prisma = new PrismaClient();

export const buildWhereClause = (
  filters: FlatFilter
): Prisma.electricitydataWhereInput => {
  console.log("params", filters);
  // TODO UTC handling
  const whereClause: Prisma.electricitydataWhereInput = {
    date: {
      gte: filters.date[0] ? new Date(filters.date[0]) : undefined,
      lte: filters.date[1] ? new Date(filters.date[1]) : undefined,
    },
    starttime: {
      gte: filters.starttime[0] ? new Date(filters.starttime[0]) : undefined,
      lte: filters.starttime[1] ? new Date(filters.starttime[1]) : undefined,
    },
    productionamount: {
      gte: filters.productionamount[0]
        ? parseFloat(filters.productionamount[0])
        : undefined,
      lte: filters.productionamount[1]
        ? parseFloat(filters.productionamount[1])
        : undefined,
    },
    consumptionamount: {
      gte: filters.consumptionamount[0]
        ? parseFloat(filters.consumptionamount[0])
        : undefined,
      lte: filters.consumptionamount[1]
        ? parseFloat(filters.consumptionamount[1])
        : undefined,
    },
    hourlyprice: {
      gte: filters.hourlyprice[0]
        ? parseFloat(filters.hourlyprice[0])
        : undefined,
      lte: filters.hourlyprice[1]
        ? parseFloat(filters.hourlyprice[1])
        : undefined,
    },
    /*
    id: {
      in: filters.id.filter((id) => id !== null).map((id) => parseInt(id)),
    },*/
  };

  console.log("whereclause", whereClause);
  return whereClause;
};
export const getDailyStatsService = async (
  queryParams: QueryParams
): Promise<electricitydata[]> => {
  return await prisma.electricitydata.findMany({
    where: buildWhereClause(queryParams.filters),
  });
};

export const getStatsByDateService = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
