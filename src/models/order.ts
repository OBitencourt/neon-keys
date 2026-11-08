import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },

    name: { type: String, required: true },
    image: { type: String, default: "" },
    platform: { type: String, required: true },

    quantity: { type: Number, required: true, min: 1 },
    unitSalePrice: { type: Number, required: true, min: 0 },
    unitCostPrice: { type: Number, required: true, min: 0 },

    supplier: { type: String, required: true },
    supplierProductId: { type: String, required: true },
    supplierOfferId: { type: String },

    // Guardar CIFRADAS
    keys: {
      type: [
        {
          value: { type: String, required: true },
          revealedAt: { type: Date, default: null },
        },
      ],
      default: [],
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "A encomenda precisa de ter pelo menos um item.",
      },
    },

    currency: { type: String, required: true, uppercase: true, default: "EUR" },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    fulfillmentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    stripePaymentIntentId: { type: String, unique: true, sparse: true },

    supplierOrderIds: {
      type: [
        {
          supplier: { type: String, required: true },
          orderId: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const OrderModel = models.Order ?? model("Order", orderSchema);