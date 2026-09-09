import Hero from "@/components/trade/Hero";
import WhyTrade from "@/components/trade/WhyTrade";
import ShopByBusiness from "@/components/trade/ShopByBusiness";
import NewCollectionBanner from "@/components/trade/NewCollectionBanner";
import TradeCollections from "@/components/trade/TradeCollections";
import HowTradeWorks from "@/components/trade/HowTradeWorks";

export default function TradeLandingPage() {
  return (
    <>
      <Hero />
      <WhyTrade />
      <ShopByBusiness />
      <NewCollectionBanner />
      <TradeCollections />
      <HowTradeWorks />
    </>
  );
}
