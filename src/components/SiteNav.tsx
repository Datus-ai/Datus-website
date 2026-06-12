import { ChevronDown, Github, Menu, Star, X } from "lucide-react";
import { useState } from "react";
import {
  GITHUB_URL,
  NAV,
  STUDIO_URL,
  type NavItem,
} from "../config/nav";
import { formatStarCount, useGitHubStars } from "../hooks/useGitHubStars";

function extAttrs(external?: boolean) {
  return external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

function NavEntry({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <a className="nav-link" href={item.href} {...extAttrs(item.external)}>
        {item.label}
      </a>
    );
  }
  return (
    <div className="nav-dd">
      <button className="nav-link" type="button" aria-haspopup="true">
        {item.label}
        <ChevronDown size={15} />
      </button>
      <div className="nav-dd__menu" role="menu">
        {item.children.map((child) => (
          <a
            key={child.label}
            className="nav-dd__item"
            href={child.href}
            {...extAttrs(child.external)}
            role="menuitem"
          >
            <span className="nav-dd__item-title">{child.label}</span>
            {child.description && (
              <span className="nav-dd__item-desc">{child.description}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SiteNav() {
  const stars = useGitHubStars();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__logo" href="/" aria-label="Datus home">
          <img src="/logo_dark.svg" alt="Datus" />
        </a>

        <nav className="site-nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <NavEntry key={item.label} item={item} />
          ))}
        </nav>

        <div className="site-nav__spacer" />

        <a
          className="nav-ghost-btn"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={15} />
          <span className="star">
            <Star size={13} fill="currentColor" />
          </span>
          {formatStarCount(stars)}
        </a>

        <a className="btn btn-primary btn-sm" href={STUDIO_URL}>
          Get started
        </a>

        <button
          className="site-nav__burger"
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: `var(--nav-h) 0 0 0`,
        zIndex: 49,
        background: "rgba(7,11,31,0.97)",
        backdropFilter: "blur(10px)",
        padding: "20px 24px 40px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div style={{ display: "grid", gap: 6 }}>
        {NAV.map((item) =>
          item.children ? (
            <div key={item.label} style={{ padding: "10px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--ink-faint)",
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              {item.children.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...extAttrs(c.external)}
                  style={{
                    display: "block",
                    padding: "10px 0",
                    fontSize: 16,
                    color: "var(--ink-dim)",
                  }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          ) : (
            <a
              key={item.label}
              href={item.href}
              {...extAttrs(item.external)}
              style={{
                padding: "14px 0",
                fontSize: 18,
                fontWeight: 600,
                borderBottom: "1px solid var(--line)",
              }}
            >
              {item.label}
            </a>
          ),
        )}
        <a
          className="btn btn-primary btn-lg"
          href={STUDIO_URL}
          style={{ marginTop: 18 }}
        >
          Get started — free
        </a>
      </div>
    </div>
  );
}
