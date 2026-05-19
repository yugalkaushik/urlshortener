import { Request, Response, NextFunction } from "express";
import { createShortUrl, resolveShortUrl, deactivateUrl } from "../services/url.service";
import { getAnalytics, recordClick } from "../services/analytics.service";

export async function shortenUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { url, customCode, ttlSeconds } = req.body;

    if (!url || typeof url !== "string") {
      res.status(400).json({ success: false, error: "url is required." });
      return;
    }

    const result = await createShortUrl({
      originalUrl: url.trim(),
      customCode: customCode?.trim(),
      ttlSeconds: ttlSeconds ? parseInt(ttlSeconds, 10) : undefined,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function redirectToOriginal(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params as { code: string };
    const urlDoc = await resolveShortUrl(code);

    recordClick({
      shortCode: code,
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
      referrer: req.headers["referer"] ?? "direct",
    }).catch(console.error);

    res.set("Cache-Control", "no-store");
    res.redirect(302, urlDoc.originalUrl);
  } catch (err) {
    next(err);
  }
}

export async function getUrlAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params as { code: string };
    const data = await getAnalytics(code);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params as { code: string };
    await deactivateUrl(code);
    res.json({ success: true, message: "Link deactivated." });
  } catch (err) {
    next(err);
  }
}