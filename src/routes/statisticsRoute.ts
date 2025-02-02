import { Router } from "express";
import {
  getRawDataTemp,
  handleGetDailyStatistics,
  handleGetDailyStatisticsNew,
} from "../controllers/statisticsController";

const router = Router();

router.get("/raw", getRawDataTemp); // TODO: remove this route
// router.get("/daily", handleGetDailyStatistics);
router.get("/daily", handleGetDailyStatisticsNew);

export default router;
