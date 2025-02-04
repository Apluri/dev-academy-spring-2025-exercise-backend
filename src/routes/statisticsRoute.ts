import { Router } from "express";
import { handleGetDailyStatistics } from "../controllers/statisticsController";

const router = Router();

router.get("/daily", handleGetDailyStatistics);

export default router;
