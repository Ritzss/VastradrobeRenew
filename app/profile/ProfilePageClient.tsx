"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import { toast } from "sonner";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

const ProfilePageClient = () => {
  const { user, authLoading, loadUser } = useAppContext();
  const router = useRouter();

  const [address, setAddress] = useState(user?.deliveryAddress?.address || "");
  const [phone, setPhone] = useState(user?.deliveryAddress?.phone || "");
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setShowDetails(window.innerWidth >= 768);
    };

    checkWidth(); // initial run
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

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
    <div className="px-4 sm:px-6 md:px-10 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
        My Profile
      </h1>

      <div
        className={` text-white max-w-5xl mx-auto bg-[#000000e6] shadow-xl rounded-xl p-5 sm:p-8 space-y-6`}
      >
        {/* PROFILE CARD DESKTOP*/}
        <ProfileCard
          name={user?.username}
          handle={user?.username}
          avatarUrl={user?.avatar || "/Assets/Images/Profiles/profile.svg"}
          contactText="Change Photo"
          showUserInfo={true}
          enableTilt={false}
          enableMobileTilt={false}
          className="hidden lg:block"
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
        {/* PROFILE CARD TAB*/}
        <ProfileCard
          name={user?.username}
          handle={user?.username}
          avatarUrl={user?.avatar || "/Assets/Images/Profiles/profile.svg"}
          contactText="Change Photo"
          showUserInfo={true}
          enableTilt={false}
          enableMobileTilt={false}
          className="hidden md:block lg:hidden"
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
        {/* PROFILE CARD MOBILE*/}
        <ProfileCard
          name={user?.username}
          handle={user?.username}
          avatarUrl={user?.avatar || "/Assets/Images/Profiles/profile.svg"}
          contactText="Change Photo"
          showUserInfo={true}
          enableTilt={false}
          enableMobileTilt={false}
          className="block md:hidden"
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

        <div className="flex justify-between md:hidden">
          <button
            className={`flex gap-1 items-center border rounded-lg bg-[#2b2b2b90] p-2`}
            onClick={() => {
              setShowDetails(!showDetails);
            }}
          >
            Details{" "}
            <IoIosArrowDown
              className={`${showDetails ? "rotate-180" : "rotate-0"} duration-200 transition-all`}
            />
          </button>
          <button
            className={`flex gap-1 items-center border rounded-lg bg-[#2b2b2b90] p-2`}
            onClick={() => {
              setShowActions(!showActions);
            }}
          >
            Actions{" "}
            <IoIosArrowDown
              className={`${showActions ? "rotate-180" : "rotate-0"} duration-200 transition-all`}
            />
          </button>
        </div>

        {/* FORM SECTION */}
        <div
          className={`${showDetails ? "opacity-100" : "opacity-0 h-0"} grid grid-cols-1 md:grid-cols-2 gap-6`}
        >
          {/* NAME */}
          <div className="block md:hidden space-y-2">
            <div className="text-sm text-gray-300">Name</div>
            <div className="w-full texts-edit border border-[#636363a8] bg-transparent text-gray-300 outline-none p-2 rounded-md cursor-not-allowed">
              {user?.username}
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Email ID</div>
            <div className="w-full border border-[#636363a8] bg-transparent text-gray-300 outline-none p-2 rounded-md cursor-not-allowed">
              {user?.email}
            </div>
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Phone</label>
            <input
              type="text"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              className="w-full border border-[#636363a8] bg-transparent outline-none p-2 rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {/* ADDRESS FULL WIDTH */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-300">Delivery Address</label>
            <textarea
              rows={4}
              className="w-full border border-[#636363a8] bg-transparent outline-none p-2 rounded-md resize-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-center md:justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        {/* FORM SECTION */}
        <div
          className={`${showActions ? "opacity-100" : "opacity-0 h-0"} grid grid-cols-1 md:grid-cols-2 gap-6`}
        >
           <Link href={"/orders"}>
              <div className="profileBox text-center">
                My Orders
              </div>
            </Link>
            <Link href={"/favorites"}>
              <div className="profileBox text-center">
                My Favorites
              </div>
            </Link>
            <Link href={"reset_password"}>
              <div className="profileBox text-center">
                Password Reset
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageClient;
