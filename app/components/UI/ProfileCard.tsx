"use client";

import Image from "next/image";
import React, { useRef } from "react";

interface ProfileCardProps {
  avatarUrl: string;
  name?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onAvatarChange?: (file: File) => Promise<void>;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name = "User",
  handle = "username",
  status = "Active",
  contactText = "Change Photo",
  showUserInfo = true,
  onAvatarChange,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={` w-full bg-white rounded-4xl shadow-[0_30px_80px_rgba(149,127,106,0.15)] p-8 flex flex-col md:flex-row items-center gap-8 ${className}`}
    >
      {/* Avatar */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#f3e7d8] shrink-0">
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          fill
          sizes="128px"
          className="object-cover"
          priority
        />
      </div>

      {showUserInfo && (
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-[#5f5143]">{name}</h3>
            <p className="text-sm text-[#7a6a5c]">@{handle}</p>
          </div>

          <div className="text-xs text-[#957f6a]">{status}</div>

          {onAvatarChange && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className=" mt-4 px-6 py-2 rounded-full border border-[#e6d8c8] text-[#5f5143] hover:bg-[#f3e7d8] transition text-sm"
              >
                {contactText}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !onAvatarChange) return;
                  await onAvatarChange(file);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ProfileCard);
