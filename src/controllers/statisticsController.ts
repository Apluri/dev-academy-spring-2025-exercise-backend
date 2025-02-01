import { NextFunction, Request, Response } from "express";
import {
  getRawData,
  getStatisticsByDate,
  getTest,
} from "../services/statisticsService";
import { electricitydata } from "@prisma/client";
import { ElectricityDataDTO } from "../models/dataTransferObjects";

export type FlatFilter = {
  [key in keyof electricitydata]?: (string | null)[];
};

export type Sorting = {
  id: keyof electricitydata;
  desc: boolean;
};

export type QueryParams = {
  start: number;
  size: number;
  filters: FlatFilter;
  globalFilter: string;
  sorting: Sorting[];
};

// TODO check if some libraries can be used to parse params automatically
const handleParseFilters = (filters: string) => {
  const flatFilters: FlatFilter = {};
  JSON.parse(filters).forEach(
    (filter: { id: keyof electricitydata; value: (string | null)[] }) => {
      const key = filter.id;
      const value = filter.value;
      flatFilters[key] = value;
    }
  );

  return flatFilters;
};

export const getRawDataTemp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = {
      start: parseInt(req.query.start as string),
      size: parseInt(req.query.size as string),
      filters: handleParseFilters(req.query.filters as string),
      globalFilter: req.query.globalFilter as string,
      sorting: JSON.parse(req.query.sorting as string) as Sorting[],
    };

    const stats: electricitydata[] = await getRawData(queryParams);
    const response: ElectricityDataDTO = {
      data: stats,
      // TODO - implement pagination
      meta: {
        page: 0,
        perPage: 0,
        totalPages: 0,
        totalRowCount: 100,
      },
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};

export const getDailyStatistics = async (req: Request, res: Response) => {
  const stats = await getTest();
  res.json(stats);
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
