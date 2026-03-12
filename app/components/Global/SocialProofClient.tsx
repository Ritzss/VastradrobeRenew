"use client";

import dynamic from "next/dynamic";

const SocialProof = dynamic(() => import("../Home/SocialProof"),
  { ssr: false }
);

export default function SocialProofClient() {
  return <SocialProof/>;
}