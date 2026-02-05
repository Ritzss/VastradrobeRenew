import CheckoutClient from "./CheckoutClient";

type PageProps = {
  searchParams: {
    buyNow?: string;
  };
};

const CheckoutPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  return <CheckoutClient buyNowId={params.buyNow ?? null} />;
};

export default CheckoutPage;
