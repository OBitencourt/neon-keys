import Image from "next/image";

const shopLinks = [
  "All Products",
  "Steam Games",
  "Epic Games",
  "Xbox Games",
  "Playstation Games",
  "Gift Cards",
];

const supportLinks = [
  "FAQ",
  "Delivery",
  "Returns & Refunds",
  "Terms of Service",
  "Privacy Policy",
  "Contact Us",
];

const companyLinks = ["About Us", "Blog", "B2B", "Affiliates"];

const paymentMethods = [
  { name: "Visa", icon: "/visa1.svg" },
  { name: "Mastercard", icon: "/mastercards1.svg" },
  { name: "PayPal", icon: "/paypal1.png" },
  { name: "Google Pay", icon: "/googlepay1.svg" },
  { name: "Apple Pay", icon: "/applepay1.svg" },
];


function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[#FFEDED] text-xl font-medium mb-5">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-[#FFEDED] hover:text-neon-pink transition-colors text-base"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black px-8 pt-16 pb-8">
      <div className="flex flex-col md:flex-row gap-12 md:gap-0 max-w-390 mx-auto items-start">
        <div className="md:w-72 shrink-0">
          <div className="text-4xl font-semibold tracking-tight mb-4">
            <span className="text-neon-white">NEON</span>{" "}
            <span className="bg-neon-gradient bg-clip-text text-transparent">KEYS</span>
          </div>
          <p className="text-[#FFEDED] text-base font-medium leading-relaxed max-w-xs">
            Your trusted source for digital game keys. Fast delivery, secure payments and the
            best prices.
          </p>
        </div>

        <div className="hidden md:block w-0.5 self-stretch bg-white rounded-full mx-10" />

        <div className="flex flex-1 flex-col sm:flex-row justify-between gap-10">
          <FooterColumn title="SHOP" links={shopLinks} />
          <FooterColumn title="SUPPORT" links={supportLinks} />
          <FooterColumn title="COMPANY" links={companyLinks} />
        </div>

        <div className="hidden md:block w-0.5 self-stretch bg-white rounded-full mx-10" />

        <div className="shrink-0 flex flex-col items-center">
          <h4 className="text-neon-white text-lg font-semibold mb-5 tracking-wide">
            WE ACCEPT
          </h4>

          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <div key={method.name} className="bg-neon-gradient rounded-lg p-[1.5px]">
                <div className="flex items-center justify-center w-20 h-11 p- rounded-lg bg-black">
                  {/* Troque pelo logo real da bandeira/carteira */}
                  <Image src={method.icon} alt={method.name} width={50} height={30} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-neon-white text-sm font-semibold mt-4 tracking-wide">
            100% SECURE
          </p>
        </div>
      </div>

      <div className="mt-14 pt-6 max-w-390 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-neon-gray text-sm">
        <span>© 2024 Neon Keys, All rights reserved.</span>
        <span>Made with love by Neon Keys</span>
      </div>
    </footer>
  );
}