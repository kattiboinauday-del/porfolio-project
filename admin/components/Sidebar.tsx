"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Wrench,
  Briefcase,
  User,
  Settings,
  Mail,
  LogOut,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/messages", label: "Messages", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card min-h-screen flex flex-col">
      <div className="p-5 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-wider text-cyan">Admin</p>
        <h1 className="font-semibold text-lg mt-1">K. Uday Kiran</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-cyan/10 text-cyan" : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
