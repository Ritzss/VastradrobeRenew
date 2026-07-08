"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import { toast } from "sonner";
import Link from "next/link";
// import Image from "next/image";

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
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] px-6 md:px-16 py-16 pt-28">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#5f5143]">
          My Profile
        </h1>
        <p className="text-sm text-[#7a6a5c] mt-2">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Summary */}
        <div className="bg-white rounded-4xl shadow-[0_30px_80px_rgba(149,127,106,0.15)]">
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

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* DETAILS */}
          <div className="md:col-span-2 bg-white rounded-4xl shadow-[0_30px_80px_rgba(149,127,106,0.15)] p-8 space-y-6">
            <div>
              <label className="text-sm text-[#7a6a5c]">Email</label>
              <div className="mt-1 border-b border-[#e6d8c8] p-2 text-[#5f5143]">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="text-sm text-[#7a6a5c]">Phone</label>
              <input
                type="text"
                maxLength={10}
                className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <label className="text-sm text-[#7a6a5c]">Delivery Address</label>
              <textarea
                rows={4}
                className="w-full border-b border-[#e6d8c8] p-2 outline-none resize-none focus:border-[#6a0f1f] transition"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className=" px-8 py-3 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-4xl shadow-[0_30px_80px_rgba(149,127,106,0.15)] p-8 space-y-4">
            <ProfileAction href="/orders" label="My Orders" />
            <ProfileAction href="/favorites" label="My Favorites" />
            <ProfileAction
              href="/account/reset_password"
              label="Reset Password"
            />
            <ProfileAction href="/support" label="Customer Support" />
          </div>
        </div>
      </div>
    </div>
  );

};

function ProfileAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className=" block px-4 py-3 rounded-xl border border-[#e6d8c8] text-[#5f5143] hover:bg-[#f3e7d8] transition"
    >
      {label}
    </Link>
  );
}

export default ProfilePageClient;
