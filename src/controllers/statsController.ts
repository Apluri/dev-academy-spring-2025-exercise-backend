import { NextFunction, Request, Response } from "express";
import {
  getDailyStatsService,
  getStatsByDateService,
} from "../services/statsService";
import { electricitydata } from "@prisma/client";
import { ElectricityDataDTO } from "../models/dataTransferObjects";

export const getDailyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats: electricitydata[] = await getDailyStatsService();
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
