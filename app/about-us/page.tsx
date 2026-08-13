import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen text-neon-white font-inter">
      <div className="max-w-380 mx-auto px-8 py-16">
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="flex-1">
            <div className="bg-neon-gradient inline-block rounded-full p-0.5 mb-6">
              <span className="block bg-black text-md font-medium tracking-wide rounded-full px-4 py-1.5">
                <span className="bg-neon-gradient bg-clip-text text-transparent">
                  ABOUT NEON KEYS
                </span>
              </span>
            </div>
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Your trusted source for <br />
              <span className="bg-neon-gradient bg-clip-text text-transparent">
                digital games keys
              </span>
            </h1>
            <p className="text-neon-gray text-lg max-w-lg mb-10 leading-relaxed">
              Neon Keys was built by gamers, for gamers. We're passionate about
              making games more accessible by offering fast, secure and
              affordable digital keys from around the world.
            </p>

            <div className="mt-6 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full  px-3 py-1.5">
                  <Image
                    src="/raio-icon.svg"
                    alt="Instant Delivery"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <p className="text-neon-white text-lg font-regular">
                    Instant Delivery
                  </p>
                  <p className="text-neon-gray text-md">
                    Get your keys instantly
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full  px-2 py-1.5">
                  <Image
                    src="/escudo1.svg"
                    alt="100% Secure"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className="text-neon-white text-lg font-regular">
                    100% Secure
                  </p>
                  <p className="text-neon-gray text-md">
                    SSL encrypted payments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full  px-2 py-2">
                  <Image
                    src="/fone1.svg"
                    alt="24/7 Support"
                    className=" ml-0.5"
                    width={45}
                    height={45}
                  />
                </div>
                <div>
                  <p className="text-neon-white text-lg font-regular">
                    24/7 Support
                  </p>
                  <p className="text-neon-gray text-md">We're here to help.</p>
                </div>
              </div>
            </div>
          </div>

          <Image
            src="/about-image.svg"
            alt="Mission Image"
            width={500}
            height={500}
          />
        </section>
        <section className="bg-neon-gray p-px rounded-3xl mb-24">
          <div className="bg-black rounded-[23px] py-12 px-8 flex flex-wrap justify-around gap-12">
            <div className="text-center flex flex-col items-center gap-2">
              <Image src="/gradient-bag-about.svg" alt="Keys Sold" width={40} height={40} />

              <div className="flex flex-col items-center ">
                <h3 className="text-5xl font-bold mb-1 mt-3">2000+</h3>
                <p className="text-neon-white text-md font-semibold mb-1">
                  Keys Sold
                </p>
                <p className="text-neon-gray text-sm">
                  And counting every day
                </p>
              </div>
            </div>
            <div className=" text-center flex flex-col items-center gap-2">
              <Image src="/gradient-smile.svg" alt="Happy Customers" width={40} height={40} />

              
              <div className="flex flex-col items-center ">

                <h3 className="text-5xl font-bold mb-1 mt-3">250+</h3>
                <p className="text-neon-white text-md font-semibold mb-1">
                  Happy Customers
                </p>
                <p className="text-neon-gray text-sm">
                  Trusted by gamers worldwide
                </p>
              </div>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <Image src="/pink-star.svg" alt="Average Rating" width={40} height={40} />

              <div className="flex flex-col items-center">
                <h3 className="text-5xl font-bold mb-1 mt-3">4.9/5</h3>
                <p className="text-neon-white text-sm font-semibold mb-1">
                  Average Rating
                </p>
                <p className="text-neon-gray text-sm">
                  From thousand of reviews
                </p>
              </div>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <Image src="/gradient-region.svg" alt="Countries" width={40} height={40} />

              <div className="flex flex-col items-center ">
                <h3 className="text-5xl font-bold mb-1 mt-3">180+</h3>
                <p className="text-neon-white text-sm font-semibold mb-1">
                  Countries
                </p>
                <p className="text-neon-gray text-sm">We delivery globally</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-neon-gradient p-px rounded-3xl mb-24 overflow-hidden">
          <div className="bg-black rounded-[23px] flex flex-col lg:flex-row">
            <div className="flex-1 p-12 flex flex-col justify-center">
              <span className="text-neon-pink text-md font-meidum uppercase tracking-widest mb-4">
                Our Mission
              </span>
              <h2 className="text-5xl font-bold mb-6">
                Making games <br />
                <span className="bg-neon-gradient bg-clip-text text-transparent">
                  more accessible
                </span>{" "}
                <br />
                for everyone.
              </h2>
              <p className="text-neon-gray text-md mb-8 leading-relaxed max-w-md">
                We believe that everyone deserves to enjoy the games they love.
                That's why we work hard every day to bring you the best prices,
                the best service, and the best experience possible.
              </p>
              <Link
                href="/shop"
                className="bg-neon-gradient p-px rounded-full w-fit group"
              >
                <div className="bg-black group-hover:bg-transparent transition-colors px-8 py-3 rounded-full flex items-center gap-4">
                  <span className="text-md font-medium">Shop Now</span>
                  <Image
                    src="/white-arrow-right.svg"
                    alt="Shop Now"
                    width={15}
                    height={15}
                  />
                </div>
              </Link>
            </div>
            <div className="flex-1 relative min-h-100">
              {/* Mission Image Placeholder */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
                <div className="relative z-10 w-full h-full">
                  <div className="w-full h-full bg-[url('/mission-placeholder.jpg')] bg-cover bg-center opacity-60"></div>
                  <Image src="/about-image-2.png" width={1000} height={1000} quality={100} alt="Mission Image" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24 text-center">
          <span className="text-neon-pink text-lg font-medium uppercase tracking-widest mb-2 block">
            Our Values
          </span>
          <h2 className="text-5xl font-bold mb-12 bg-neon-gradient bg-clip-text text-transparent inline-block">
            What drives us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neon-gradient p-px rounded-2xl">
              <div className="bg-black rounded-[15px] p-8 h-full flex flex-col items-center text-center">
                <Image src="/gradient-diamond-about.svg" alt="Trust & Integrity" width={40} height={40} />
                <h4 className="font-bold mb-3 mt-4">Trust & Integrity</h4>
                <p className="text-neon-gray text-sm leading-relaxed">
                  We're transparent and honest in everything we do.
                </p>
              </div>
            </div>
            <div className="bg-neon-gradient p-px rounded-2xl">
              <div className="bg-black rounded-[15px] p-8 h-full flex flex-col items-center text-center">
                <Image src="/gradient-price-about.svg" alt="Best Prices" width={40} height={40} />
                <h4 className="font-bold mb-3 mt-4">Best Prices</h4>
                <p className="text-neon-gray text-sm leading-relaxed">
                  We constantly work to bring you the best deals.
                </p>
              </div>
            </div>
            <div className="bg-neon-gradient p-px rounded-2xl">
              <div className="bg-black rounded-[15px] p-8 h-full flex flex-col items-center text-center">
                <Image src="/rocket-about.svg" alt="Fast & Reliable" width={40} height={40} />
                <h4 className="font-bold mb-3 mt-4">Fast & Reliable</h4>
                <p className="text-neon-gray text-sm leading-relaxed">
                  Instant delivery and reliable service you can count on.
                </p>
              </div>
            </div>
            <div className="bg-neon-gradient p-px rounded-2xl">
              <div className="bg-black rounded-[15px] p-8 h-full flex flex-col items-center text-center">
                <Image src="/heart-about.svg" alt="Passion for Gaming" width={40} height={40} />
                <h4 className="font-bold mb-3 mt-4">Passion for Gaming</h4>
                <p className="text-neon-gray text-sm leading-relaxed">
                  We're gamers too, and we love what we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neon-gradient p-px rounded-3xl">
          <div className="bg-black rounded-[23px] p-12 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <Image
                  src="/why-icon2.png"
                  alt="Why Choose Us"
                  width={400}
                  height={400}
                  className="w-35"
                />
              </div>
            </div>
            <div className="lg:w-2/3">
              <span className="text-neon-pink text-md font-mediu uppercase tracking-widest mb-2 block">
                Why Choose Neon Keys?
              </span>
              <h2 className="text-4xl font-bold mb-8">We've got your {" "}
                <span className="bg-neon-gradient bg-clip-text text-transparent">
                  back.
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {[
                  "Official & legitimate game keys",
                  "Secure payments with SSL encryption",
                  "No hidden fees or surprises",
                  "Dedicated 24/7 customer support",
                  "Regular deals and exclusive offers",
                  "Trusted by thousand of gamers",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Image src="gradient-check.svg" width={20} height={20} alt="certified" />
                    <span className="text-neon-gray text-md font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
