import { NextFunction, Request, Response } from "express";
import {
  getDailyStatisticsView as getDailyStatistics,
  getRawData,
} from "../services/statisticsService";
import { dailyElectricityStatistics, electricitydata } from "@prisma/client";
import {
  DailyElectricityData,
  ElectricityData,
} from "../types/electricityData";
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

export const getRawDataTemp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = {
      pageStart: parseInt(req.query.pageStart as string),
      pageSize: parseInt(req.query.pageSize as string),
      filters: parseFilters<electricitydata>(req.query.filters as string),
      sorting: parseSorting<electricitydata>(req.query.sorting as string),
    };

    const { data, totalRowCount } = await getRawData(queryParams);
    const response: ElectricityData = {
      data: data,
      meta: {
        totalRowCount,
      },
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
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
    const queryParams = parsedQueryParams<dailyElectricityStatistics>(req);
    const { data, totalRowCount } = await getDailyStatistics(queryParams);
    const response: DailyElectricityData = {
      data,
      meta: {
        totalRowCount,
      },
    };
    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
