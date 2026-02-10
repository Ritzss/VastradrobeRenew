import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";

export default function BlogsPage() {
  return (
    <div className="mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Vastra Journal</h1>

      <div className="grid gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="group border rounded-lg p-6 hover:bg-gray-50"
          >
            <div className="relative rounded-lg overflow-hidden w-[99%] h-160 border">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="photo"
                className="rounded-lg"
                priority
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600">{blog.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
