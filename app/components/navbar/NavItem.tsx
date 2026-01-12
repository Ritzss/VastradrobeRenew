import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const NavItem = ({
  href,
  label,
  Img,
  src,
  active,
  hover,
  activeStyle,
  rounded = "",
  dropdown,
  drop,
}: {
  href: string;
  Img:boolean;
  src:string;
  label: string;
  active: boolean;
  hover: string;
  activeStyle: string;
  rounded?: string;
  dropdown?: ReactNode;
  drop?:boolean;
}) => {
  return (
    <div
      className="group w-full"
    //   onMouseEnter={() => document.body.classList.add("scroll-lock")}
    //   onMouseLeave={() => document.body.classList.remove("scroll-lock")}
    >
      <div
        className={` font-bold text-center transition-all duration-500 bg-clip-text hover:text-transparent 
      ${rounded}
      ${hover}
      ${active ? `${activeStyle} text-transparent` : ""}`}
      >
        <Link href={href}>
        <div className={`w-full ${Img ? "h-25" : "h-3" } flex justify-center overflow-hiddn hover:scale-105 transition-all duration-500`}>
        {Img && <Image src={src} width={100} height={1} alt="q" className="text-[#cd0000]" />}
        </div>
        {label} 
        </Link>
      </div>

      {dropdown && (
        <div className="absolute left-0 z-50 py-1 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          {drop && dropdown}
        </div>
      )}
    </div>
  );
};

export default NavItem;