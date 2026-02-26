import Image from "next/image";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";

type Props = {
  product: IMSProduct;
  className?: string;
  height?: string;
  classNameInner?: string;
  children?: React.ReactNode;
};

export default function ProductCardStatic({
  product,
  className,
  height,
  classNameInner,
  children,
}: Props) {
  const imageSrc =
    product.images?.[0] || "/Assets/Images/Newplaceholder.png";

  return (
    <div
      className={`cardBlock ${
        height ?? "h-[55vh]"
      } overflow-x-hidden flex flex-col rounded-2xl my-2 ${
        className ?? ""
      }`}
    >
      <Link
        href={`/product/${product.productId}`}
        className="group flex flex-col w-full"
      >
        <div
          className={`relative  ${classNameInner ?? "h-[50vh]"} border-2 border-black aspect-3/4 overflow-hidden w-full`}
        >
          <Image
            src={imageSrc}
            fill
            priority
            sizes="(max-width: 768px) 50vw, 25vw"
            alt={product.name}
            className="object group-hover:scale-105 duration-500 transition-all"
          />
        </div>

      </Link>
        {children}
    </div>
  );
}