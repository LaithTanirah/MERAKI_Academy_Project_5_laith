import { Router } from "express";
import {
  getDashboardSummary,
  getOrdersPerStatus,
  getSalesOverWeek,
} from "../controllers/dashboard";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/orders-status", getOrdersPerStatus);
router.get("/weekly-sales", getSalesOverWeek);

export default router;
