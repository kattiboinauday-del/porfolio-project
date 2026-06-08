import { useState } from "react";
import { Section } from "./Section";
import { Mail, Phone, Github, Send, Linkedin } from "lucide-react";
import { useSettings } from "@/lib/api/hooks";
import { api } from "@/lib/api/client";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: settings } = useSettings();

  const email = settings?.email ?? "kattiboinauday@gmail.com";
  const phone = settings?.phone ?? "+91 70321 75773";
  const github = settings?.github ?? "https://github.com/kattiboinauday-del";
  const linkedin = settings?.linkedin || "#";

  return (
    <Section id="contact" eyebrow="Contact" title={<>Let's build <span className="text-gradient">something together</span></>}>
      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const form = e.target as HTMLFormElement;
            const fd = new FormData(form);
            try {
              await api.submitContact({
                name: fd.get("name") as string,
                email: fd.get("email") as string,
                subject: fd.get("subject") as string,
                message: fd.get("message") as string,
              });
              setSent(true);
              setTimeout(() => setSent(false), 4000);
              form.reset();
            } catch {
              setError("Failed to send message. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
          className="glass rounded-2xl p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Subject" name="subject" required />
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={2000}
              className="w-full rounded-lg bg-background/40 border border-border focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none px-4 py-3 text-sm transition-all resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-background glow-cyan-sm hover:glow-cyan transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sent ? "Message Sent!" : loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="space-y-3">
          <ContactCard icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
          <ContactCard icon={Phone} label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, "")}`} />
          <ContactCard icon={Github} label="GitHub" value={github.replace("https://github.com/", "")} href={github} />

          <div className="glass rounded-xl p-4 flex items-center justify-around">
            <a href={github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-cyan transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href={linkedin} className="text-muted-foreground hover:text-cyan transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-cyan transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={255}
        className="w-full rounded-lg bg-background/40 border border-border focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none px-4 py-2.5 text-sm transition-all"
      />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="glass rounded-xl p-4 flex items-center gap-4 hover:border-cyan/40 transition-colors group">
      <div className="rounded-lg bg-cyan/10 p-2.5 text-cyan group-hover:bg-cyan group-hover:text-background transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </a>
  );
}
