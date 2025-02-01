import { electricitydata, Prisma, PrismaClient } from "@prisma/client";
import {
  FlatFilter,
  FlatSorting,
  QueryParams,
} from "../controllers/statisticsController";

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

const buildGlobalFilter = (
  globalFilter: string
): Prisma.electricitydataWhereInput => {
  const globalFilfters: Prisma.electricitydataWhereInput = {
    ...getNumericGlobalFilter(globalFilter),
  };

  return globalFilfters;
};

const getNumericGlobalFilter = (
  globalFilter: string
): Prisma.electricitydataWhereInput => {
  const globalFilterNumber = parseInt(globalFilter);
  if (isNaN(globalFilterNumber)) {
    return {};
  }
  const whereClauseNumeric: Prisma.electricitydataWhereInput = {
    OR: [
      {
        productionamount: {
          equals: globalFilterNumber,
        },
      },
      {
        consumptionamount: {
          equals: globalFilterNumber,
        },
      },
      {
        hourlyprice: {
          equals: globalFilterNumber,
        },
      },
      {
        id: {
          equals: globalFilterNumber,
        },
      },
    ],
  };
  return whereClauseNumeric;
};
export const getRawData = async (
  queryParams: QueryParams
): Promise<{ data: electricitydata[]; totalRowCount: number }> => {
  const whereClause = buildWhereClause(queryParams.filters);
  console.log("global", queryParams.globalFilter);
  const [data, totalRowCount] = await Promise.all([
    prisma.electricitydata.findMany({
      skip: queryParams.pageStart,
      take: queryParams.pageSize,
      where: { ...whereClause, ...buildGlobalFilter(queryParams.globalFilter) },
      orderBy: queryParams.sorting,
    }),
    prisma.electricitydata.count({
      where: { ...whereClause, ...buildGlobalFilter(queryParams.globalFilter) },
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
