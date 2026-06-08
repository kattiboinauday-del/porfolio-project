"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type SiteSettings } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert("Settings saved!");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <PageHeader title="Site Settings" description="Contact info and social links" />
      <div className="max-w-2xl space-y-4">
        {(["email", "phone", "github", "linkedin", "resumeUrl", "footerText"] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs text-muted mb-1.5 capitalize">{field}</label>
            <input
              value={settings[field]}
              onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </div>
    </div>
  );
}
