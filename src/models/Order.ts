import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface IOrder extends Document {
  customerName: string;
  userId: Types.ObjectId;
  phone: string;
  address: string;
  items: IOrderItem[];
  totalPrice: number;
  orderStatus: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
