"use client";

import { useEffect, useState } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { api, type ContactMessage } from "@/lib/api";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setMessages(await api.getMessages());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(msg: ContactMessage) {
    await api.markMessageRead(msg._id, !msg.read);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await api.deleteMessage(id);
    load();
  }

  return (
    <div>
      <PageHeader title="Contact Messages" description="Submissions from the portfolio contact form" />
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl border p-5 ${msg.read ? "border-border bg-card" : "border-cyan/30 bg-cyan/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{msg.subject}</h3>
                  <p className="text-sm text-muted">
                    {msg.name} · {msg.email} · {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toggleRead(msg)}>
                    {msg.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(msg._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
