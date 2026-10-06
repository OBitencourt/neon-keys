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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl bg-neon-gradient p-[2px]">
          <div className="rounded-2xl bg-black px-8 py-10 sm:px-12 sm:py-12">
            <h1 className="text-center font-gabarito text-4xl font-bold text-neon-white sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 text-center text-base text-neon-gray sm:text-lg">
              Log in to access your keys and orders.
            </p>

            {serverError && (
              <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-3 text-base text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-base font-medium text-neon-white/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`h-13 w-full rounded-lg border bg-black px-5 text-base text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                    errors.email ? "border-red-500" : "border-neon-white/20"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-base font-medium text-neon-white/80">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-neon-pink hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    className={`h-13 w-full rounded-lg border bg-black px-5 pr-14 text-base text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                      errors.password ? "border-red-500" : "border-neon-white/20"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neon-white/50 hover:text-neon-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex h-14 items-center justify-center rounded-lg bg-neon-gradient text-base font-semibold text-neon-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="mt-8 text-center text-base text-neon-gray">
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