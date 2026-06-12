import type { ReactNode } from "react";
import Footer from "./Footer";
import SiteNav from "./SiteNav";

/**
 * Single source of truth for the page chrome (nav + footer) shared by every
 * marketing page. Wrap each page's content in <SiteLayout>.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-root">
      <SiteNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
