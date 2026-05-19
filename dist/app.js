"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const web_1 = __importDefault(require("./routes/web"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
const publicDir = path_1.default.resolve(__dirname, "../public");
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https:'],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https:'],
            fontSrc: ["'self'", 'https:', '*.vercel-storage.com'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
        },
    },
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(publicDir));
app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/", web_1.default);
app.use("/", url_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
