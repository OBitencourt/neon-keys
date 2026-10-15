"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../src/utils/auth";
import { signIn } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(undefined);
    const { email, password } = data;
    const result = await signIn.email({ email, password });

    if (result.error) {
      setServerError(result.error.message);
      return;
    }

    router.push("/shop");
  }

  async function handleGoogleSignIn() {
    setServerError(undefined);
    setIsGoogleLoading(true);

    const result = await signIn.social({
      provider: "google",
      callbackURL: "/shop",
    });

    // Em caso de sucesso o browser é redirecionado para o Google,
    // por isso só chegamos aqui se algo falhar.
    if (result?.error) {
      setServerError(result.error.message);
      setIsGoogleLoading(false);
    }
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
                disabled={isSubmitting || isGoogleLoading}
                className="mt-4 flex h-14 items-center justify-center rounded-lg bg-neon-gradient text-base font-semibold text-neon-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Divisor */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-neon-white/20" />
              <span className="text-sm uppercase tracking-wide text-neon-gray">or</span>
              <div className="h-px flex-1 bg-neon-white/20" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleLoading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-neon-white/20 bg-black text-base font-semibold text-neon-white transition-colors hover:border-neon-pink/40 hover:bg-neon-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
                />
              </svg>
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

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