import { useEffect, useRef, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import Footer from "./Footer";
import SiteNav from "./SiteNav";
import { useT, useCurrentPath } from "../i18n/LocaleContext";
import { UI } from "../i18n/ui";
import "../styles/site.css";
import "../styles/nordic-site.css";
import "../styles/section-reveal.css";
import { setupSectionReveals } from "../lib/section-reveal";
import { setupStudioCampaignHandoff } from "../lib/studio-campaign";

export default function SiteLayout({ children, className = "", logoSrc, navControls }: { children: ReactNode; className?: string; logoSrc?: string; navControls?: ReactNode }) {
  // Match the light prerendered shell; only an explicit saved dark choice wins.
  const [dark, setDark] = useState(false);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>root.current?setupSectionReveals(root.current):undefined,[]);
  useEffect(()=>root.current?setupStudioCampaignHandoff(root.current):undefined,[]);
  const labels = useT(UI).theme;
  const path = useCurrentPath();
  const graphic = path.includes("products") ? "context-layers" : path.includes("osi") ? "semantic-lens" : path.includes("pricing") ? "shared-definition" : path.includes("faq") ? "evolving-context" : "relationship-map";
  useEffect(() => {
    let next = false;
    try { next = localStorage.getItem("datus-home-theme") === "dark"; } catch { /* Light is also the storage-free default. */ }
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("datus-home-theme", next ? "dark" : "light"); } catch { /* Retain the in-session choice. */ }
  }
  const logo = logoSrc || (dark ? "/logo_dark.svg" : "/logo_light.svg");
  const label = dark ? labels.toLight : labels.toDark;
  return <div ref={root} className={`site-root nordic-site ${className}`}>
    <SiteNav logoSrc={logo} controls={<><button className="nordic-theme-toggle" type="button" onClick={toggle} title={label} aria-label={label} aria-pressed={dark}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>{navControls}</>}/>
    <main data-graphic={graphic}>{children}</main><Footer logoSrc={logo}/>
  </div>;
}
