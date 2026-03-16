"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Weight,
  Ruler,
  Edit3,
  Check,
  X,
  ShieldCheck,
  Loader2,
  Sparkles,
  Clock,
  AtSign,
} from "lucide-react";

type ProfileData = {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  phone: string | null;
  birthdate: string | null;
  weight: number | null;
  height: number | null;
  photo: string | null;
  google_avatar: string | null;
  created_at: string | null;
  last_login_at: string | null;
};

type EditableField = {
  key: keyof ProfileData;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  editable: boolean;
};

const fields: EditableField[] = [
  {
    key: "name",
    label: "Nama Lengkap",
    icon: <User size={15} />,
    type: "text",
    placeholder: "Masukkan nama lengkap",
    editable: true,
  },
  {
    key: "username",
    label: "Username",
    icon: <AtSign size={15} />,
    type: "text",
    placeholder: "Masukkan username",
    editable: true,
  },
  {
    key: "email",
    label: "Email Address",
    icon: <Mail size={15} />,
    type: "email",
    placeholder: "Email",
    editable: false,
  },
  {
    key: "phone",
    label: "Nomor Telepon",
    icon: <Phone size={15} />,
    type: "tel",
    placeholder: "Masukkan nomor telepon",
    editable: true,
  },
  {
    key: "birthdate",
    label: "Tanggal Lahir",
    icon: <Calendar size={15} />,
    type: "date",
    placeholder: "",
    editable: true,
  },
  {
    key: "weight",
    label: "Berat Badan (kg)",
    icon: <Weight size={15} />,
    type: "number",
    placeholder: "Berat dalam kg",
    editable: true,
  },
  {
    key: "height",
    label: "Tinggi Badan (cm)",
    icon: <Ruler size={15} />,
    type: "number",
    placeholder: "Tinggi dalam cm",
    editable: true,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<keyof ProfileData | null>(
    null,
  );
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<keyof ProfileData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch {
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const startEdit = (field: EditableField) => {
    if (!field.editable) return;
    setEditingField(field.key);
    const val = profile?.[field.key];
    if (field.type === "date" && val) {
      setEditValue(new Date(val as string).toISOString().split("T")[0]);
    } else {
      setEditValue(val != null ? String(val) : "");
    }
    setError(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const saveField = async (key: keyof ProfileData) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: editValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setEditingField(null);
        setSaveSuccess(key);
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setError(data.message || "Gagal menyimpan");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const formatValue = (
    field: EditableField,
    val: ProfileData[keyof ProfileData],
  ) => {
    if (val === null || val === undefined || val === "") return null;
    if (field.type === "date") {
      return new Date(val as string).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return String(val);
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (profile?.email?.[0]?.toUpperCase() ?? "U");

  const bmi =
    profile?.weight && profile?.height
      ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
      : null;

  const bmiCategory = bmi
    ? parseFloat(bmi) < 18.5
      ? { label: "Kurus", color: "text-blue-400" }
      : parseFloat(bmi) < 25
        ? { label: "Normal", color: "text-primary" }
        : parseFloat(bmi) < 30
          ? { label: "Gemuk", color: "text-yellow-400" }
          : { label: "Obesitas", color: "text-red-400" }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-text-muted text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background-base">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        {/* Hero Profile Card */}
        <div
          className="relative rounded-3xl overflow-hidden border border-card-border bg-card-dark mb-8 shadow-2xl"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          {/* Green mesh background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_rgba(0,255,127,0.2)] flex items-center justify-center bg-background-base text-primary font-black text-2xl">
                {profile.google_avatar || profile.photo ? (
                  <Image
                    src={(profile.google_avatar || profile.photo)!}
                    alt={profile.name ?? "User"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card-dark shadow-[0_0_8px_rgba(0,255,127,0.6)]" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-text-light truncate">
                  {profile.name ?? "Pengguna"}
                </h1>
                {profile.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-full w-fit mx-auto sm:mx-0">
                    <ShieldCheck size={11} /> Admin
                  </span>
                )}
              </div>
              {profile.username && (
                <p className="text-text-muted text-sm mb-1">
                  @{profile.username}
                </p>
              )}
              <p className="text-text-muted text-sm">{profile.email}</p>
            </div>

            {/* BMI Badge */}
            {bmi && bmiCategory && (
              <div className="shrink-0 text-center bg-background-base/60 border border-card-border rounded-2xl px-5 py-3">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1 font-bold">
                  BMI
                </p>
                <p className={`text-3xl font-black ${bmiCategory.color}`}>
                  {bmi}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </p>
              </div>
            )}
          </div>

          {/* Stats bar */}
          {(profile.created_at || profile.last_login_at) && (
            <div className="border-t border-card-border px-8 py-4 flex flex-wrap gap-6">
              {profile.created_at && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Sparkles size={13} className="text-primary/50" />
                  <span>
                    Bergabung{" "}
                    {new Date(profile.created_at).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {profile.last_login_at && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={13} className="text-primary/50" />
                  <span>
                    Login terakhir{" "}
                    {new Date(profile.last_login_at).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fields Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {fields.map((field, i) => {
            const isEditing = editingField === field.key;
            const value = formatValue(field, profile[field.key]);
            const justSaved = saveSuccess === field.key;

            return (
              <div
                key={field.key}
                className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isEditing
                    ? "border-primary/50 shadow-[0_0_20px_rgba(0,255,127,0.08)] bg-card-dark"
                    : justSaved
                      ? "border-primary/40 bg-card-dark"
                      : "border-card-border bg-card-dark hover:border-card-border/80"
                }`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${0.2 + i * 0.06}s, transform 0.5s ease ${0.2 + i * 0.06}s, border-color 0.2s, box-shadow 0.2s`,
                }}
              >
                {/* Top accent line saat editing */}
                {isEditing && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
                )}

                <div className="p-5">
                  {/* Label */}
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                      <span
                        className={`transition-colors ${isEditing ? "text-primary" : "text-text-muted"}`}
                      >
                        {field.icon}
                      </span>
                      {field.label}
                    </label>

                    {field.editable && !isEditing && (
                      <button
                        onClick={() => startEdit(field)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10"
                        title={`Edit ${field.label}`}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type={field.type}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={field.placeholder}
                        autoFocus
                        className="w-full bg-background-base border border-card-border rounded-xl px-4 py-2.5 text-text-light text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,255,127,0.06)] transition-all"
                      />
                      {error && <p className="text-red-400 text-xs">{error}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveField(field.key)}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-background-dark rounded-lg text-xs font-bold hover:bg-primary-hover transition-all disabled:opacity-50 shadow-[0_0_12px_rgba(0,255,127,0.2)]"
                        >
                          {saving ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          Simpan
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-background-base border border-card-border text-text-muted rounded-lg text-xs font-bold hover:text-text-light hover:border-text-muted/50 transition-all"
                        >
                          <X size={12} />
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-between cursor-pointer ${field.editable ? "" : "cursor-default"}`}
                      onClick={() => field.editable && startEdit(field)}
                    >
                      {justSaved ? (
                        <span className="text-primary text-sm font-semibold flex items-center gap-1.5">
                          <Check size={14} /> Tersimpan!
                        </span>
                      ) : value ? (
                        <span className="text-text-light text-sm font-medium">
                          {value}
                        </span>
                      ) : (
                        <span className="text-text-muted/50 text-sm italic">
                          {field.editable
                            ? `Klik untuk mengisi ${field.label.toLowerCase()}`
                            : "—"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          className="mt-6 text-center text-xs text-text-muted/50"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          Klik pada field untuk mengedit langsung • Email tidak dapat diubah
        </div>
      </div>
    </div>
  );
}
