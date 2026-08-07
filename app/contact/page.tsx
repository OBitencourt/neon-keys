"use client";

import { useState } from "react";
import Image from "next/image";
import WhyChooseUs from "../../src/sections/main/whychooseus";

const quickFacts = [
  { icon: "/gradient-email.svg", label: "Email Us", value: "support@neon-keys.com", isEmail: true },
  { icon: "/gradient-clock.svg", label: "Response Time", value: "24h or less" },
  { icon: "/gradient-headset.svg", label: "Live Support", value: "24/7 Available" },
];

const contactCards = [
  {
    icon: "/gradient-email-2.svg",
    title: "Email Support",
    description: "We usually reply within 24 hours.",
  },
  {
    icon: "/gradient-headset.svg",
    title: "Live Chat",
    description: "Available 24/7 on our website. Get instant help from our team.",
  },
  {
    icon: "/gradient-discord.svg",
    title: "Discord Community",
    description: "Join our Discord server and get help from our community.",
    cta: "JOIN DISCORD",
  },
  {
    icon: "/gradient-region.svg",
    title: "Business Inquiries",
    description: "For partnerships and B2B opportunities.",
    email: "business@neon-keys.com",
  },
];

const subjectOptions = ["General Inquiry", "Order Support", "Partnership / B2B", "Report an Issue", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: enviar o formulário pra sua API / serviço de e-mail
    console.log(form);
  }

  return (
    <div className="bg-black min-h-screen px-8 py-14">
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div>
          <div className="bg-neon-gradient inline-block rounded-full p-0.5 mb-6">
            <span className="block bg-black text-md font-medium tracking-wide rounded-full px-4 py-1.5">
              <span className="bg-neon-gradient bg-clip-text text-transparent">
              CONTACT US
              </span>
            </span>
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">
            <span className="text-neon-white">We&apos;re here</span>
            <br />
            <span className="bg-neon-gradient bg-clip-text text-transparent">to help you!</span>
          </h1>

          <p className="text-neon-gray mt-4 text-md max-w-md">
            Have a question, need support or want to partner with us? Our team is ready to assist
            you
          </p>

          <div className="flex flex-wrap items-center gap-8 mt-8">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4">
                <Image src={fact.icon} alt={fact.label} width={35} height={35} />
                <div>
                  <p className="text-neon-white text-md font-semibold">{fact.label}</p>
                  {fact.isEmail ? (
                    <a href={`mailto:${fact.value}`} className="text-neon-pink text-sm hover:underline">
                      {fact.value}
                    </a>
                  ) : (
                    <p className="text-neon-gray text-sm">{fact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Image src="/gradient-email-image.svg" alt="Envelope" width={500} height={500} />
      </div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-neon-gradient rounded-3xl p-[1.5px]">
          <div className="rounded-3xl bg-black p-8">
            <h2 className="text-neon-white text-4xl font-bold mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-neon-white text-sm font-medium block mb-2">Your name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-transparent border-2 border-neon-gray/40 rounded-xl px-4 py-3 text-neon-white placeholder:text-neon-gray text-sm outline-none focus:border-neon-pink transition-colors"
                />
              </div>

              <div>
                <label className="text-neon-white text-sm font-medium block mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-transparent border-2 border-neon-gray/40 rounded-xl px-4 py-3 text-neon-white placeholder:text-neon-gray text-sm outline-none focus:border-neon-pink transition-colors"
                />
              </div>

              <div>
                <label className="text-neon-white text-sm font-medium block mb-2">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full bg-black border-2 border-neon-gray/40 rounded-xl px-4 py-3 text-neon-white text-sm outline-none focus:border-neon-pink transition-colors"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {subjectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neon-white text-sm font-medium block mb-2">Message</label>
                <textarea
                  placeholder="Type your message here..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full bg-transparent border-2 border-neon-gray/40 rounded-xl px-4 py-3 text-neon-white placeholder:text-neon-gray text-sm outline-none focus:border-neon-pink transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-3 bg-neon-gradient text-neon-white font-bold text-md tracking-wide rounded-xl py-3.5 hover:opacity-90 transition-opacity"
              >
                <Image src="/white-send.svg" alt="Enviar" width={20} height={20} />
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>

        {/* Informações de contato */}
        <div>
          <h2 className="text-neon-white text-2xl font-bold">Contact information</h2>
          <p className="text-neon-gray text-sm mt-1 mb-6">Choose the best way to reach us.</p>

          <div className="flex flex-col gap-4">
            {contactCards.map((card) => (
              <div key={card.title} className="bg-neon-gradient rounded-2xl p-[1.5px]">
                <div className="flex items-center gap-4 rounded-2xl bg-black p-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                    <Image src={card.icon} alt={card.title} width={40} height={40} />
                  </div>
                  <div>
                    <h3 className="text-neon-white font-semibold">{card.title}</h3>
                    <p className="text-neon-gray text-sm mt-1">{card.description}</p>
                    {card.email && (
                      <a href={`mailto:${card.email}`} className="text-neon-pink text-sm hover:underline">
                        {card.email}
                      </a>
                    )}
                    {card.cta && (
                      <div className="bg-neon-gradient inline-block rounded-xl p-[1.5px] mt-3">
                        <button className="flex items-center gap-3 bg-black text-neon-white text-sm font-bold tracking-wide rounded-xl px-4 py-2 hover:bg-neon-white/5 transition-colors">
                          {card.cta} 
                          <Image src="/white-arrow-right.svg" alt="Seta" width={16} height={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reaproveitando o WhyChooseUs, agora dentro de um card com borda em gradiente */}
      <div className="max-w-7xl mx-auto bg-neon-gradient rounded-2xl p-[1.5px] mt-16">
        <div className="rounded-2xl bg-black">
          <WhyChooseUs />
        </div>
      </div>
    </div>
  );
}