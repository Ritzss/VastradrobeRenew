import ProfilePageClient from "../components/auth/ProfilePageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

const ProfilePage = () => {
  return (
    <ProfilePageClient defaultImage="https://res.cloudinary.com/dwhn5ec09/image/upload/w_400,q_auto,f_auto/v1771932441/profile_etqzif.svg" />
  )
};

export default ProfilePage;
