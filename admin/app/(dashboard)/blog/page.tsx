"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type BlogPost } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setPosts(await api.getBlogPosts());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await api.deleteBlogPost(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Blog Posts" description="Manage portfolio blog content" />
        <Link href="/blog/new">
          <Button>
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-muted">{post.date} · /{post.slug}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/blog/${post._id}/edit`}>
                  <Button variant="secondary">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(post._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
