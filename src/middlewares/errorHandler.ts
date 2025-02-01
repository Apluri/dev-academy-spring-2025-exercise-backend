import { Request, Response, NextFunction } from "express";

export const internalServerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO logging?
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};
