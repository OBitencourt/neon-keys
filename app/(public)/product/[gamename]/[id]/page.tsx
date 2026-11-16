import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/src/lib/services/products";
import {
  formatPrice,
  getDiscountPercent,
} from "@/src/utils/priceFunctions";
import AddToCartButton from "@/src/components/addToCartButton";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const discount = getDiscountPercent(
    product.price,
    product.originalPrice,
  );

  return (
    <div className="bg-black min-h-screen text-neon-white pb-20">
      <div className="max-w-350 mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <div className="text-sm text-neon-gray/70 mb-8 flex items-center gap-2">
          <span>Home</span>
          &gt;
          <span>Shop</span>
          &gt;
          <span>{product.genre}</span>
          &gt;
          <span className="text-neon-white font-medium truncate">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-start">
          {/* Imagens */}
          <div className="lg:col-span-4 flex flex-col gap-3 lg:gap-4">
            <div className="relative w-full aspect-4/3 sm:aspect-4/5 rounded-2xl p-[1.5px] bg-neon-gradient shadow-[0_0_30px_rgba(249,11,163,0.15)]">
              <div className="relative w-full h-full rounded-[15px] bg-zinc-950">
                {discount !== null && (
                  <span className="bg-neon-gradient text-neon-white absolute -top-2 font-gabarito -left-6 z-10 rounded-full px-3 py-1 text-base sm:text-lg tracking-wider font-bold">
                    -{discount}%
                  </span>
                )}

                <Image
                  src={
                    product.image ||
                    "/crimson-desert-placeholder.jpg"
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Imagens adicionais vindas do MongoDB */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="relative hidden sm:flex items-center gap-2 p-[1.5px] rounded-2xl bg-neon-gradient">
                <div className="w-full bg-black rounded-[15px] p-2.5 flex items-center gap-2.5 overflow-x-auto">
                  {product.gallery.map((url: string) => (
                    <div
                      key={url}
                      className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border border-zinc-800"
                    >
                      <Image
                        src={url}
                        alt={`Additional image of ${product.name}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:gap-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-gabarito font-regular text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-neon-pink font-semibold text-sm sm:text-base -mt-1 sm:-mt-2">
                {product.region}
              </p>

              {/* Avaliações */}
              {product.reviewsCount > 0 && (
                <div className="flex items-center gap-2 text-neon-pink">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Image
                        key={star}
                        src="/gradient-star.svg"
                        alt="Star"
                        width={30}
                        height={30}
                        className="sm:w-6 sm:h-6"
                      />
                    ))}
                  </div>

                  <span className="text-white text-sm sm:text-md">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Preço */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-1">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-neon-gray text-lg sm:text-xl tracking-tight font-medium line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}

                <span className="relative text-4xl sm:text-5xl font-bold tracking-tighter bg-neon-gradient bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(249,11,163,0.6)]">
                  {formatPrice(product.price)}
                </span>
              </div>

              {discount !== null && (
                <div className="sm:px-0.5 py-0.5 rounded-full sm:bg-neon-gradient font-medium text-sm sm:text-md self-start sm:self-auto">
                  <div className="flex items-center gap-1 py-1.5 px-3 sm:py-1.5 sm:bg-black rounded-full text-neon-gray">
                    You save{" "}
                    <span className="text-neon-pink font-semibold">
                      {formatPrice(
                        product.originalPrice! - product.price,
                      )}{" "}
                      ({discount}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantidade e estoque */}
            <div className="flex items-center justify-between md:justify-start gap-3 sm:gap-4">
              <div className="flex bg-neon-gradient p-0.5 items-center rounded-lg overflow-hidden">
                <div className="bg-zinc-950 rounded-md">
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 rounded-tl-sm rounded-bl-sm border-transparent border-r text-zinc-400 opacity-50"
                  >
                    -
                  </button>

                  <span className="px-4 py-1.5 text-white font-semibold text-sm">
                    1
                  </span>

                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 rounded-tr-sm rounded-br-sm border-transparent border-l text-zinc-400 opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-zinc-400 text-xs w-40 sm:text-sm">
                {product.stockStatus}
              </span>
            </div>

            {/* Carrinho e favoritos */}
            <div className="flex gap-3 sm:gap-4">
              <AddToCartButton product={product} />

              <button
                type="button"
                className="p-4 sm:p-5 rounded-xl border border-neon-pink/40 bg-zinc-950 text-neon-pink hover:bg-neon-pink/10 hover:text-white transition-all"
              >
                <Image
                  src="/gradient-heart.svg"
                  alt="Add to Wishlist"
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                />
              </button>
            </div>

            {/* Entrega digital */}
            <div className="bg-neon-gradient p-[1.5px] rounded-xl shadow-[0_0_15px_rgba(249,11,163,0.2)]">
              <div className="relative bg-black rounded-[10.5px] p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <span
                  className="absolute inset-0 bg-neon-gradient opacity-20 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                <Image
                  src="/raio-icon.svg"
                  alt="Instant Delivery"
                  width={20}
                  height={20}
                  className="relative z-10 shrink-0 sm:w-6 sm:h-6"
                />

                <div className="relative z-10">
                  <p className="text-[#EA0058] font-medium text-sm sm:text-base">
                    Digital Delivery
                  </p>

                  <p className="text-white text-xs sm:text-sm">
                    Your key will be delivered after payment
                    confirmation and order processing.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-500 text-sm text-center font-regular">
              Express Checkout ⓘ
            </p>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Sobre o jogo */}
          <div className="p-[1.5px] rounded-2xl bg-neon-pink/90 order-2 lg:order-none">
            <div className="bg-black rounded-[14.5px] p-6 h-full">
              <h2 className="text-white font-bold text-lg pb-3">
                About this game
              </h2>

              <div className="h-0.5 bg-linear-to-r from-neon-pink/90 via-neon-pink/90 to-black w-20 md:w-50 rounded-full mb-4" />

              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Região e informações */}
          <div className="flex flex-col gap-8 order-1 lg:order-none">
            <div className="p-[1.5px] rounded-2xl bg-neon-pink/90">
              <div className="bg-black rounded-[14.5px] p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Image
                    src="/gradient-region.svg"
                    alt="Region"
                    width={30}
                    height={30}
                    className="mb-2"
                  />

                  <span className="-mt-2">
                    List of allowed countries for this
                    product version:
                  </span>
                </h2>

                <div className="grid grid-cols-2 gap-3 text-zinc-300 text-sm">
                  {product.allowedCountries.map((country: string) => (
                    <div
                      key={country}
                      className="flex items-center gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-neon-green text-[#71B433] text-xs flex items-center justify-center font-bold">
                        ✓
                      </span>

                      <span>{country}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-[1.5px] rounded-2xl bg-neon-pink/90">
              <div className="bg-black rounded-[14.5px] p-6">
                <h2 className="text-white font-bold text-lg mb-2">
                  Important information
                </h2>

                <p className="text-zinc-400 text-md leading-relaxed">
                  This product is a digital game key for{" "}
                  {product.platform}. Its activation region is{" "}
                  {product.region}. No physical item will be
                  shipped. Check the activation restrictions
                  before purchasing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}