"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = isValidUrl;
function isValidUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    }
    catch {
        return false;
    }
}
