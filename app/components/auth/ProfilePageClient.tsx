"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 👑 LUXURY OVERHAUL: Account Profile Panel (Nangalia Ruchira Style)
 *
 * Re-designed with pristine styling:
 * - Geometric shape: Swapped all muddy brown outlines and bubbles for modern, clean rounded-2xl panels.
 * - Inputs: Clean, fully-outlined rectangular text entry fields.
 * - Navigation links: Styled as premium tracked list elements with chevrons.
 * - Fluid entrance: Animated on-mount slide-reveal.
 */
const ProfilePageClient = ({ defaultImage }: { defaultImage?: string }) => {
  const { user, setUser, authLoading, loadUser } = useAppContext();
  const router = useRouter();

  const [address, setAddress] = useState(user?.deliveryAddress?.address || "");
  const [phone, setPhone] = useState(user?.deliveryAddress?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    }
  }, [authLoading, user, router]);

  // Synchronize dynamic input fields on mount/user load
  useEffect(() => {
    if (user?.deliveryAddress) {
      setAddress(user.deliveryAddress.address || "");
      setPhone(user.deliveryAddress.phone || "");
    }
  }, [user]);

  if (authLoading || !user) return null;

  const handleSave = async () => {
    if (!address || !phone) {
      toast.error("Address and phone required");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, phone }),
    });

    if (!res.ok) {
      toast.error("Update failed");
      setSaving(false);
      return;
    }

    await loadUser();
    setSaving(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] dark:bg-black transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-16 pt-28">
      {/* Cinematic Slide-In on mount */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto space-y-12"
      >
        {/* HEADING BLOCK */}
        <div className="text-left space-y-1 border-b border-neutral-100 dark:border-neutral-900 pb-4 select-none">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Customer Panel
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white uppercase tracking-wide">
            My Profile
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light font-sans tracking-wide">
            Manage your account details, delivery locations, and order
            preferences.
          </p>
        </div>

        {/* Profile Summary Card Wrapper */}
        <div className="rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-xs">
          <ProfileCard
            name={user?.username}
            handle={user?.username}
            avatarUrl={user?.avatar || defaultImage || ""}
            contactText="Change Photo"
            showUserInfo={true}
            onAvatarChange={async (file) => {
              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/profile/image", {
                method: "POST",
                body: formData,
              });

              if (res.ok) {
                const data = await res.json();
                setUser((prev) =>
                  prev ? { ...prev, avatar: data.avatar } : null,
                );
                toast.success("Avatar updated");
              } else {
                toast.error("Upload failed");
              }
            }}
          />
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* LEFT AREA: PROFILE DETAILS FORM */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase block">
                Email Address
              </label>
              <div className="w-full rounded-md border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900 px-4 py-3.5 text-xs text-neutral-500 dark:text-neutral-400 tracking-wide select-text">
                {user?.email}
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase block">
                Phone Number
              </label>
              <input
                type="text"
                maxLength={10}
                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit mobile"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase block">
                Primary Delivery Address
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none resize-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete home or office shipping location details"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* RIGHT AREA: NAVIGATION PANEL ACTIONS */}
          <div className="rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 sm:p-8 space-y-4 shadow-xs h-auto self-start">
            <ProfileAction href="/orders" label="My Orders" />
            <ProfileAction href="/favorites" label="My Favorites" />
            <ProfileAction
              href="/account/reset_password"
              label="Reset Password"
            />
            <ProfileAction href="/support" label="Customer Support" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function ProfileAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 hover:border-[#6A0F1F] dark:hover:border-[#e4e198] hover:text-[#6A0F1F] dark:hover:text-[#e4e198] p-4 text-[10px] font-bold uppercase tracking-widest transition duration-300 shadow-xs cursor-pointer group"
    >
      <span>{label}</span>
      <ChevronRight
        size={14}
        className="text-neutral-400 group-hover:text-[#6A0F1F] dark:group-hover:text-[#e4e198] group-hover:translate-x-1.5 transition duration-300"
      />
    </Link>
  );
}

export default ProfilePageClient;
