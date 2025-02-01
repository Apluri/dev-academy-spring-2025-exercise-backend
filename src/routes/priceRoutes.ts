import { Router } from "express";
import { getNegativePricePeriods } from "../controllers/priceController";

const router = Router();

router.get("/negative", getNegativePricePeriods);

export default router;
