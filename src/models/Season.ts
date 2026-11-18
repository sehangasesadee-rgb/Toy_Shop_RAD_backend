import mongoose, { Schema, Document } from "mongoose";

interface ISeason extends Document {
  name: string;
  description: string;
  bannerImage: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const seasonSchema = new Schema<ISeason>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    bannerImage: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Season = mongoose.model<ISeason>("Season", seasonSchema);

export default Season;
