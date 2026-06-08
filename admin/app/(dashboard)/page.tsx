"use client";

import { useEffect, useState } from "react";
import { FileText, FolderKanban, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ posts: 0, projects: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Blog Posts", value: stats.posts, icon: FileText },
    { label: "Projects", value: stats.projects, icon: FolderKanban },
    { label: "Unread Messages", value: stats.unreadMessages, icon: Mail },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your portfolio content" />
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-5 w-5 text-cyan mb-3" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
