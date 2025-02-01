import { electricitydata, Prisma, PrismaClient } from "@prisma/client";
import { FlatFilter, QueryParams } from "../controllers/statisticsController";

const prisma = new PrismaClient();

const buildWhereClause = (
  filters: FlatFilter
): Prisma.electricitydataWhereInput => {
  // TODO UTC handling

  const whereClause: Prisma.electricitydataWhereInput = {
    date: filters?.date
      ? {
          gte: filters.date[0] ? new Date(filters.date[0]) : undefined,
          lte: filters.date[1] ? new Date(filters.date[1]) : undefined,
        }
      : undefined,
    starttime: filters?.starttime
      ? {
          gte: filters.starttime[0]
            ? new Date(filters.starttime[0])
            : undefined,
          lte: filters.starttime[1]
            ? new Date(filters.starttime[1])
            : undefined,
        }
      : undefined,
    productionamount: filters?.productionamount
      ? {
          gte: filters.productionamount[0]
            ? parseFloat(filters.productionamount[0])
            : undefined,
          lte: filters.productionamount[1]
            ? parseFloat(filters.productionamount[1])
            : undefined,
        }
      : undefined,
    consumptionamount: filters?.consumptionamount
      ? {
          gte: filters.consumptionamount[0]
            ? parseFloat(filters.consumptionamount[0])
            : undefined,
          lte: filters.consumptionamount[1]
            ? parseFloat(filters.consumptionamount[1])
            : undefined,
        }
      : undefined,
    hourlyprice: filters?.hourlyprice
      ? {
          gte: filters.hourlyprice[0]
            ? parseFloat(filters.hourlyprice[0])
            : undefined,
          lte: filters.hourlyprice[1]
            ? parseFloat(filters.hourlyprice[1])
            : undefined,
        }
      : undefined,

    id: filters?.id
      ? {
          gte: filters.id[0] ? parseInt(filters.id[0]) ?? undefined : undefined,
          lte: filters.id[1] ? parseInt(filters.id[1]) ?? undefined : undefined,
        }
      : undefined,
  };

  return whereClause;
};
export const getRawData = async (
  queryParams: QueryParams
): Promise<electricitydata[]> => {
  return await prisma.electricitydata.findMany({
    where: buildWhereClause(queryParams.filters),
  });
};

export async function getTest() {
  const result = await prisma.$queryRaw`
    SELECT * FROM electricitydata
    WHERE NOT productionamount < 7554
  `;

  return result;
}

export const getDailyStatistics = async () => {
  // get data
  // do calucations
  // Total electricity consumption per day
  // Total electricity production per day
  // Average electricity price per day
  // Longest consecutive time in hours, when electricity price has been negative, per day
  // return data

  // data should be in format that there is a way that dates are unique, and then we have the values for that date.
  return await prisma.electricitydata.findMany();
};

export const getStatisticsByDate = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
