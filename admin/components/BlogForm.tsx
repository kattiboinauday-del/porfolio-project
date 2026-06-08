"use client";

import { useState } from "react";
import { Button } from "./Button";
import type { BlogPost } from "@/lib/api";

type Props = {
  initial?: Partial<BlogPost>;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
};

export function BlogForm({ initial, onSubmit }: Props) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        slug,
        title,
        date,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        content,
        published,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted mb-1.5">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Excerpt</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Tags (comma-separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Content (markdown)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
    </form>
  );
}
