import mongoose, { Document, Schema } from "mongoose";

export interface IAnalytics extends Document {
  shortCode: string;
  ip: string;
  userAgent: string;
  referrer: string;
  clickedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  shortCode: { type: String, required: true, index: true },
  ip: { type: String, default: "unknown" },
  userAgent: { type: String, default: "unknown" },
  referrer: { type: String, default: "direct" },
  clickedAt: { type: Date, default: Date.now },
});

export const AnalyticsModel = mongoose.model<IAnalytics>("Analytics", analyticsSchema);