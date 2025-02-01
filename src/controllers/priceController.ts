import { Request, Response } from "express";
import { getNegativePricePeriodsService } from "../services/priceService";

export const getNegativePricePeriods = async (req: Request, res: Response) => {
  const periods = await getNegativePricePeriodsService();
  res.json(periods);
};
