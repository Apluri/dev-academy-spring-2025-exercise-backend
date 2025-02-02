import { NextFunction, Request, Response } from "express";
import {
  getDailyStatistics,
  getRawData,
  getStatisticsByDate,
  getTest,
} from "../services/statisticsService";
import { electricitydata } from "@prisma/client";
import {
  DailyElectricityDataDTO,
  ElectricityDataDTO,
} from "../models/dataTransferObjects";

export type FlatFilter = {
  [key in keyof electricitydata]?: (string | null)[];
};

export type Sorting = {
  id: keyof electricitydata;
  desc: boolean;
};
export type FlatSorting = {
  [key in keyof electricitydata]?: "asc" | "desc";
};

export type QueryParams = {
  pageStart: number;
  pageSize: number;
  filters: FlatFilter;
  sorting: FlatSorting[];
};

// TODO check if some libraries can be used to parse params automatically
const handleParseFilters = (filters: string) => {
  const flatFilters: FlatFilter = {};
  if (filters === undefined) return flatFilters;
  JSON.parse(filters).forEach(
    (filter: { id: keyof electricitydata; value: (string | null)[] }) => {
      const key = filter.id;
      const value = filter.value;
      flatFilters[key] = value;
    }
  );

  return flatFilters;
};

// TODO can this be done in a better way?
const handleParseSorting = (sorting: string) => {
  const flatSorting: FlatSorting[] = [];
  if (sorting === undefined) return flatSorting;

  JSON.parse(sorting).forEach(
    (sort: { id: keyof electricitydata; desc: boolean }) => {
      flatSorting.push({
        [sort.id]: sort.desc ? "desc" : "asc",
      });
    }
  );
  return flatSorting;
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
      filters: handleParseFilters(req.query.filters as string),
      sorting: handleParseSorting(req.query.sorting as string),
    };

    const { data, totalRowCount } = await getRawData(queryParams);
    const response: ElectricityDataDTO = {
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

export const handleGetDailyStatistics = async (req: Request, res: Response) => {
  const queryParams = {
    pageStart: parseInt(req.query.pageStart as string),
    pageSize: parseInt(req.query.pageSize as string),
    filters: handleParseFilters(req.query.filters as string),
    sorting: handleParseSorting(req.query.sorting as string),
  };
  const { paginatedData: data, totalRowCount } = await getDailyStatistics(
    queryParams
  );
  const response: DailyElectricityDataDTO = {
    data,
    meta: {
      totalRowCount,
    },
  };

  res.json(response);
};

export const getDailyStatisticsByDate = async (req: Request, res: Response) => {
  // TODO implement this function to get daily statistics but only for a specific date
  // return object should match getDailyStatistics
  throw new Error("Not implemented");
  const { date } = req.params;
  const stats = await getStatisticsByDate(date);
  res.json(stats);
};

// TODO  - remove this route
export const test = async (req: Request, res: Response) => {
  const result = await getTest();
  res.json(result);
};
