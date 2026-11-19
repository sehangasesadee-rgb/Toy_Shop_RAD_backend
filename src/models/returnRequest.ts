import mongoose, { Schema, Document, Types } from "mongoose";

interface IReturnRequest extends Document {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  reason: string;
  details: string;
  image?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const ReturnRequest =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>("ReturnRequest", returnRequestSchema);

export default ReturnRequest;
