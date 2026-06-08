import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { BlogPost as BlogPostType } from "@/lib/blog-data";
import { fetchBlogPost } from "@/lib/api/client";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — K. Uday Kiran` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Post not found</h1>
        <Link to="/blog" className="text-cyan hover:underline">← Back to blog</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData() as { post: BlogPostType };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-16">
        <article className="mx-auto max-w-3xl px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-cyan hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> K. Uday Kiran
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((t) => (
              <span key={t} className="rounded-md bg-secondary/60 px-2.5 py-1 text-xs font-mono text-cyan">
                {t}
              </span>
            ))}
          </div>

          <div className="prose-content space-y-5 text-foreground/90 leading-relaxed">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("# ")) {
                return null;
              }
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-display text-2xl font-bold mt-10 mb-2 text-foreground">
                    {block.replace(/^## /, "")}
                  </h2>
                );
              }
              if (block.startsWith("- ") || block.startsWith("1. ")) {
                const items = block.split("\n").map((l) => l.replace(/^(-|\d+\.)\s*/, ""));
                const Ordered = block.startsWith("1. ");
                return Ordered ? (
                  <ol key={i} className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    {items.map((it, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
                    ))}
                  </ol>
                ) : (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {items.map((it, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={i}
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderInline(block) }}
                />
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function renderInline(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
}
