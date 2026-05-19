import { UrlModel, IUrl } from "../models/url.model";
import { connectDB } from "../config/db";
import { generateShortCode } from "../utils/generateCode";
import { isValidUrl } from "../utils/validateUrl";
import { ENV } from "../config/env";

interface CreateUrlOptions {
  originalUrl: string;
  customCode?: string;
  ttlSeconds?: number;
}

interface CreateUrlResult {
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
  expiresAt: Date | null;
}

export async function createShortUrl(options: CreateUrlOptions): Promise<CreateUrlResult> {
  await connectDB();

  const { originalUrl, customCode, ttlSeconds } = options;

  if (!isValidUrl(originalUrl)) {
    throw new Error("INVALID_URL");
  }

  if (originalUrl.startsWith(ENV.BASE_URL)) {
    throw new Error("LOOP_DETECTED");
  }

  let shortCode = customCode || generateShortCode();

  if (customCode) {
    const existing = await UrlModel.findOne({ shortCode: customCode });
    if (existing) throw new Error("CODE_TAKEN");
  }

  const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : undefined;

  const urlDoc = await UrlModel.create({
    originalUrl,
    shortCode,
    ...(expiresAt ? { expiresAt } : {}),
  });

  return {
    shortUrl: `${ENV.BASE_URL}/${urlDoc.shortCode}`,
    shortCode: urlDoc.shortCode,
    originalUrl: urlDoc.originalUrl,
    expiresAt: urlDoc.expiresAt ?? null,
  };
}

export async function resolveShortUrl(shortCode: string): Promise<IUrl> {
  await connectDB();

  const urlDoc = await UrlModel.findOne({ shortCode, isActive: true });

  if (!urlDoc) throw new Error("NOT_FOUND");

  if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
    throw new Error("EXPIRED");
  }

  await UrlModel.updateOne({ _id: urlDoc._id }, { $inc: { clickCount: 1 } });

  return urlDoc;
}

export async function deactivateUrl(shortCode: string): Promise<void> {
  await connectDB();

  const result = await UrlModel.updateOne({ shortCode }, { isActive: false });
  if (result.matchedCount === 0) throw new Error("NOT_FOUND");
}