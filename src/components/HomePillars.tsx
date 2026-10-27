import { Network, Bot, ScanLine } from "lucide-react";
import type { HomeCopy } from "../content/home";
import "../styles/home-pillars.css";

export default function HomePillars({ t }: { t: HomeCopy["pillars"] }) {
  const icons = [Network, Bot, ScanLine];
  return <div className="nordic-pillar-columns">
    {t.items.map((item,index)=>{const Icon=icons[index];return <article key={item.name}>
      <Icon className="nordic-pillar-column-icon" size={30} strokeWidth={1.5} aria-hidden="true"/>
      <h3>{item.name}</h3>
      <p>{item.caption}</p>
    </article>})}
  </div>;
}
