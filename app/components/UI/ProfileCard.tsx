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

/**
 * 👑 LUXURY REDESIGN: Profile Header Card (Nangalia Ruchira Theme)
 *
 * Styled for premium, minimal layout:
 * - Geometric shape: Swapped muddy background and borders for clean neutral lines.
 * - Colors: Synchronized with the Single-Theme luxury look.
 * - Status tag: Elegant micro-pill indicator.
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name = "User",
  handle = "username",
  status = "Active Account",
  contactText = "Change Photo",
  showUserInfo = true,
  onAvatarChange,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`w-full bg-white dark:bg-neutral-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 select-none ${className}`}
    >
      {/* Avatar (Crisp circular crop with clean boundary) */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900 shrink-0 shadow-xs">
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          fill
          sizes="112px"
          className="object-cover pointer-events-none select-none"
          priority
          draggable={false}
        />
      </div>

      {showUserInfo && (
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h3 className="font-serif text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide leading-tight">
              {name}
            </h3>
            <p className="text-xs text-neutral-400 font-sans tracking-wide mt-1">
              @{handle}
            </p>
          </div>

          <div>
            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-widest shadow-inner">
              {status}
            </span>
          </div>

          {onAvatarChange && (
            <div className="pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:border-[#6A0F1F] hover:text-[#6A0F1F] dark:hover:border-[#e4e198] dark:hover:text-[#e4e198] bg-white dark:bg-neutral-950 transition duration-200 cursor-pointer shadow-xs"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ProfileCard);
