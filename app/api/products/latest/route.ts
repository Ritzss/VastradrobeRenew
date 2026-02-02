import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch IMS products");
    }

    const data = await res.json();

    const latestProducts = data.products
      .filter((p: any) => p.isActive)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 8);

    return NextResponse.json(
      { products: latestProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("LATEST ARRIVALS ERROR:", error);
    return NextResponse.json(
      { products: [] },
      { status: 500 }
    );
  }
}
