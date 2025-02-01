import { Router } from "express";
import { getConsumptionVsProduction } from "../controllers/consumptionController";

const router = Router();

router.get("/", getConsumptionVsProduction);

export default router;
