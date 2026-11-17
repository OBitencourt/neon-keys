import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: {
      type: String,
      default: "",
    },

    heroImage: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },
    
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
    regionPreset: { type: String, default: "GLOBAL" },
    includedCountries: { type: [String], default: [] },
    excludedCountries: { type: [String], default: [] },
    allowedCountries: { type: [String], default: [] },

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
    // Origem do cadastro
    source: {
      type: String,
      enum: ["manual", "supplier"],
      default: "supplier",
      index: true,
    },

    // Steam - usado para obter imagens
    steamAppId: {
      type: Number,
      min: 1,
      default: null,
    },

    // Dados para publicação na Eneba
    eneba: {
      productId: {
        type: String,
        default: null,
      },

      auctionId: {
        type: String,
        default: null,
      },

      syncEnabled: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: ["unpublished", "pending", "published", "failed"],
        default: "unpublished",
      },

      lastSyncedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

productSchema.index({ status: 1, genre: 1, platform: 1, salePrice: 1 });
productSchema.index({ name: "text" });

export const ProductModel = models.Product ?? model("Product", productSchema);
