import Link from "next/link";
import Image from "next/image";
import { landingPages } from "@/Data/LandingPges";



export default function LandingPageDirectory() {
  return (
    <main className="min-h-screen bg-[#f4f1eb] px-6 py-28 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-sm tracking-[0.3em] text-neutral-500 uppercase mb-3">
            Vastradrobe Campaigns
          </p>

          <h1 className="text-5xl md:text-6xl font-light text-neutral-900">
            Landing Pages
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {landingPages.map((page) => (
            <Link
              key={page.slug}
              href={`/lp/${page.slug}/index.html`}
              className="group bg-white rounded-[28px] overflow-hidden border border-neutral-200 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <Image
                  src={page.image}
                  alt={page.title}
                  width={400}
                  height={340}
                  className="h-85 w-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-7">
                <h2 className="text-3xl font-semibold text-neutral-900 mb-3">
                  {page.title}
                </h2>

                <p className="text-neutral-500 text-base leading-relaxed">
                  {page.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-neutral-400">
                    vastradrobe.com
                  </span>

                  <span className="text-sm font-medium text-neutral-900 group-hover:translate-x-1 transition">
                    Open →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}