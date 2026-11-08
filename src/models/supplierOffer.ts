import { Schema, model, models } from "mongoose";

const supplierOfferSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    supplier: { type: String, required: true, index: true },
    supplierProductId: { type: String, required: true },
    supplierOfferId: { type: String },

    costPrice: { type: Number, required: true, min: 0 }, // em cêntimos
    currency: { type: String, required: true, uppercase: true, default: "EUR" },

    availableQuantity: { type: Number, min: 0 },

    status: {
      type: String,
      enum: ["available", "unavailable", "unknown"],
      default: "unknown",
      index: true,
    },

    lastSyncedAt: { type: Date },
  },
  { timestamps: true },
);

supplierOfferSchema.index(
  { supplier: 1, supplierProductId: 1, supplierOfferId: 1 },
  { unique: true },
);

export const SupplierOfferModel =
  models.SupplierOffer ?? model("SupplierOffer", supplierOfferSchema);