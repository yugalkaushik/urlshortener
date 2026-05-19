"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordClick = recordClick;
exports.getAnalytics = getAnalytics;
const analytics_model_1 = require("../models/analytics.model");
const url_model_1 = require("../models/url.model");
const db_1 = require("../config/db");
async function recordClick(meta) {
    await (0, db_1.connectDB)();
    await analytics_model_1.AnalyticsModel.create(meta);
}
async function getAnalytics(shortCode) {
    await (0, db_1.connectDB)();
    const urlDoc = await url_model_1.UrlModel.findOne({ shortCode });
    if (!urlDoc)
        throw new Error("NOT_FOUND");
    const clicks = await analytics_model_1.AnalyticsModel.find({ shortCode })
        .sort({ clickedAt: -1 })
        .limit(100);
    const clicksByDay = {};
    for (const c of clicks) {
        const day = c.clickedAt.toISOString().slice(0, 10);
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
    }
    const referrerMap = {};
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
