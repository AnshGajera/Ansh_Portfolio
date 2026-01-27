"use client";
import React, { useEffect, useState } from "react";
import { fetchBlogs, BackendBlog } from "@/lib/api";
import { Loader2, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function Page() {
  const [blogs, setBlogs] = useState<BackendBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const data = await fetchBlogs();
        // Filter only active blogs
        const activeBlogs = data.filter((b) => b.active !== false);
        setBlogs(activeBlogs);
      } catch (err) {
        setError("Failed to load blogs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-[50px] xl:px-[200px] text-zinc-300 pt-20 pb-20 min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-b from-white/80 to-white/20">
        Blog
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <span className="ml-2 text-zinc-500">Loading blogs...</span>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="flex flex-col justify-center items-center h-64">
          <h2 className="text-3xl text-zinc-500 mb-4">No blog posts yet!</h2>
          <p className="text-zinc-600">Check back soon for updates.</p>
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

const BlogCard = ({ blog }: { blog: BackendBlog }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
      {/* Image */}
      {blog.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            unoptimized={blog.image.startsWith("http")}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>

          {blog.link && (
            <Link
              href={blog.link}
              target="_blank"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              Read more
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
