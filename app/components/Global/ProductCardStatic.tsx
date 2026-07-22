import Image from "next/image";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";

type Props = {
  product: IMSProduct;
  className?: string;
  classNameInner?: string;
  latest?: boolean;
  text: string;
  children?: React.ReactNode;
};

export default function ProductCardStatic({
  product,
  className,
  classNameInner,
  text,
  latest,
  children,
}: Props) {
  const firstVariant = product.variants?.[0];
const firstDesign = firstVariant?.designs?.[0];

const imageSrc =
  firstDesign?.images?.[0] ||
  firstVariant?.images?.[0] ||
  "/Assets/Images/Newplaceholder.png";

  return (
    <div className={`flex flex-col group ${className ?? ""}`}>
      <Link
      title={product.name}
        href={`/product/${product.productId}`}
        className="flex flex-col w-full"
      >
        <div
          className={`relative aspect-3/4 w-full rounded-xl overflow-hidden bg-[#f5f1e7] ${classNameInner ?? ""}`}
        >
          {latest && <span className="absolute top-2 left-3 z-9 rounded-lg text-xs p-0.5 tracking-[0.15em] text-center bg-white text-shadow-[2px_0_10px_#ff0000] text-red-500">NEW</span>}
          <Image
            src={imageSrc}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            alt={product.name}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4 text-center">
        <p title={product.name} className={`text-[14px] font-medium text-${text} text-[#5f5143] line-clamp-2`}>{product.name}</p>

        {product.price && (
          <p className={`mt-1 text-[13px] text-[#957f6a] text-${text}`}>₹{product.price}</p>
        )}
      </div>

      {children}
    </div>
  );
}
