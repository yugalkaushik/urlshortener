"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrl = shortenUrl;
exports.redirectToOriginal = redirectToOriginal;
exports.getUrlAnalytics = getUrlAnalytics;
exports.deleteUrl = deleteUrl;
const url_service_1 = require("../services/url.service");
const analytics_service_1 = require("../services/analytics.service");
async function shortenUrl(req, res, next) {
    try {
        console.log('shortenUrl called');
        const { url, customCode, ttlSeconds } = req.body;
        if (!url || typeof url !== "string") {
            res.status(400).json({ success: false, error: "url is required." });
            return;
        }
        const result = await (0, url_service_1.createShortUrl)({
            originalUrl: url.trim(),
            customCode: customCode?.trim(),
            ttlSeconds: ttlSeconds ? parseInt(ttlSeconds, 10) : undefined,
        });
        console.log('createShortUrl returned');
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function redirectToOriginal(req, res, next) {
    try {
        const { code } = req.params;
        const urlDoc = await (0, url_service_1.resolveShortUrl)(code);
        (0, analytics_service_1.recordClick)({
            shortCode: code,
            ip: req.ip ?? "unknown",
            userAgent: req.headers["user-agent"] ?? "unknown",
            referrer: req.headers["referer"] ?? "direct",
        }).catch(console.error);
        res.set("Cache-Control", "no-store");
        res.redirect(302, urlDoc.originalUrl);
    }
    catch (err) {
        next(err);
    }
}
async function getUrlAnalytics(req, res, next) {
    try {
        const { code } = req.params;
        const data = await (0, analytics_service_1.getAnalytics)(code);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
async function deleteUrl(req, res, next) {
    try {
        const { code } = req.params;
        await (0, url_service_1.deactivateUrl)(code);
        res.json({ success: true, message: "Link deactivated." });
    }
    catch (err) {
        next(err);
    }
}
