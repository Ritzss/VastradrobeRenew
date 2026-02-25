"use client";

import InfiniteScroll from "../Home/InfiniteScroll";


export default function InfiniteScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InfiniteScroll>{children}</InfiniteScroll>;
}