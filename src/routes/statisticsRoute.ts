import { Router } from "express";
import {
  getRawDataTemp,
  handleGetDailyStatisticsView,
} from "../controllers/statisticsController";

const router = Router();

router.get("/raw", getRawDataTemp); // TODO: remove this route
// router.get("/daily", handleGetDailyStatistics);
router.get("/daily", handleGetDailyStatisticsView);

export default router;
