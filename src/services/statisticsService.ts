import { electricitydata, Prisma, PrismaClient } from "@prisma/client";
import { FlatFilter, QueryParams } from "../controllers/statisticsController";
import { DailyElectricityData } from "../models/dataTransferObjects";

const prisma = new PrismaClient();

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

export async function getTest() {
  const result = await prisma.$queryRaw`
    SELECT * FROM electricitydata
    WHERE NOT productionamount < 7554
  `;

  return result;
}

export const getDailyStatistics = async (
  queryParams: QueryParams<DailyElectricityData>
) => {
  const allData = await prisma.electricitydata.findMany();

  const dataMap = new Map<
    string,
    {
      totalConsumption: number;
      totalProduction: number;
      totalPrice: number;
      priceCount: number;
      longestNegativePriceStreak: number;
      currentNegativePriceStreak: number;
    }
  >();

  allData.forEach((record) => {
    const date = record.date;
    if (!date) return;
    const dateStr = date.toISOString().split("T")[0]; // we only need the date part for the key
    // init only if the date is not in the map
    if (!dataMap.has(dateStr)) {
      dataMap.set(dateStr, {
        totalConsumption: 0,
        totalProduction: 0,
        totalPrice: 0,
        priceCount: 0,
        longestNegativePriceStreak: 0,
        currentNegativePriceStreak: 0,
      });
    }

    const dailyData = dataMap.get(dateStr)!;

    dailyData.totalConsumption += Number(record.consumptionamount);
    dailyData.totalProduction += Number(record.productionamount);
    dailyData.totalPrice += Number(record.hourlyprice);
    dailyData.priceCount++; // we need to count the number of prices to calculate the average

    // Calculate longest negative price streak
    if (Number(record.hourlyprice) < 0) {
      dailyData.currentNegativePriceStreak += 1;
      if (
        dailyData.currentNegativePriceStreak >
        dailyData.longestNegativePriceStreak
      ) {
        dailyData.longestNegativePriceStreak =
          dailyData.currentNegativePriceStreak;
      }
    } else {
      dailyData.currentNegativePriceStreak = 0;
    }
  });

  const data: DailyElectricityData[] = Array.from(dataMap.entries()).map(
    ([date, stats]) => ({
      date: new Date(date),
      totalConsumption: stats.totalConsumption,
      totalProduction: stats.totalProduction,
      averagePrice: stats.totalPrice / stats.priceCount,
      longestNegativePriceStreak: stats.longestNegativePriceStreak,
    })
  );

  // TODO use the sorting parameter to sort the data
  data.sort((a, b) => a.date.getTime() - b.date.getTime());
  const totalRowCount = data.length;

  const paginatedData = data.slice(
    queryParams.pageStart,
    Math.min(queryParams.pageStart + queryParams.pageSize, totalRowCount)
  );

  return { paginatedData, totalRowCount };
};

export const getStatisticsByDate = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
