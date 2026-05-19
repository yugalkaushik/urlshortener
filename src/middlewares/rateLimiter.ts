import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { ENV } from "../config/env";

export const createUrlLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many URLs created from this IP. Please try again later.",
  },
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
});

export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests.",
  },
});