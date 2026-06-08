"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { BlogForm } from "@/components/BlogForm";
import { api, type BlogPost } from "@/lib/api";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    api.getBlogPosts().then((posts) => setPost(posts.find((p) => p._id === id) ?? null));
  }, [id]);

  if (!post) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <PageHeader title="Edit Blog Post" />
      <BlogForm
        initial={post}
        onSubmit={async (data) => {
          await api.updateBlogPost(id, data);
          router.push("/blog");
        }}
      />
    </div>
  );
}
