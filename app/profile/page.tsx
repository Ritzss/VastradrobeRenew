"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import { toast } from "sonner";

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
          avatarUrl={user?.avatar || "/Assets/Images/Profiles/profile.svg"}
          contactText="Change Photo"
          showUserInfo={true}
          enableTilt={false}
          enableMobileTilt={false}
          onAvatarChange={async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/profile/image", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              await loadUser();
              toast.success("Avatar updated");
            } else {
              toast.error("Upload failed");
            }
          }}
        />

        <div className="profileBox">
          <label className="text-sm text-[#ffffff]">Email ID</label>
          <input
            className="w-full border border-[#636363a8] text-[#ffffffac] cursor-none outline-0 no-caret p-2 rounded"
            value={user?.email}
            readOnly
          />
        </div>
        <div className="profileBox">
          <label className="text-sm text-white">Phone</label>
          <input
            type="text"
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            className="w-full border outline-0 border-[#636363a8] p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className="profileBox">
          <label className="text-sm text-white">Delivery Address</label>
          <textarea
            className="w-full border border-[#636363a8] outline-0 p-2 rounded"
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
    </div>
  );
};

export default ProfilePage;
