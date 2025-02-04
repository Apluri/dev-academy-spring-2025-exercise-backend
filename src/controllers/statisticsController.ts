import { Request, Response } from "express";
import { getDailyStatisticsView as getDailyStatistics } from "../services/statisticsService";
import { dailyElectricityStatistics } from "@prisma/client";
import { DailyElectricityData } from "../types/electricityData";
import { QueryFilter, SortCriteria } from "../types/dataQueries";

const parseFilters = <T>(filters: string) => {
  const queryFilters: QueryFilter<T> = {};
  if (filters === undefined) return queryFilters;
  JSON.parse(filters).forEach(
    (filter: { id: keyof T; value: (string | null)[] }) => {
      const key = filter.id;
      const value = filter.value;
      queryFilters[key] = value;
    }
  );

  return queryFilters;
};

const parseSorting = <T>(sorting: string) => {
  const sortCriterias: SortCriteria<T>[] = [];
  if (sorting === undefined) return sortCriterias;

  JSON.parse(sorting).forEach((sort: { id: keyof T; desc: boolean }) => {
    sortCriterias.push({
      [sort.id]: sort.desc ? "desc" : "asc",
    } as SortCriteria<T>);
  });
  return sortCriterias;
};

const parsedQueryParams = <T>(req: Request) => {
  const { pageSize, pageStart, filters, sorting } = req.query;
  return {
    pageStart: pageStart ? parseInt(pageStart as string) : undefined,
    pageSize: pageSize ? parseInt(pageSize as string) : undefined,
    filters: filters ? parseFilters<T>(filters as string) : undefined,
    sorting: sorting ? parseSorting<T>(sorting as string) : undefined,
  };
};

export const handleGetDailyStatistics = async (req: Request, res: Response) => {
  try {
    // Todo validate params and provide proper error response for invalid params
    const queryParams = parsedQueryParams<dailyElectricityStatistics>(req);
    const { data, totalRowCount } = await getDailyStatistics(queryParams);
    const response: DailyElectricityData = {
      data,
      meta: {
        totalRowCount,
      },
    };
    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
