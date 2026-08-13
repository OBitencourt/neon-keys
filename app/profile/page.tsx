"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileNavItem } from "@/src/components/profileNavItem";
import { ProfileSidebar } from "@/src/components/profileSidebar";

export default function ProfilePage() {
  const [name, setName] = useState("Neon Player");
  const [email, setEmail] = useState("neonplayer@gmail.com");
  const [dateOfBirth, setDateOfBirth] = useState("2004-07-29");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSaveChanges() {
    /*
     * FUTURO:
     *
     * PUT /api/user/profile
     *
     * {
     *   name,
     *   email,
     *   dateOfBirth
     * }
     */

    console.log({
      name,
      email,
      dateOfBirth,
    });
  }

  function handleUpdatePassword() {
    /*
     * FUTURO:
     *
     * POST /api/user/change-password
     *
     * {
     *   currentPassword,
     *   newPassword
     * }
     */

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    console.log({
      currentPassword,
      newPassword,
    });
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-neon-white lg:text-5xl">
          Your profile
        </h1>

        <p className="mt-1 text-sm text-neon-gray lg:text-base">
          manage your personal information and account preferences.
        </p>
      </header>

      <section className="rounded-xl bg-neon-gradient p-[1.5px]">
        <div
          className="
                flex
                flex-col
                gap-5
                rounded-xl
                bg-black
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                lg:p-6
              "
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-neon-gradient p-0.5">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neon-gray">
                <span className="text-3xl">🦊</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-neon-white lg:text-xl">
                Neon Player
              </h2>

              <p className="mt-1 text-xs text-neon-gray">
                member since May 16, 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-lg
                  bg-neon-gradient
                  p-[1.5px]
                "
          >
            <span
              className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-black
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-neon-white
                    transition
                    opacity-100
                    hover:opacity-30
                    lg:px-6
                    lg:py-3
                    lg:text-base
                  "
            >
              <Image src="/pink-camera.svg" alt="" width={21} height={21} />
              CHANGE PHOTO
            </span>
          </button>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-xl bg-neon-gradient p-[1.5px]">
          <div className="rounded-xl bg-black p-6">
            <h2 className="text-base font-bold text-neon-white lg:text-lg">
              Personal information
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              <ProfileInput label="Name" value={name} onChange={setName} />

              <ProfileInput
                label="Email address"
                value={email}
                onChange={setEmail}
                disabled
              />

              <ProfileInput
                label="Date of birth"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 mb-10">
              <button
                type="button"
                onClick={() => {
                  setName("Neon Player");
                  setEmail("neonplayer@gmail.com");
                  setDateOfBirth("2004-07-29");
                }}
                className="rounded-lg bg-neon-gradient p-[1.5px]"
              >
                <span
                  className="
                        flex
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-black
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-neon-white
                        transition-colors
                        hover:bg-neon-white/5
                      "
                >
                  CANCEL
                </span>
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="
                      rounded-lg
                      bg-neon-gradient
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-neon-white
                      transition-opacity
                      hover:opacity-90
                    "
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-neon-gradient p-[1.5px]">
          <div className="rounded-xl bg-black p-6">
            <h2 className="text-base font-bold text-neon-white lg:text-lg">
              Change Password
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              <ProfileInput
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <ProfileInput
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <ProfileInput
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleUpdatePassword}
                className="mt-5 mb-4 rounded-lg bg-neon-gradient p-[1.5px]"
              >
                <span
                  className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-black
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-neon-white
                        transition-colors
                        hover:bg-neon-white/5
                      "
                >
                  UPDATE PASSWORD
                </span>
              </button>
            </div>

            <Link
              href="/forgot-password"
              className="
                    mt-2
                    block
                    text-center
                    text-xs
                    text-neon-pink
                    underline
                    transition-colors
                    hover:text-neon-white
                  "
            >
              forget your password?
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      {/* Label */}
      <span className="text-sm text-neon-white">{label}</span>

      {/* Input */}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`
          w-full
          rounded-md
          border
          border-neon-gray
          bg-black
          px-3
          py-2.5
          text-sm
          text-neon-white
          outline-none
          transition-colors
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "focus:border-neon-pink"
          }
        `}
      />
    </label>
  );
}
