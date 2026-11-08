import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    platform: { type: String, required: true },

    genre: {
      type: String,
      enum: [
        "Action",
        "Adventure",
        "RPG",
        "Racing",
        "Simulation",
        "Sports",
        "Strategy",
        "Other",
      ],
      default: "Other",
    },

    region: { type: String, required: true },
    excludedCountries: { type: [String], default: [] },
    type: { type: String, required: true },

    salePrice: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ status: 1, genre: 1, platform: 1, salePrice: 1 });
productSchema.index({ name: "text" });

export const ProductModel =
  models.Product ?? model("Product", productSchema);