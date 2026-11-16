import { Schema, model, models } from "mongoose";

const productKeySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // Chave criptografada
    encryptedKey: {
      type: String,
      required: true,
      select: false,
    },

    // Identificador HMAC para evitar duplicações
    fingerprint: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "available",
        "reserved",
        "delivered",
        "disabled",
      ],
      default: "available",
      index: true,
    },

    // Identifica a unidade reservada num pedido
    reservationItemId: {
      type: String,
    },

    reservationSource: {
      type: String,
      enum: ["neonkeys", "eneba"],
    },

    reservedAt: {
      type: Date,
      default: null,
    },

    reservationExpiresAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

productKeySchema.index({
  productId: 1,
  status: 1,
});

productKeySchema.index(
  { reservationItemId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reservationItemId: { $type: "string" },
    },
  },
);

export const ProductKeyModel =
  models.ProductKey ??
  model("ProductKey", productKeySchema);