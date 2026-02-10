import { notFound } from "next/navigation";
import Image from "next/image";
import { blogs } from "@/lib/blog";

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    const blog = blogs.find((b) => b.slug === resolvedParams.slug);
  if (!blog) return notFound();

  return (
    <article className=" px-6 py-12 prose prose-lg">
      <h1>{blog.title}</h1>

      <div className="relative rounded-lg overflow-hidden w-[99%] h-90 border">
        <Image
        src={blog.coverImage}
        alt={blog.title}
       fill
       sizes="photo"
        className="rounded-lg"
        priority
      />
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
