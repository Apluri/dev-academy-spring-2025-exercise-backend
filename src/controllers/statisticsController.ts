import { NextFunction, Request, Response } from "express";
import { getDailyStatistics, getRawData } from "../services/statisticsService";
import { electricitydata } from "@prisma/client";
import {
  DailyElectricityData,
  DailyElectricityDataDTO,
  ElectricityDataDTO,
} from "../models/dataTransferObjects";

export type FlatFilter<T> = {
  [key in keyof T]?: (string | null)[];
};

export type Sorting<T> = {
  id: keyof T;
  desc: boolean;
};
export type FlatSorting<T> = {
  [key in keyof T]?: "asc" | "desc";
};

export type QueryParams<T> = {
  pageStart: number;
  pageSize: number;
  filters: FlatFilter<T>;
  sorting: FlatSorting<T>[];
};

// TODO check if some libraries can be used to parse params automatically
const handleParseFilters = <T>(filters: string) => {
  const flatFilters: FlatFilter<T> = {};
  if (filters === undefined) return flatFilters;
  JSON.parse(filters).forEach(
    (filter: { id: keyof T; value: (string | null)[] }) => {
      const key = filter.id;
      const value = filter.value;
      flatFilters[key] = value;
    }
  );

  return flatFilters;
};

// TODO can this be done in a better way?
const handleParseSorting = <T>(sorting: string) => {
  const flatSorting: FlatSorting<T>[] = [];
  if (sorting === undefined) return flatSorting;

  JSON.parse(sorting).forEach((sort: { id: keyof T; desc: boolean }) => {
    flatSorting.push({
      [sort.id]: sort.desc ? "desc" : "asc",
    } as FlatSorting<T>);
  });
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
      filters: handleParseFilters<electricitydata>(req.query.filters as string),
      sorting: handleParseSorting<electricitydata>(req.query.sorting as string),
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
    filters: handleParseFilters<DailyElectricityData>(
      req.query.filters as string
    ),
    sorting: handleParseSorting<DailyElectricityData>(
      req.query.sorting as string
    ),
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
