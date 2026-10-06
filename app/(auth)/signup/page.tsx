"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../../src/utils/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setServerError(null);
    // TODO: plugar com better-auth, ex:
    // const { error } = await authClient.signUp.email({
    //   name: data.name, email: data.email, password: data.password,
    // });
    // if (error) setServerError(error.message);
    console.log(data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl bg-neon-gradient p-[2px]">
          <div className="rounded-2xl bg-black px-8 py-10 sm:px-12 sm:py-12">
            <h1 className="text-center font-gabarito text-4xl font-bold text-neon-white sm:text-5xl">
              Create your account
            </h1>
            <p className="mt-3 text-center text-base text-neon-gray sm:text-lg">
              Join Neon Keys and start saving on game keys.
            </p>

            {serverError && (
              <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-3 text-base text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-base font-medium text-neon-white/80">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  className={`h-13 w-full rounded-lg border bg-black px-5 text-base text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                    errors.name ? "border-red-500" : "border-neon-white/20"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
              </div>

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
                <label htmlFor="password" className="mb-2 block text-base font-medium text-neon-white/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-base font-medium text-neon-white/80">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={`h-13 w-full rounded-lg border bg-black px-5 text-base text-neon-white outline-none placeholder:text-neon-white/40 focus:border-neon-pink ${
                    errors.confirmPassword ? "border-red-500" : "border-neon-white/20"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-base text-neon-white/80">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    className="mt-1 h-5 w-5 shrink-0 accent-neon-pink"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="text-neon-pink hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-neon-pink hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.acceptTerms.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex h-14 items-center justify-center rounded-lg bg-neon-gradient text-base font-semibold text-neon-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-8 text-center text-base text-neon-gray">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-neon-pink hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}