"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortUrl = createShortUrl;
exports.resolveShortUrl = resolveShortUrl;
exports.deactivateUrl = deactivateUrl;
const url_model_1 = require("../models/url.model");
const db_1 = require("../config/db");
const generateCode_1 = require("../utils/generateCode");
const validateUrl_1 = require("../utils/validateUrl");
const env_1 = require("../config/env");
async function createShortUrl(options) {
    await (0, db_1.connectDB)();
    const { originalUrl, customCode, ttlSeconds } = options;
    if (!(0, validateUrl_1.isValidUrl)(originalUrl)) {
        throw new Error("INVALID_URL");
    }
    if (originalUrl.startsWith(env_1.ENV.BASE_URL)) {
        throw new Error("LOOP_DETECTED");
    }
    let shortCode = customCode || (0, generateCode_1.generateShortCode)();
    if (customCode) {
        const existing = await url_model_1.UrlModel.findOne({ shortCode: customCode });
        if (existing)
            throw new Error("CODE_TAKEN");
    }
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : undefined;
    const urlDoc = await url_model_1.UrlModel.create({
        originalUrl,
        shortCode,
        ...(expiresAt ? { expiresAt } : {}),
    });
    return {
        shortUrl: `${env_1.ENV.BASE_URL}/${urlDoc.shortCode}`,
        shortCode: urlDoc.shortCode,
        originalUrl: urlDoc.originalUrl,
        expiresAt: urlDoc.expiresAt ?? null,
    };
}
async function resolveShortUrl(shortCode) {
    await (0, db_1.connectDB)();
    const urlDoc = await url_model_1.UrlModel.findOne({ shortCode, isActive: true });
    if (!urlDoc)
        throw new Error("NOT_FOUND");
    if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
        throw new Error("EXPIRED");
    }
    await url_model_1.UrlModel.updateOne({ _id: urlDoc._id }, { $inc: { clickCount: 1 } });
    return urlDoc;
}
async function deactivateUrl(shortCode) {
    await (0, db_1.connectDB)();
    const result = await url_model_1.UrlModel.updateOne({ shortCode }, { isActive: false });
    if (result.matchedCount === 0)
        throw new Error("NOT_FOUND");
}
