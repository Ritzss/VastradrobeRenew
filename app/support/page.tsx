import WhatsAppPageMessage from "@/components/Global/WhatsAppPageMessage";
import SupportPageClient from "../components/Global/SupportPageClient";
import { whatsappMessages } from "@/lib/whatsapp";

const SupportPage = () => {
  return (
    <>
      <WhatsAppPageMessage message={whatsappMessages.home()} />
      <SupportPageClient />
    </>
  );
};

export default SupportPage;
