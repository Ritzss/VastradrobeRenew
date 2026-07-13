
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
     <section className="min-h-screen w-full not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      {/* MOBILE */}
      <div className="md:hidden relative">
        <div className="px-6 pt-10 pb-20">{children}</div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex gap-16 px-1">
        <main id="categoryPage" className="flex-1 max-w-7xl mx-auto">{children}</main>
      </div>
    </section>
  );
};

export default layout;
