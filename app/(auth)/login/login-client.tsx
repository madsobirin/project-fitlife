"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import AuthLayout from "@/components/auth/authLayout";
import SubmitButton from "@/components/auth/ui/button";
import { toast } from "sonner";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function LoginClient({ registered }: { registered?: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi Submit ke API
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          toast.error(
            result.message || "Login gagal, cek kembali email/password.",
          );
        }
      } else {
        toast.success("Login Berhasil! Selamat datang kembali.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (registered === "1") {
      toast.success("Akun berhasil dibuat, silakan login.", {
        id: "register-success",
      });
    }
  }, [registered]);

  return (
    <AuthLayout
      title="Welcome Back"
      titleText="Enter your credentials to access your dashboard."
      linkTitle="belum punya akun"
      linkText="Register"
      href="/register"
    >
      <motion.form
        onSubmit={handleSubmit} // Ganti action ke onSubmit
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
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
            required
            className="placeholder:text-neutral-500 h-12 rounded-xl border border-neutral-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 text-neutral-700"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {errors.email && (
            <p className="text-xs text-red-500 font-medium">
              {errors.email[0]}
            </p>
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
              placeholder="Enter your password"
              required
              className="placeholder:text-neutral-500 h-12 rounded-xl border border-neutral-200 bg-white shadow-sm pr-10 focus-visible:ring-2 focus-visible:ring-emerald-500 text-neutral-700"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-500 font-medium">
              {errors.password[0]}
            </p>
          )}
        </motion.div>

        {/* submit */}
        <motion.div variants={item}>
          <SubmitButton
            titleButton={isLoading ? "Authenticating..." : "Continue account"}
            disabled={isLoading}
          />
        </motion.div>

        {/* divider */}
        <motion.div variants={item} className="flex items-center gap-4 py-4">
          <div className="h-px bg-neutral-200 flex-1" />
          <span className="text-sm text-neutral-400">or join with</span>
          <div className="h-px bg-neutral-200 flex-1" />
        </motion.div>

        {/* google */}
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
