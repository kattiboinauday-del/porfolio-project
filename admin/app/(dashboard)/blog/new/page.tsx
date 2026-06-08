"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { BlogForm } from "@/components/BlogForm";
import { api } from "@/lib/api";

export default function NewBlogPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="New Blog Post" />
      <BlogForm
        onSubmit={async (data) => {
          await api.createBlogPost(data);
          router.push("/blog");
        }}
      />
    </div>
  );
}
