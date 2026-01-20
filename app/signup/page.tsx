"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const setField =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // backend may return: {email:[...]} or {detail:"..."}
        const msg =
          data?.detail ||
          data?.message ||
          (typeof data === "object" ? JSON.stringify(data) : "Signup failed");
        setError(msg);
        return;
      }

      // If route auto-logs in and sets cookies -> go dashboard
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4">
      <div className="w-full max-w-[420px] p-5">
        <form
          onSubmit={onSubmit}
          className="bg-white/15 backdrop-blur-xl rounded-2xl p-9 shadow-[0_15px_40px_rgba(0,0,0,0.2)] text-white"
        >
          <h2 className="text-center text-[28px] font-semibold mb-1">Create Account</h2>
          <p className="text-center text-sm mb-6 opacity-90">
            Join us and start your journey
          </p>

          {error ? (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-300/40 px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          <div className="relative mb-6">
            <input
              value={form.first_name}
              onChange={setField("first_name")}
              type="text"
              required
              className="peer w-full bg-transparent border-b-2 border-white/60 outline-none text-white text-[15px] py-3 px-2"
            />
            <label className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-sm pointer-events-none transition-all peer-focus:top-[-6px] peer-focus:text-xs peer-focus:text-white peer-valid:top-[-6px] peer-valid:text-xs peer-valid:text-white">
              First Name
            </label>
          </div>

          <div className="relative mb-6">
            <input
              value={form.last_name}
              onChange={setField("last_name")}
              type="text"
              required
              className="peer w-full bg-transparent border-b-2 border-white/60 outline-none text-white text-[15px] py-3 px-2"
            />
            <label className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-sm pointer-events-none transition-all peer-focus:top-[-6px] peer-focus:text-xs peer-focus:text-white peer-valid:top-[-6px] peer-valid:text-xs peer-valid:text-white">
              Last Name
            </label>
          </div>

          <div className="relative mb-6">
            <input
              value={form.email}
              onChange={setField("email")}
              type="email"
              required
              className="peer w-full bg-transparent border-b-2 border-white/60 outline-none text-white text-[15px] py-3 px-2"
            />
            <label className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-sm pointer-events-none transition-all peer-focus:top-[-6px] peer-focus:text-xs peer-focus:text-white peer-valid:top-[-6px] peer-valid:text-xs peer-valid:text-white">
              Email Address
            </label>
          </div>

          <div className="relative mb-6">
            <input
              value={form.password}
              onChange={setField("password")}
              type="password"
              required
              className="peer w-full bg-transparent border-b-2 border-white/60 outline-none text-white text-[15px] py-3 px-2"
            />
            <label className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-sm pointer-events-none transition-all peer-focus:top-[-6px] peer-focus:text-xs peer-focus:text-white peer-valid:top-[-6px] peer-valid:text-xs peer-valid:text-white">
              Password
            </label>
          </div>

          <div className="relative mb-8">
            <input
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              type="password"
              required
              className="peer w-full bg-transparent border-b-2 border-white/60 outline-none text-white text-[15px] py-3 px-2"
            />
            <label className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-sm pointer-events-none transition-all peer-focus:top-[-6px] peer-focus:text-xs peer-focus:text-white peer-valid:top-[-6px] peer-valid:text-xs peer-valid:text-white">
              Confirm Password
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff9966] to-[#ff5e62]
              text-white text-base font-semibold transition
              hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]
              disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <span className="block text-center mt-5 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#ffd6d6] font-medium hover:underline">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}