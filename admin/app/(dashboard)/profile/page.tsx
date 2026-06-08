"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type Profile } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [statsJson, setStatsJson] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getProfile().then((p) => {
      if (p) {
        setProfile(p);
        setRoles(p.roles.join(", "));
        setParagraphs(p.aboutParagraphs.join("\n\n"));
        setStatsJson(JSON.stringify(p.stats, null, 2));
      }
      setLoading(false);
    });
  }, []);

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      await api.updateProfile({
        ...profile,
        roles: roles.split(",").map((r) => r.trim()).filter(Boolean),
        aboutParagraphs: paragraphs.split("\n\n").map((p) => p.trim()).filter(Boolean),
        stats: JSON.parse(statsJson),
      });
      alert("Profile saved!");
    } catch {
      alert("Failed to save. Check stats JSON format.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <PageHeader title="Profile" description="Hero and about section content" />
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1.5">Name</label>
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Roles (comma-separated)</label>
          <input value={roles} onChange={(e) => setRoles(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Hero Tagline</label>
          <input value={profile.heroTagline} onChange={(e) => setProfile({ ...profile, heroTagline: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Hero Description</label>
          <textarea rows={2} value={profile.heroDescription} onChange={(e) => setProfile({ ...profile, heroDescription: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">About Paragraphs (blank line separated)</label>
          <textarea rows={5} value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Stats (JSON)</label>
          <textarea rows={6} value={statsJson} onChange={(e) => setStatsJson(e.target.value)} className="font-mono text-xs" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Availability</label>
          <input value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Initials</label>
          <input value={profile.initials} onChange={(e) => setProfile({ ...profile, initials: e.target.value })} />
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
      </div>
    </div>
  );
}
