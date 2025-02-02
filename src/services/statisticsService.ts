import { electricitydata, Prisma, PrismaClient } from "@prisma/client";
import { FlatFilter, QueryParams } from "../controllers/statisticsController";
import { DailyElectricityData } from "../models/dataTransferObjects";

const FILTER_ARRAY_LENGTH = 2;

export const prisma = new PrismaClient();

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

// TODO Check that calculations are correct
export const getDailyStatistics2 = async (
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

  const filteredData: DailyElectricityData[] = Array.from(dataMap.entries())
    .map(([date, stats]) => ({
      date: new Date(date),
      totalConsumption: stats.totalConsumption,
      totalProduction: stats.totalProduction,
      averagePrice: stats.totalPrice / stats.priceCount,
      longestNegativePriceStreak: stats.longestNegativePriceStreak,
    }))
    .filter((item) => {
      return Object.entries(queryParams.filters).every(([key, range]) => {
        const field = key as keyof DailyElectricityData;
        if (!range || range.length !== FILTER_ARRAY_LENGTH) return true; // Ignore invalid filters

        const [min, max] = range;

        const value = item[field];

        // Ensure correct type comparison for numbers and dates
        if (typeof value === "number") {
          if (min !== null && value < Number(min)) return false;
          if (max !== null && value > Number(max)) return false;
        } else if (value instanceof Date) {
          if (min !== null && value < new Date(min)) return false;
          if (max !== null && value > new Date(max)) return false;
        }
        // Add string and other comparison here if needed

        return true; // Include item if it passes all filters
      });
    });

  /*
  // Use the sorting parameter to sort the data
  if (queryParams.sorting.length > 0) {
    filteredData.sort((a, b) => {
      for (const sortObj of queryParams.sorting) {
        const sortField = Object.keys(sortObj)[0] as keyof DailyElectricityData;
        const order = sortObj[sortField];

        const fieldA = a[sortField];
        const fieldB = b[sortField];

        if (fieldA < fieldB) return order === "asc" ? -1 : 1;
        if (fieldA > fieldB) return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
    */

  const totalRowCount = filteredData.length;

  const paginatedData = filteredData.slice(
    queryParams.pageStart,
    Math.min(queryParams.pageStart + queryParams.pageSize, totalRowCount)
  );

  return { paginatedData, totalRowCount };
};

export const getDailyStatisticsTemp = async (
  queryParams: QueryParams<DailyElectricityData>
) => {
  console.log("pagi", queryParams.pageSize, queryParams.pageStart);
  const results = await prisma.$transaction([
    prisma.electricitydata.groupBy({
      by: ["date"], // Group by date
      _sum: {
        productionamount: true,
        consumptionamount: true,
      },
      _avg: {
        hourlyprice: true,
      },
      // TODO change sort object to match new sorting type
      orderBy: {
        date: "asc",
      },
      skip: queryParams.pageStart, // TODO ADD PAGI
      take: queryParams.pageSize,
    }),
    prisma.electricitydata.findMany({
      where: {
        date: {
          not: null,
        },
      },
      distinct: ["date"],
    }),
  ]);
  const aggregatedData = results[0];
  // Step 2: Fetch hourly prices separately to calculate the longest negative period
  const dates = aggregatedData.map((d) => d.date).filter((d) => d !== null);
  const hourlyData = await prisma.electricitydata.findMany({
    where: { date: { in: dates } },
    orderBy: [{ date: "asc" }, { starttime: "asc" }],
  });

  // Step 3: Calculate longest negative streak per day
  const longestNegativeStreaks = new Map<string, number>();

  for (const date of dates) {
    const prices = hourlyData
      .filter((d) => d.date?.toDateString() === date.toDateString())
      .map((d) => Number(d.hourlyprice));
    let maxStreak = 0;
    let currentStreak = 0;

    for (const price of prices) {
      if (price < 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    longestNegativeStreaks.set(date.toDateString(), maxStreak);
  }

  const result: DailyElectricityData[] = aggregatedData.map((d) => ({
    date: d.date,
    totalProduction: Number(d._sum?.productionamount),
    totalConsumption: Number(d._sum?.consumptionamount),
    averagePrice: Number(d._avg?.hourlyprice),
    longestNegativePriceStreak: d.date
      ? longestNegativeStreaks.get(d.date?.toDateString()) ?? 0
      : 0,
  }));

  return { result, totalRowCount: results[1].length };
};

export const getStatisticsByDate = async (date: string) => {
  return await prisma.electricitydata.findMany({
    where: { date },
  });
};
