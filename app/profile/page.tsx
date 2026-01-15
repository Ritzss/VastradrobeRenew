"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import Link from "next/link";

const ProfilePage = () => {
  const { user, authLoading, loadUser } = useAppContext();
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
      alert("Address,Email & phone required");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, phone }),
    });

    if (!res.ok) {
      alert("Update failed");
      setSaving(false);
      return;
    }

    await loadUser(); // ✅ refresh context
    setSaving(false);
    alert("Profile updated");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="text-white max-w-5xl mx-auto bg-[#000000e6] shadow rounded-lg p-6 space-y-4">
        <ProfileCard
          name={user?.username}
          handle={user?.username}
          status=""
          contactText="Upload photo (optional)"
          avatarUrl="/Assets/Images/Profiles/profile.svg"
          showUserInfo={true}
          enableTilt={false}
          enableMobileTilt={false}
          onContactClick={() => console.log("Contact clicked")}
        />

        <div>
          <label className="text-sm text-[#ffffff]">Email ID</label>
          <input
            className="w-full border text-[#ffffffac] cursor-none outline-0 no-caret p-2 rounded"
            value={user?.email}
            readOnly
          />
        </div>
        <div>
          <label className="text-sm text-white">Phone</label>
          <input
            type="text"
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div>
          <label className="text-sm text-white">Delivery Address</label>
          <textarea
            className="w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-black px-6 py-2 rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="flex justify-around m-5">
        <Link href={"/orders"} className="w-[33%]">
          <button
            type="button"
            className="bg-[#e7aa00d8] h-[8svh] text-white px-6 py-2 rounded-xl shadow-[inset_0_0_10px_#ffffff] w-full"
          >
            Order
          </button>
        </Link>
        <Link href={"/favorites"} className="w-[33%]">
          <button
            type="button"
            className="bg-[#ff0080ce] h-[8svh] text-white px-6 py-2 rounded-xl shadow-[inset_0_0_10px_#ffffff] w-full"
          >
            Favorites
          </button>
        </Link>
        <Link href={"/"} className="w-[33%]">
          <button
            type="button"
            className="bg-[#cd0000d0] h-[8svh] text-white px-6 py-2 rounded-xl shadow-[inset_0_0_10px_#ffffff] w-full"
          >
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
