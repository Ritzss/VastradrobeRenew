import { ReactNode } from "react";

const ClientCatLayout = ({ children }: { children: ReactNode }) => {
  // const [showFilter, setShowFilter] = useState(false);

  return (
    <section className="min-h-screen w-full not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      {/* MOBILE */}
      <div className="md:hidden relative">
        {/* <button
          onClick={() => setShowFilter(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-[#6a0f1f] px-6 py-3 text-white shadow-[0_10px_30px_rgba(106,15,31,0.3)]"
        >
          Filters
        </button>

        {showFilter && (
          <SideFilter
            onClose={() => setShowFilter(false)}
            className="bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]"
          />
        )} */}

        <div className="px-6 pt-10 pb-20">{children}</div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex gap-16 px-1">
       


        {/* <aside className="w-72 shrink-0 sticky top-32 self-start">
          <SideFilter />
        </aside> */}

        <main id="categoryPage" className="flex-1 max-w-7xl mx-auto">{children}</main>
      </div>
    </section>
  );
};

export default ClientCatLayout;
