import Image from "next/image";

const features = [
  {
    id: "delivery",
    icon: "/why-icon1.png",
    title: "INSTANT DELIVERY",
    description: "Get your keys instantly delivered to your email",
  },
  {
    id: "secure",
    icon: "/why-icon2.png",
    title: "100% SECURE",
    description: "Safe & secure payments with SSL encryption.",
  },
  {
    id: "support",
    icon: "/why-icon3.png",
    title: "24/7 SUPPORT",
    description: "Our support team is always here to help.",
  },
  {
    id: "prices",
    icon: "/why-icon4.png",
    title: "BEST PRICES",
    description: "We offer the best prices on the market.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-black rounded-3xl px-6 py-20">
      <div className="mb-16 flex items-center justify-center gap-6">
        <div className="bg-linear-to-r from-transparent to-neon-pink h-1 w-24 rounded-full md:w-40" />
        <h2 className="font-inder text-neon-white text-3xl font-regular tracking-wide whitespace-nowrap md:text-5xl">
          WHY CHOOSE NEON KEYS ?
        </h2>
        <div className="bg-linear-to-l from-transparent to-neon-orange h-1 w-24 rounded-full md:w-40" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 md:flex-row md:items-stretch md:gap-0">
        {features.map((feature, index) => (
          <div key={feature.id} className="flex flex-1 flex-col items-center md:flex-row md:items-stretch">
            <div className="flex w-full flex-1 flex-col justify-center items-center text-center px-4 md:px-8">
              <div className="relative mb-6 flex items-center justify-center">
                <div
                  className="bg-neon-gradient absolute inset-0 rounded-full opacity-50 blur-2xl"
                  aria-hidden="true"
                />
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="relative"
                />
              </div>

              <h3 className="font-inter text-neon-white mb-3 text-base font-bold tracking-wider md:text-xl">
                {feature.title}
              </h3>

              <p className="text-neon-dark text-base font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>

            {index < features.length - 1 && (
              <>
                <div className="bg-white hidden h-54 w-0.5 rounded-full  md:block" aria-hidden="true" />
                <div className="bg-white my-4 h-px w-3/4 md:hidden" aria-hidden="true" />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}