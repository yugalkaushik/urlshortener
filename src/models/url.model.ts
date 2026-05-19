import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
  isActive: boolean;
}

const urlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, default: null },
    clickCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UrlModel = mongoose.model<IUrl>("Url", urlSchema);