import mongoose, { Schema, Document } from "mongoose";

interface IOffer extends Document {
  productId: mongoose.Types.ObjectId;
  seasonId?: mongoose.Types.ObjectId;

  offerType: "DAILY" | "SEASONAL";
  offerPrice: number;
  discountPercent: number;

  campaignName?: string;
  startDate: Date;
  endDate: Date;

  dailyKey?: string;
  isActive: boolean;
}

const offerSchema = new Schema<IOffer>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seasonId: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: false,
    },

    offerType: {
      type: String,
      enum: ["DAILY", "SEASONAL"],
      required: true,
    },

    offerPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },

    campaignName: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    dailyKey: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

offerSchema.index(
  { productId: 1, dailyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      dailyKey: { $type: "string" },
    },
  }
);

const Offer = mongoose.model<IOffer>("Offer", offerSchema);

export default Offer;
