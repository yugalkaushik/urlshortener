import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const ENV = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGO_URI: required("MONGO_URI"),
  BASE_URL: required("BASE_URL"),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "10", 10),
};