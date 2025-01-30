import { NextFunction, Request, Response } from "express";
import {
  getDailyStatsService,
  getStatsByDateService,
} from "../services/statsService";

export const getDailyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getDailyStatsService();
    res.json(stats);
  } catch (e) {
    next(e);
  }
};

export const getStatsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  const stats = await getStatsByDateService(date);
  res.json(stats);
};
