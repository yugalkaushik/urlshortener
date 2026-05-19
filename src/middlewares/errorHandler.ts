import { Request, Response, NextFunction } from "express";

const errorMap: Record<string, { status: number; message: string }> = {
  INVALID_URL:    { status: 400, message: "The URL provided is invalid." },
  LOOP_DETECTED:  { status: 400, message: "Cannot shorten a URL that points to this service." },
  CODE_TAKEN:     { status: 409, message: "That custom code is already taken." },
  NOT_FOUND:      { status: 404, message: "Short URL not found." },
  EXPIRED:        { status: 410, message: "This link has expired." },
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const mapped = errorMap[err.message];
  if (mapped) {
    res.status(mapped.status).json({ success: false, error: mapped.message });
    return;
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error." });
}