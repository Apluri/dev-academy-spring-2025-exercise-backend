import { Router } from "express";
import {
  getDailyStats,
  getStatsByDate,
  test,
} from "../controllers/statsController";

const router = Router();

router.get("/", getDailyStats);
// router.get("/:date", getStatsByDate);
router.get("/test", test);

export default router;
