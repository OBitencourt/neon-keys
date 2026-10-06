"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../src/utils/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    // TODO: plugar com better-auth, ex:
    // const { error } = await authClient.signIn.email(data);
    // if (error) setServerError(error.message);
    console.log(data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Image src="/Logo-Neon.svg" alt="Neon Keys" width={56} height={56} />
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-neon-white">NEON</span>{" "}
            <span className="bg-neon-gradient bg-clip-text text-transparent">KEYS</span>
          </span>
        </Link>

        <div className="rounded-2xl bg-neon-gradient p-[1.5px]">
          <div className="rounded-2xl bg-black px-6 py-8 sm:px-10 sm:py-10">
            <h1 className="text-center font-gabarito text-3xl font-bold text-neon-white">
              Welcome back
            </h1>
            <p className="mt-2 text-center text-sm text-neon-gray">
              Log in to access your keys and orders.
            </p>

            {serverError && (
              <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neon-white/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`h-11 w-full rounded-md border bg-black px-4 text-sm text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                    errors.email ? "border-red-500" : "border-neon-white/20"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-neon-white/80">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-neon-pink hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    className={`h-11 w-full rounded-md border bg-black px-4 pr-12 text-sm text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                      errors.password ? "border-red-500" : "border-neon-white/20"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neon-white/50 hover:text-neon-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center rounded-md bg-neon-gradient py-3 text-sm font-semibold text-neon-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neon-gray">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-neon-pink hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}