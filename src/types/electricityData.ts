import { dailyElectricityStatistics, electricitydata } from "@prisma/client";
import { MetaData } from "./dataQueries";

export type ElectricityData = {
  data: electricitydata[];
  meta: MetaData;
};

export type DailyElectricityData = {
  data: dailyElectricityStatistics[];
  meta: MetaData;
};
