'use client'

;
import { blogs } from "../lib/blog";
import AnimatedList from "../components/UI/AnimatedList";

interface BlogClientProps {
  limit?: number;
  showTitle?: boolean;
}

const BlogClient = ({ limit, showTitle = true }: BlogClientProps) => {
  const items = limit ? blogs.slice(0, limit) : blogs;

  return (
    <div className="mx-auto py-5">
      {showTitle && (
        <h1 className="text-5xl text-[#6a0f1f] text-center font-bold mb-10">
          Vastra Journal
        </h1>
      )}

      <AnimatedList
        items={items}
        itemClassName="lg:flex md:block gap-5 justify-evenly p-5"
        displayScrollbar={false}
      />
    </div>
  );
};


export default BlogClient;