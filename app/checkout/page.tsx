import CheckoutClient from "./CheckoutClient";

type PageProps = {
  searchParams: {
    buyNow?: string;
  };
};

const CheckoutPage = async ({ searchParams }: PageProps) => {
  return <CheckoutClient buyNowId={ await (searchParams.buyNow ?? null)} />;
};

export default CheckoutPage;
