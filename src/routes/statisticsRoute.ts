import { Router } from "express";
import {
  getDailyStatistics,
  getRawDataTemp,
  test,
} from "../controllers/statisticsController";

const router = Router();

router.get("/raw", getRawDataTemp); // TODO: remove this route
router.get("/daily", getDailyStatistics);
router.get("/daily/:date", test);

export default router;
