import type { Metadata } from "next";
import { Inder, Inter, Gabarito } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/header";
import Footer from "@/src/components/footer";

const inder = Inder({
  variable: "--font-inder",
  subsets: ["latin"],
  weight: "400"
});

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neon Keys",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inder.variable} ${gabarito.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
