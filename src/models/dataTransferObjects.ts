import { electricitydata } from "@prisma/client";
import { MetaData } from "./metaData";

export type ElectricityDataDTO = {
  data: electricitydata[];
  meta: MetaData;
};
