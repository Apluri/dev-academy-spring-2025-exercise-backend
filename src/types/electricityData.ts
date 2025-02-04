import { dailyElectricityStatistics } from "@prisma/client";
import { MetaData } from "./dataQueries";

export type DailyElectricityData = {
  data: dailyElectricityStatistics[];
  meta: MetaData;
};
