"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type ExperienceEntry } from "@/lib/api";

export default function ExperiencePage() {
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [editing, setEditing] = useState<Partial<ExperienceEntry> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setEntries(await api.getExperience());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(e?: ExperienceEntry) {
    setEditing(e ?? { type: "internship", title: "", organization: "", period: "", description: "", order: 0 });
  }

  async function save() {
    if (!editing) return;
    if (editing._id) await api.updateExperience(editing._id, editing);
    else await api.createExperience(editing);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    await api.deleteExperience(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Experience & Education" />
        <Button onClick={() => startEdit()}><Plus className="h-4 w-4" /> Add Entry</Button>
      </div>

      {editing && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-3 max-w-2xl">
          <select value={editing.type ?? "internship"} onChange={(e) => setEditing({ ...editing, type: e.target.value as "internship" | "education" })}>
            <option value="internship">Internship</option>
            <option value="education">Education</option>
          </select>
          <input placeholder="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input placeholder="Organization" value={editing.organization ?? ""} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} />
          <input placeholder="Period" value={editing.period ?? ""} onChange={(e) => setEditing({ ...editing, period: e.target.value })} />
          <input placeholder="Location" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          <textarea placeholder="Description" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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
          {entries.map((e) => (
            <div key={e._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">{e.title} · {e.organization}</h3>
                <p className="text-sm text-muted capitalize">{e.type} · {e.period}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(e)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="danger" onClick={() => handleDelete(e._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
