import { Request, Response } from "express";
import {
  getDailyStatsService,
  getStatsByDateService,
} from "../services/statsService";

export const getDailyStats = async (req: Request, res: Response) => {
  const stats = await getDailyStatsService();
  res.json(stats);
};

export const getStatsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  const stats = await getStatsByDateService(date);
  res.json(stats);
};
