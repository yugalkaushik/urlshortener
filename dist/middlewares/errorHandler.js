"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errorMap = {
    INVALID_URL: { status: 400, message: "The URL provided is invalid." },
    LOOP_DETECTED: { status: 400, message: "Cannot shorten a URL that points to this service." },
    CODE_TAKEN: { status: 409, message: "That custom code is already taken." },
    NOT_FOUND: { status: 404, message: "Short URL not found." },
    EXPIRED: { status: 410, message: "This link has expired." },
};
function errorHandler(err, _req, res, _next) {
    const mapped = errorMap[err.message];
    if (mapped) {
        res.status(mapped.status).json({ success: false, error: mapped.message });
        return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error." });
}
