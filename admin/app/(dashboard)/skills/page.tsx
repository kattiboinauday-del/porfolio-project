"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type SkillGroup } from "@/lib/api";

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [editing, setEditing] = useState<Partial<SkillGroup> | null>(null);
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setSkills(await api.getSkills());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(s?: SkillGroup) {
    setEditing(s ?? { icon: "Brain", title: "", items: [], order: 0 });
    setItems(s?.items?.join(", ") ?? "");
  }

  async function save() {
    if (!editing) return;
    const data = { ...editing, items: items.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editing._id) await api.updateSkill(editing._id, data);
    else await api.createSkill(data);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill group?")) return;
    await api.deleteSkill(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Skills" />
        <Button onClick={() => startEdit()}><Plus className="h-4 w-4" /> Add Group</Button>
      </div>

      {editing && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-3 max-w-2xl">
          <input placeholder="Icon (Lucide name)" value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
          <input placeholder="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input placeholder="Items (comma-separated)" value={items} onChange={(e) => setItems(e.target.value)} />
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
          {skills.map((s) => (
            <div key={s._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted">{s.items.join(" · ")}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="danger" onClick={() => handleDelete(s._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
