import CheckoutClient from "./CheckoutClient";

type PageProps = {
  searchParams: {
    buyNow?: string;
  };
};

const CheckoutPage = ({ searchParams }: PageProps) => {
  return <CheckoutClient buyNowId={searchParams.buyNow ?? null} />;
};

export default CheckoutPage;
