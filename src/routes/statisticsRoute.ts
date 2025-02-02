import { Router } from "express";
import {
  getRawDataTemp,
  handleGetDailyStatistics,
} from "../controllers/statisticsController";

const router = Router();

router.get("/raw", getRawDataTemp); // TODO: remove this route
router.get("/daily", handleGetDailyStatistics);

export default router;
