import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBlogPosts } from "@/lib/api/hooks";
import { Search, Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — K. Uday Kiran" },
      { name: "description", content: "Notes on computer vision, AI/ML, networking, and the side projects I'm building." },
      { property: "og:title", content: "Blog — K. Uday Kiran" },
      { property: "og:description", content: "Notes on computer vision, AI/ML, and side projects." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort(),
    [blogPosts],
  );

  const filtered = blogPosts.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesTag = !activeTag || p.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-3">Blog</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Notes from the <span className="text-gradient">workbench</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">
            Deep dives into the projects, papers, and problems I'm tinkering with.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                maxLength={100}
                className="w-full glass rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                !activeTag ? "bg-cyan text-background" : "glass hover:border-cyan/50"
              }`}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                  activeTag === t ? "bg-cyan text-background" : "glass hover:border-cyan/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group glass rounded-2xl p-6 hover:border-cyan/50 hover:-translate-y-0.5 transition-all"
                >
                  <p className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </p>
                  <h2 className="font-display text-xl md:text-2xl font-bold mb-2 group-hover:text-cyan transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.tags.map((t) => (
                      <span key={t} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-1 text-sm text-cyan">
                      Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No posts match your search.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
