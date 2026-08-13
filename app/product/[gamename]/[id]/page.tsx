import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProducts } from "../../../../src/utils/mockProducts";
import {
  formatPrice,
  getDiscountPercent,
} from "../../../../src/utils/priceFunctions";
import { Product } from "@/src/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  if (!productId) {
    notFound();
  }
  const product = mockProducts.find((p: Product) => p.id === productId);

  if (!product) {
    notFound();
  }
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="bg-black min-h-screen text-neon-white pb-20">
      <div className="max-w-350 mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <div className="text-sm text-neon-gray/70 mb-8 flex items-center gap-2">
          <span>Home</span> &gt; <span>Shop</span> &gt; <span>Action</span> &gt;{" "}
          <span className="text-neon-white font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative w-full aspect-3/4 rounded-2xl p-[1.5px] bg-neon-gradient shadow-[0_0_30px_rgba(249,11,163,0.15)]">
              <div className="relative w-full h-full rounded-[15px] bg-zinc-950">
                {discount !== null && (
                  <span className="bg-neon-gradient text-neon-white absolute -top-2 font-gabarito -left-6 z-10 rounded-full px-3 py-1 text-lg tracking-wider font-bold">
                    -{discount}%
                  </span>
                )}

                <Image
                  src={product.image || "/crimson-desert-placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="relative flex items-center gap-2 p-[1.5px] rounded-2xl bg-neon-gradient">
              <div className="w-full bg-black rounded-[15px] p-3 flex items-center justify-between gap-2">
                <button className="text-neon-pink text-lg font-bold px-1 hover:scale-110 transition-transform">
                  &lt;
                </button>

                <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        i === 1
                          ? "border-neon-pink "
                          : "border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/gallery-placeholder-${i}.jpg`}
                        alt={`Gallery image ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <button className="text-neon-pink text-lg font-bold px-1 hover:scale-110 transition-transform">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-0.5 py-0.5 rounded-full text-xs  bg-neon-gradient">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-black tracking-wider">
                  <Image
                    src="/gradient-star.svg"
                    alt="Best Seller"
                    width={22}
                    height={22}
                  />
                  <span className=" bg-neon-gradient bg-clip-text text-transparent font-gabarito text-lg">
                    BEST SELLER
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-gabarito md:text-6xl font-regular text-white  leading-tight">
              {product.name}
            </h1>

            <p className="text-neon-pink font-semibold text-base -mt-3">
              {product.region}
            </p>

            {/* Avaliações */}
            <div className="flex items-center gap-2 text-neon-pink">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    key={star}
                    src={
                      star <= product.rating
                        ? "/gradient-star.svg"
                        : "/gradient-star.svg"
                    } // Substituir o da direita por uma estrela vazia futuramente
                    alt="Star"
                    width={30}
                    height={30}
                  />
                ))}
              </div>
              <span className="text-white text-md">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-2">
              {product.originalPrice && (
                <span className="text-neon-gray text-2xl tracking-tight font-medium line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}

              <span className="relative text-4xl md:text-5xl font-bold tracking-tighter bg-neon-gradient bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(249,11,163,0.6)]">
                {formatPrice(product.price)}
              </span>

              {discount !== null && (
                <div className="px-0.5 py-0.5 rounded-full bg-neon-gradient font-medium text-md">
                  <div className="flex items-center gap-1 py-2 px-3 bg-black rounded-full text-neon-gray">
                    You save{" "}
                    <span className="text-neon-pink">
                      {formatPrice(product.originalPrice! - product.price)} (
                      {discount}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-neon-gradient p-[1.5px] rounded-xl shadow-[0_0_15px_rgba(249,11,163,0.2)]">
              <div className=" relative bg-black rounded-[10.5px] p-6 flex items-center gap-4">
                <span
                  className="absolute inset-0 bg-neon-gradient opacity-20 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                <Image
                  src="/raio-icon.svg"
                  alt="Instant Delivery"
                  width={25}
                  height={25}
                  className="relative z-10 shrink-0"
                />
                <div className="relative z-10">
                  <p className="text-[#EA0058] font-medium text-lg">
                    Instant Delivery
                  </p>
                  <p className="text-white text-sm">
                    Your key will be delivered instantly to your email
                  </p>
                </div>
              </div>
            </div>

            {/* Controles de Quantidade */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex bg-neon-gradient p-0.5 items-center rounded-lg overflow-hidden">
                <div className="bg-zinc-950 rounded-md">
                  <button className="px-3 py-1.5 rounded-tl-sm rounded-bl-sm border-transparent border-r hover:border-zinc-600 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    -
                  </button>
                  <span className="px-4 py-1.5 text-white font-semibold text-sm">
                    1
                  </span>
                  <button className="px-3 py-1.5 rounded-tr-sm rounded-br-sm border-transparent border-l hover:border-zinc-600 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    +
                  </button>
                </div>
              </div>
              <span className="text-zinc-400 text-md">
                5+ in stock. Keys are limited. Order now!
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <button className="flex-1 rounded-xl bg-neon-gradient font-medium text-white text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <Image
                  src="/shopping-cart-white.svg"
                  alt="Add to Cart"
                  width={25}
                  height={25}
                />
                <span>Add to Cart</span>
              </button>

              <button className="p-7 rounded-xl border border-neon-pink/40 bg-zinc-950 text-neon-pink hover:bg-neon-pink/10 hover:text-white transition-all">
                <Image
                  src="/gradient-heart.svg"
                  alt="Add to Wishlist"
                  width={25}
                  height={25}
                />
              </button>
            </div>

            <p className="text-zinc-500 text-sm text-center font-regular">
              Express Checkout ⓘ
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 justify-items-center items-center">
              <div className="flex items-center gap-2 text-zinc-400 justify-center">
                <Image
                  src="/gradient-lock.svg"
                  alt="Secure"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-white text-md font-medium">100% Secure</p>
                  <p className="text-sm text-neon-gray">SSL Encrypted</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 justify-center">
                <Image
                  src="/gradient-certified.svg"
                  alt="Official Key"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-white text-md font-medium">Official Keys</p>
                  <p className="text-sm text-neon-gray">Guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 justify-center">
                <Image
                  src="/gradient-talk.svg"
                  alt="Support"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-white text-md font-medium">24/7 Support</p>
                  <p className="text-sm text-neon-gray">
                    We're here to help
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 justify-center">
                <Image
                  src="/gradient-price.svg"
                  alt="Best Price"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-white text-md font-medium">Best Price</p>
                  <p className="text-sm text-neon-gray">Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 p-[1.5px] rounded-2xl bg-neon-gradient">
          <div className="bg-black rounded-[14.5px] py-6 px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <p className="text-zinc-500 text-xs mb-1">Platform</p>
              <p className="text-white font-bold text-sm">{product.platform}</p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/gradient-region.svg" alt="Region" width={50} height={50} className="mb-2" />
              <p className="text-zinc-500 text-xs mb-1">Region</p>
              <p className="text-white font-bold text-sm">{product .region}</p> 
            </div>
            <div className="flex flex-col items-center">
              <Image src="/gradient-price-2.svg" alt="Type" width={50} height={50} className="mb-2" />
              <p className="text-zinc-500 text-xs mb-1">Type</p>
              <p className="text-white font-bold text-sm">{product.type}</p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/gradient-check.svg" alt="Region" width={50} height={50} className="mb-2" />
              <p className="text-zinc-500 text-xs mb-1">Delivery</p>
              <p className="text-white font-bold text-sm">{product.delivery}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="p-[1.5px] rounded-2xl bg-neon-pink/90">
            <div className="bg-black rounded-[14.5px] p-6 h-full">
              <h2 className="text-white font-bold text-lg pb-3">
                About this game
              </h2>
              <div className="h-0.5 bg-linear-to-r from-neon-pink/90 via-neon-pink/90 to-black w-20 md:w-50 rounded-full mb-4"></div>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="p-[1.5px] rounded-2xl bg-neon-pink/90">
              <div className="bg-black rounded-[14.5px] p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Image src="/gradient-region.svg" alt="Region" width={30} height={30} className="mb-2" /> 
                  <span className="-mt-2">
                    List of allowed
                    countries for this product version:
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-3 text-zinc-300 text-sm">
                  {product.allowedCountries?.map((country) => (
                    <div key={country} className="flex items-center gap-2">
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
                  This product is region locked and can only be activated in{" "}
                  {product.region} countries. This is a digital product; no
                  physical item will be shipped.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
