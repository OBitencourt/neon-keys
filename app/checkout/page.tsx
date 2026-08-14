"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { initialCartItems } from "../../src/mocks/cartmock";
import type { CartItem } from "../../src/types/cart";
import { formatPrice } from "@/src/utils/priceFunctions";

type PaymentMethod = "card" | "paypal" | "pix";

type BillingInformation = {
  country: string;
  fullName: string;
  postalCode: string;
  address: string;
  city: string;
};

type CheckoutCustomer = {
  email: string;
  billing: BillingInformation;
};

type CheckoutRequest = {
  items: {
    productId: string;
    quantity: number;
  }[];
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
  couponCode?: string;
};

const paymentMethods = [
  {
    id: "card" as const,
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, American Express",
    icon: "/payment-card-placeholder.svg",
  },
  {
    id: "paypal" as const,
    name: "Paypal",
    description: "Pay quickly and securely with Paypal",
    icon: "/paypal-placeholder.svg",
  },
  {
    id: "pix" as const,
    name: "PIX",
    description: "Pay with PIX",
    icon: "/pix-placeholder.svg",
  },
];

export default function CheckoutPage() {
  const [items] = useState<CartItem[]>(initialCartItems);

  const [email, setEmail] = useState("");

  const [billing, setBilling] = useState<BillingInformation>({
    country: "Portugal",
    fullName: "",
    postalCode: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  /*
   * Esses valores são utilizados apenas para exibição.
   *
   * No futuro, o backend deverá recalcular tudo a partir
   * dos product IDs enviados pelo frontend.
   */

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, { product, quantity }) =>
        sum + (product.originalPrice ?? product.price) * quantity,
      0
    );
  }, [items]);

  const total = useMemo(() => {
    return items.reduce(
      (sum, { product, quantity }) =>
        sum + product.price * quantity,
      0
    );
  }, [items]);

  const discount = subtotal - total;

  function updateBilling(
    field: keyof BillingInformation,
    value: string
  ) {
    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) return;

    /*
     * Futuramente:
     *
     * POST /api/checkout/coupon
     *
     * O backend deverá validar o cupom.
     */
    setAppliedCoupon(couponCode.trim());
  }

  async function handleCompletePurchase() {
    if (isProcessing) return;

    setIsProcessing(true);

    const checkoutData: CheckoutRequest = {
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),

      customer: {
        email,
        billing,
      },

      paymentMethod,

      ...(appliedCoupon
        ? {
            couponCode: appliedCoupon,
          }
        : {}),
    };

    console.log("Checkout data:", checkoutData);

    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-8 lg:px-8">
      <div className="max-w-380 mx-auto mb-2 text-sm">
        <div className="flex items-center gap-2 text-neon-gray">
          <Link
            href="/"
            className="hover:text-neon-white transition-colors"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            href="/cart"
            className="hover:text-neon-white transition-colors"
          >
            Cart
          </Link>

          <span>›</span>

          <span className="text-neon-pink">
            Checkout
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-380 mx-auto mb-8">
        <h1 className="text-4xl font-bold text-neon-white">
          CHECKOUT
        </h1>

        <p className="mt-1 text-sm text-neon-gray">
          You're almost done! Please fill in your details and complete your purchase.
        </p>
      </div>

      <div className="max-w-380 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-4">

          <div className="bg-neon-gradient rounded-xl p-[1.5px]">
            <div className="rounded-xl bg-black overflow-hidden">

              <section className="p-5">
                <CheckoutSectionTitle
                  number="1"
                  title="CONTACT INFORMATION"
                />

                <label className="block text-xs text-neon-white mb-1.5">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black border border-neon-gray rounded-lg px-3 py-2.5 text-sm text-neon-white placeholder:text-neon-gray outline-none focus:border-neon-pink transition-colors"
                />

                <p className="mt-1.5 text-[10px] text-neon-gray">
                  Your key will be delivered to this{" "}
                  <span className="text-neon-pink">
                    email address account.
                  </span>
                </p>
              </section>

              <div className="h-px bg-neon-gradient" />

              <section className="p-5">
                <CheckoutSectionTitle
                  number="2"
                  title="BILLING INFORMATION"
                />

                <div className="flex flex-col gap-4">

                  <div>
                    <label className="block text-xs text-neon-white mb-1.5">
                      Country/Region
                    </label>

                    <div className="relative">
                      <select
                        value={billing.country}
                        onChange={(e) =>
                          updateBilling("country", e.target.value)
                        }
                        className="appearance-none w-full bg-black border border-neon-gray rounded-lg px-3 py-2.5 text-sm text-neon-white outline-none focus:border-neon-pink transition-colors"
                      >
                        <option value="Portugal">
                          Portugal
                        </option>

                        <option value="Brazil">
                          Brazil
                        </option>

                        <option value="Spain">
                          Spain
                        </option>
                      </select>

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neon-gray">
                        ˅
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <CheckoutInput
                      label="Full Name"
                      placeholder="Paulo Moises"
                      value={billing.fullName}
                      onChange={(value) =>
                        updateBilling("fullName", value)
                      }
                    />

                    <CheckoutInput
                      label="Postal Code"
                      placeholder="123-456"
                      value={billing.postalCode}
                      onChange={(value) =>
                        updateBilling("postalCode", value)
                      }
                    />

                    <CheckoutInput
                      label="Address"
                      placeholder="Address"
                      value={billing.address}
                      onChange={(value) =>
                        updateBilling("address", value)
                      }
                    />

                    <CheckoutInput
                      label="City"
                      placeholder="City"
                      value={billing.city}
                      onChange={(value) =>
                        updateBilling("city", value)
                      }
                    />

                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-neon-gradient rounded-xl p-[1.5px]">
            <div className="rounded-xl bg-black p-5">

              <CheckoutSectionTitle
                number="3"
                title="PAYMENT METHOD"
              />

              <div className="flex flex-col gap-1.5">
                {paymentMethods.map((method) => {
                  const selected =
                    paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(method.id)
                      }
                      className={`
                        w-full min-h-12
                        flex items-center gap-3
                        rounded-md
                        border
                        px-2.5 py-1.5
                        text-left
                        transition-colors
                        ${
                          selected
                            ? "border-neon-pink"
                            : "border-neon-gray"
                        }
                      `}
                    >
                      <span
                        className={`
                          shrink-0
                          w-4 h-4
                          rounded-full
                          border
                          flex items-center justify-center
                          ${
                            selected
                              ? "border-neon-pink bg-neon-pink"
                              : "border-neon-gray"
                          }
                        `}
                      >
                        {selected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </span>

                      <span className="flex flex-col flex-1">
                        <span className="text-xs font-medium text-neon-white">
                          {method.name}
                        </span>

                        <span className="text-[9px] text-neon-gray">
                          {method.description}
                        </span>
                      </span>

                      <div className="flex items-center justify-center gap-1 shrink-0">
                        <div className="w-16 h-6 rounded bg-neon-gray/20 flex items-center justify-center text-[8px] text-neon-gray">
                          ICON
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-3">
                  {/*
                    FUTURE STRIPE ELEMENT:

                    <PaymentElement />

                    Não criaremos inputs manuais para número,
                    validade ou CVV.

                    O Stripe Elements será responsável por
                    esses dados.
                  */}
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-pink-600"
                />

                <span className="text-[9px] text-neon-gray leading-relaxed">
                  I have read and agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-neon-pink hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-neon-pink hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompletePurchase}
                className="w-full mt-4 bg-neon-gradient text-neon-white font-medium text-sm tracking-wide rounded-md py-3 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <span>
                  {isProcessing
                    ? "PROCESSING..."
                    : "COMPLETE PURCHASE"}
                </span>

                {!isProcessing && (
                  <span className="text-base">
                    ♙
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <aside className="bg-neon-gradient rounded-xl p-[1.5px]">
          <div className="rounded-xl bg-black p-5">

            <h2 className="text-neon-white text-lg font-bold mb-6">
              ORDER SUMMARY
            </h2>

            {/* Products */}
            <div className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3"
                >
                  {/* Image placeholder */}
                  <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-neon-gray/20 border border-neon-gray flex items-center justify-center">
                    <span className="text-[9px] text-neon-gray">
                      IMAGE
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-neon-white truncate">
                        {product.name}
                      </p>

                      <span className="text-sm font-semibold text-neon-white whitespace-nowrap">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-neon-gray font-semibold">
                      Steam Key GLOBAL
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-neon-gray/30 mt-5 pt-4">
              <p className="text-md text-neon-white mb-2">
                Have a coupon code?
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value)
                  }
                  placeholder="Enter a Coupon code..."
                  className="min-w-0 flex-1 bg-black border border-neon-gray rounded-lg px-3 py-2 text-sm text-neon-white placeholder:text-neon-gray outline-none focus:border-neon-pink transition-colors"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-neon-gradient py-0.5 px-1 rounded-md shrink-0"
                >
                  <span className="block bg-black text-neon-white text-xs font-semibold rounded-sm px-4 py-2 hover:bg-neon-white/5 transition-colors">
                    APPLY
                  </span>
                </button>
              </div>

              {appliedCoupon && (
                <p className="text-[10px] text-neon-green mt-2">
                  Coupon applied: {appliedCoupon}
                </p>
              )}
            </div>

            {/* Prices */}
            <div className="border-t border-neon-gray/30 mt-4 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-md text-neon-white">
                <span>Subtotal</span>

                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-md font-medium text-neon-green">
                <span>Discount</span>

                <span>
                  -{formatPrice(discount)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-neon-gray/30 mt-4 pt-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-neon-white">
                Total
              </span>

              <span className="text-2xl font-semibold text-neon-white">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}


/* -------------------------------- */
/* Reusable components              */
/* -------------------------------- */

function CheckoutSectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-5 h-5 shrink-0 rounded-full border border-neon-pink flex items-center justify-center text-xs text-neon-pink font-semibold">
        {number}
      </span>

      <h2 className="text-sm font-bold text-neon-white">
        {title}
      </h2>
    </div>
  );
}


function CheckoutInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-neon-white mb-1.5">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black border border-neon-gray rounded-lg px-3 py-2.5 text-xs text-neon-white placeholder:text-neon-gray outline-none focus:border-neon-pink transition-colors"
      />
    </div>
  );
}