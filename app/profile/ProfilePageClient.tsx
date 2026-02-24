"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/UI/ProfileCard";
import { toast } from "sonner";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";

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
  <div className="w-[220px] h-[220px] relative">
    <Image
      src={"https://res.cloudinary.com/dwhn5ec09/image/upload/w_400,q_auto,f_auto/v1771932441/profile_etqzif.svg"}
      alt="User avatar"
      fill
      sizes="220px"
      priority
    />
  </div>
);










};

export default ProfilePageClient;
