import {
  dailyElectricityStatistics,
  electricitydata,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { FlatFilter, QueryParams } from "../controllers/statisticsController";

export const prisma = new PrismaClient();

// TODO remove
const buildWhereClause = (
  filters: FlatFilter<electricitydata>
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

// TODO remove
export const getRawData = async (
  queryParams: QueryParams<electricitydata>
): Promise<{ data: electricitydata[]; totalRowCount: number }> => {
  const whereClause = buildWhereClause(queryParams.filters);
  const [data, totalRowCount] = await Promise.all([
    prisma.electricitydata.findMany({
      skip: queryParams.pageStart,
      take: queryParams.pageSize,
      where: whereClause,
      orderBy: queryParams.sorting,
    }),
    prisma.electricitydata.count({
      where: whereClause,
    }),
  ]);

  return { data, totalRowCount: totalRowCount };
};

const createWhereClause = (filters: FlatFilter<dailyElectricityStatistics>) => {
  const whereClause: Prisma.dailyElectricityStatisticsWhereInput = {};

  if (filters?.totalConsumption) {
    const [min, max] = filters.totalConsumption;
    whereClause.totalConsumption = {
      gte: min ? parseFloat(min) : undefined,
      lte: max ? parseFloat(max) : undefined,
    };
  }

  if (filters?.totalProduction) {
    const [min, max] = filters.totalProduction;
    whereClause.totalProduction = {
      gte: min ? parseFloat(min) : undefined,
      lte: max ? parseFloat(max) : undefined,
    };
  }

  if (filters?.averagePrice) {
    const [min, max] = filters.averagePrice;
    whereClause.averagePrice = {
      gte: min ? parseFloat(min) : undefined,
      lte: max ? parseFloat(max) : undefined,
    };
  }

  if (filters?.date) {
    const [min, max] = filters.date;
    whereClause.date = {
      gte: min ? new Date(min) : undefined,
      lte: max ? new Date(max) : undefined,
    };
  }

  if (filters?.longestNegativePriceStreak) {
    const [min, max] = filters.longestNegativePriceStreak;
    whereClause.longestNegativePriceStreak = {
      gte: min ? parseInt(min) : undefined,
      lte: max ? parseInt(max) : undefined,
    };
  }

  return whereClause;
};

export const getDailyStatisticsView = async (
  queryParams: QueryParams<dailyElectricityStatistics>
) => {
  const [data, totalRowCount] = await Promise.all([
    await prisma.dailyElectricityStatistics.findMany({
      skip: queryParams.pageStart,
      take: queryParams.pageSize,
      orderBy: queryParams.sorting,
      where: createWhereClause(queryParams.filters),
    }),

    prisma.dailyElectricityStatistics.count({
      where: createWhereClause(queryParams.filters),
    }),
  ]);

  return { data, totalRowCount };
};
