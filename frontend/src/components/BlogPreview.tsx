import { Link } from "@tanstack/react-router";
import { Section } from "./Section";
import { ArrowRight, Calendar } from "lucide-react";
import { useBlogPosts } from "@/lib/api/hooks";

export function BlogPreview() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const preview = posts.slice(0, 3);

  return (
    <Section id="blog" eyebrow="Writing" title={<>From the <span className="text-gradient">blog</span></>}>
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {preview.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group glass rounded-2xl p-6 flex flex-col gap-3 hover:border-cyan/50 hover:-translate-y-1 transition-all"
            >
              <p className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </p>
              <h3 className="font-display text-lg font-bold leading-snug group-hover:text-cyan transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {post.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-cyan mt-auto pt-2">
                Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
      <div className="text-center mt-10">
        <Link to="/blog" className="inline-flex items-center gap-2 glass rounded-lg px-5 py-2.5 text-sm hover:border-cyan/50">
          View all posts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
