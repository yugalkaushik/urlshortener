import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import webRoutes from "./routes/web";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const publicDir = path.resolve(__dirname, "../public");

app.use(
  helmet({
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
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", webRoutes);
app.use("/", urlRoutes);

app.use(errorHandler);

export default app;