import { electricitydata } from "@prisma/client";
import { MetaData } from "./metaData";

export type ElectricityDataDTO = {
  data: electricitydata[];
  meta: MetaData;
};

export type DailyElectricityDataDTO = {
  data: DailyElectricityData[];
  meta: MetaData;
};

// TODO not dto should be in a separate file
export type DailyElectricityData = {
  date: Date | null;
  totalConsumption: number;
  totalProduction: number;
  averagePrice: number;
  longestNegativePriceStreak: number;
};
