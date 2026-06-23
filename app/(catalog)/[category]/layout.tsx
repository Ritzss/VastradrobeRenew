
import { ReactNode } from "react";
import ClientCatLayout from "./ClientCatLayout";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientCatLayout>
      {children}
    </ClientCatLayout>
  );
};

export default layout;
