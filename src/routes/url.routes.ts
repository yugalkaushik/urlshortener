import { Router } from "express";
import {
  shortenUrl,
  redirectToOriginal,
  getUrlAnalytics,
  deleteUrl,
} from "../controllers/url.controller";
import { createUrlLimiter, redirectLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/api/shorten", createUrlLimiter, shortenUrl);

router.get("/api/analytics/:code", getUrlAnalytics);

router.delete("/api/urls/:code", deleteUrl);

router.get("/:code", redirectLimiter, redirectToOriginal);

export default router;