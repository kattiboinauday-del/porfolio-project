"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type Project } from "@/lib/api";

const empty: Partial<Project> = {
  title: "",
  period: "",
  stack: "",
  description: "",
  tags: [],
  github: "",
  order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setProjects(await api.getProjects());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p?: Project) {
    setEditing(p ?? { ...empty });
    setTags(p?.tags?.join(", ") ?? "");
  }

  async function save() {
    if (!editing) return;
    const data = {
      ...editing,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editing._id) await api.updateProject(editing._id, data);
    else await api.createProject(data);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await api.deleteProject(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Projects" />
        <Button onClick={() => startEdit()}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      {editing && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-3 max-w-2xl">
          <input placeholder="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input placeholder="Period" value={editing.period ?? ""} onChange={(e) => setEditing({ ...editing, period: e.target.value })} />
          <input placeholder="Stack" value={editing.stack ?? ""} onChange={(e) => setEditing({ ...editing, stack: e.target.value })} />
          <textarea placeholder="Description" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <input placeholder="GitHub URL" value={editing.github ?? ""} onChange={(e) => setEditing({ ...editing, github: e.target.value })} />
          <input type="number" placeholder="Order" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-muted">{p.period}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="danger" onClick={() => handleDelete(p._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
