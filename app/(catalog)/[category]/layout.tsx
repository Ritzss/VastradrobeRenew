
import { ReactNode } from "react";
import ClientCatLayout from "../../components/products/ClientCatLayout";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientCatLayout>
      {children}
    </ClientCatLayout>
  );
};

export default layout;
