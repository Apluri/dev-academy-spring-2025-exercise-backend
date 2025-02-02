import { Router } from "express";
import {
  getRawDataTemp,
  handleGetDailyStatistics,
  test,
} from "../controllers/statisticsController";

const router = Router();

router.get("/raw", getRawDataTemp); // TODO: remove this route
router.get("/daily", handleGetDailyStatistics);
router.get("/daily/:date", test);

export default router;
