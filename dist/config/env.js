"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing required env var: ${key}`);
    return val;
}
exports.ENV = {
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGO_URI: required("MONGO_URI"),
    BASE_URL: required("BASE_URL"),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "10", 10),
};
