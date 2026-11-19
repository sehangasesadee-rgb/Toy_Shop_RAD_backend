import mongoose, { Schema, Document, Types } from "mongoose";

interface IPayment extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  paymentMethod: "CASH_ON_DELIVERY" | "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  bankSlip?: string;
  verifiedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH_ON_DELIVERY", "BANK_TRANSFER"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    bankSlip: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
