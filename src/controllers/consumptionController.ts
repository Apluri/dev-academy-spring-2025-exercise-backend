import { Request, Response } from "express";
import { getSomething } from "../services/consumptionService";

export const getConsumptionVsProduction = async (
  req: Request,
  res: Response
) => {
  const data = await getSomething();
  res.json(data);
};
