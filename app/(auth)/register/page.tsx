"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import AuthLayout from "@/components/auth/authLayout";
import SubmitButton from "@/components/auth/ui/button";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerMessage(result.message || "Terjadi kesalahan");
        }
      } else {
        router.push("/login?registered=1");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setServerMessage("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Start Your Journey"
      titleText="Create your account to access elite tracking and coaching."
      linkTitle="sudah punya akun?"
      linkText="Login"
      href="/login"
    >
      <motion.form
        onSubmit={handleSubmit}
        variants={container}
        className="space-y-6"
      >
        {serverMessage && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {serverMessage}
          </div>
        )}
        {/* name */}
        <motion.div variants={item} className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-neutral-700"
          >
            Full Name
          </Label>

          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="placeholder:text-neutral-500 h-12 rounded-xl border border-neutral-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 text-neutral-700"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {errors.name && (
            <p className="text-xs text-red-500">{errors.name[0]}</p>
          )}
        </motion.div>

        {/* email */}
        <motion.div variants={item} className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-neutral-700"
          >
            Email Address
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="placeholder:text-neutral-500 h-12 rounded-xl border border-neutral-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 text-neutral-700"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {errors.email && (
            <p className="text-xs text-red-500">{errors.email[0]}</p>
          )}
        </motion.div>

        {/* password */}
        <motion.div variants={item} className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-neutral-700"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              className="placeholder:text-neutral-500 h-12 rounded-xl border border-neutral-200 bg-white shadow-sm pr-10 focus-visible:ring-2 focus-visible:ring-emerald-500 text-neutral-700"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {showPassword ? (
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

          {errors.password && (
            <p className="text-xs text-red-500">{errors.password[0]}</p>
          )}
        </motion.div>

        {/* submit */}
        <motion.div variants={item}>
          <SubmitButton
            titleButton={isLoading ? "Processing..." : "Create account"}
            disabled={isLoading}
          />
        </motion.div>

        {/* divider */}
        <motion.div variants={item} className="flex items-center gap-4 py-4">
          <div className="h-px bg-neutral-200 flex-1" />
          <span className="text-sm text-neutral-400">or join with</span>
          <div className="h-px bg-neutral-200 flex-1" />
        </motion.div>

        {/* google button */}
        <motion.button
          variants={item}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-neutral-200 bg-white rounded-xl py-3 hover:bg-gray-100 active:scale-[0.98] transition text-neutral-800 font-medium"
        >
          <Image src="/search.png" alt="google" width={20} height={20} />
          Continue with Google
        </motion.button>
      </motion.form>
    </AuthLayout>
  );
}
