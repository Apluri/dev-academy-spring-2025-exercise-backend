import {
  dailyElectricityStatistics,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { QueryFilter, QueryParams } from "../types/dataQueries";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_START = 0;
export const prisma = new PrismaClient();

const createWhereClause = (
  filters?: QueryFilter<dailyElectricityStatistics>
) => {
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
      skip: queryParams.pageStart || DEFAULT_PAGE_START,
      take: queryParams.pageSize || DEFAULT_PAGE_SIZE,
      orderBy: queryParams.sorting,
      where: createWhereClause(queryParams.filters),
    }),

    prisma.dailyElectricityStatistics.count({
      where: createWhereClause(queryParams.filters),
    }),
  ]);

  return { data, totalRowCount };
};
