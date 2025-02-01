import { NextFunction, Request, Response } from "express";
import {
  getDailyStatsService,
  getStatsByDateService,
} from "../services/statsService";
import { electricitydata } from "@prisma/client";
import { ElectricityDataDTO } from "../models/dataTransferObjects";

export type FlatFilter = {
  [key in keyof electricitydata]: (string | null)[];
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

const exampleQuery = {
  start: "0",
  size: "10",
  filters:
    '[{"id":"id","value":[null,"12"]},{"id":"date","value":["2025-02-18T22:00:00.000Z",null]},{"id":"starttime","value":["2025-02-01T02:00:00.000Z","2025-02-01T01:00:00.000Z"]},{"id":"productionamount","value":["1","9"]},{"id":"consumptionamount","value":["1",null]},{"id":"hourlyprice","value":[null,null]}]',
  globalFilter: "",
  sorting: "[]",
};

/**
 * convert id:s to key of electricitydata
 */
const handleParseFilters = (filters: string) => {
  if (!filters) {
    return {} as FlatFilter;
  }
  const parsedFilters: FlatFilter = JSON.parse(filters).reduce(
    (acc: FlatFilter, filter: { id: string; value: (string | null)[] }) => {
      acc[filter.id as keyof electricitydata] = filter.value;
      return acc;
    }
  );

  return parsedFilters;
};

export const getDailyStats = async (
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

    const stats: electricitydata[] = await getDailyStatsService(queryParams);
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

export const getStatsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  const stats = await getStatsByDateService(date);
  res.json(stats);
};
