import { AnalyticsModel } from "../models/analytics.model";
import { UrlModel } from "../models/url.model";
import { connectDB } from "../config/db";

interface ClickMeta {
  shortCode: string;
  ip: string;
  userAgent: string;
  referrer: string;
}

export async function recordClick(meta: ClickMeta): Promise<void> {
  await connectDB();

  await AnalyticsModel.create(meta);
}

export async function getAnalytics(shortCode: string) {
  await connectDB();

  const urlDoc = await UrlModel.findOne({ shortCode });
  if (!urlDoc) throw new Error("NOT_FOUND");

  const clicks = await AnalyticsModel.find({ shortCode })
    .sort({ clickedAt: -1 })
    .limit(100);

  const clicksByDay: Record<string, number> = {};
  for (const c of clicks) {
    const day = c.clickedAt.toISOString().slice(0, 10);
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  }

  const referrerMap: Record<string, number> = {};
  for (const c of clicks) {
    referrerMap[c.referrer] = (referrerMap[c.referrer] || 0) + 1;
  }

  return {
    shortCode,
    originalUrl: urlDoc.originalUrl,
    totalClicks: urlDoc.clickCount,
    isActive: urlDoc.isActive,
    expiresAt: urlDoc.expiresAt,
    createdAt: urlDoc.createdAt,
    clicksByDay,
    topReferrers: referrerMap,
    recentClicks: clicks.slice(0, 10),
  };
}