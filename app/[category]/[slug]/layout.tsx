import { ReactNode } from "react";
// import Link from "next/link";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <section className="min-h-screen w-full bg-[#f9f5ef]">
        {children}
    </section>
  );
};

export default layout;