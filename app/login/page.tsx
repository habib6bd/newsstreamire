"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// ✅ Important: import the default context AND the type (named) from the same file
import AuthContext, { type AuthContextType } from "@/context/AuthContext";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  // ✅ Important: tell TS what this context contains
  const auth = useContext<AuthContextType | null>(AuthContext);

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>();

  useEffect(() => {
    if (!auth) return;
    if (auth.user) router.replace("/admin"); // change to your real route
  }, [auth, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    if (!auth) {
      setServerError("AuthProvider is not configured. Wrap your app with <AuthProvider>.");
      return;
    }

    const success = await auth.loginUser({
      email: data.email,
      password: data.password
    });

    if (success) {
      router.push("/admin"); // change to your real route
    } else {
      setServerError(auth.error || "Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Sign in</h2>

          {serverError ? (
            <p className="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", { required: "Email required" })}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password", { required: "Password required" })}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!auth?.loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting || auth?.loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}