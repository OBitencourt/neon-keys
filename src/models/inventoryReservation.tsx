import { Schema, model, models } from "mongoose";

const inventoryReservationSchema = new Schema(
  {
    source: {
      type: String,
      enum: ["neonkeys", "eneba"],
      required: true,
    },

    // Identificador estável do item/pedido na plataforma
    referenceId: {
      type: String,
      required: true,
      trim: true,
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
      validate: Number.isInteger,
    },

    // IDs das chaves associadas à reserva
    keyIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductKey",
      },
    ],

    status: {
      type: String,
      enum: ["reserved", "delivered", "released"],
      default: "reserved",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    releasedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// O mesmo pedido não pode gerar duas reservas distintas.
inventoryReservationSchema.index(
  {
    source: 1,
    referenceId: 1,
  },
  {
    unique: true,
  },
);

inventoryReservationSchema.index({
  status: 1,
  expiresAt: 1,
});

export const InventoryReservationModel =
  models.InventoryReservation ??
  model("InventoryReservation", inventoryReservationSchema);