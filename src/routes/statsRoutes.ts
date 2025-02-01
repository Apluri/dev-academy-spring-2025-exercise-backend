import { Router } from "express";
import { getDailyStats, getStatsByDate } from "../controllers/statsController";

const router = Router();

router.get("/", getDailyStats);
router.get("/:date", getStatsByDate);

export default router;
