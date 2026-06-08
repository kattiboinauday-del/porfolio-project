import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Code2 } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/", hash: "about" },
  { label: "Skills", to: "/", hash: "skills" },
  { label: "Projects", to: "/", hash: "projects" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/", hash: "contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (hash?: string) => {
    setOpen(false);
    if (!hash) return;
    if (pathname === "/") {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative">
            <Code2 className="h-6 w-6 text-cyan" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan glow-cyan-sm animate-pulse" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Uday <span className="text-gradient">Kiran</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.label}>
              {"hash" in l && l.hash ? (
                <a
                  href={`/#${l.hash}`}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      handleAnchor(l.hash);
                    }
                  }}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  to={l.to}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  activeProps={{ className: "px-3 py-2 text-sm text-cyan" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t">
          <ul className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <li key={l.label}>
                {"hash" in l && l.hash ? (
                  <a
                    href={`/#${l.hash}`}
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        handleAnchor(l.hash);
                      } else {
                        setOpen(false);
                      }
                    }}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
