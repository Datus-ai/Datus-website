import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// --- Sample data (replace with your own) ---
const CATALOG = ["DataHub", "Amundsen", "Unity Catalog", "AWS Glue"];
const WAREHOUSE = ["StarRocks", "Snowflake", "BigQuery", "Redshift", "Databricks SQL"];
const SCHED = ["Airflow", "Dagster", "Prefect"];
const SEMANTIC = ["MetricFlow", "dbt Semantic Layer", "LookML", "AtScale"];
const BI = ["Looker", "Tableau", "Power BI", "Superset", "Mode"];

const GROUPS = [
  { key: "Catalog", color: "rgba(34,211,238,0.9)", items: CATALOG },
  { key: "Warehouse", color: "rgba(34,197,94,0.95)", items: WAREHOUSE },
  { key: "Scheduler", color: "rgba(234,179,8,0.95)", items: SCHED },
  { key: "Semantic", color: "rgba(59,130,246,0.95)", items: SEMANTIC },
  { key: "BI", color: "rgba(147,51,234,0.95)", items: BI },
] as const;

// Optional logos mapping
const LOGOS: Record<string, string> = {};

function Chip({ label, dashed }: { label: string; dashed?: boolean }) {
  const src = LOGOS[label];
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-full px-3 py-1 ${
        dashed ? "border border-dashed border-white/30 bg-transparent" : "border border-white/10 bg-white/[0.06]"
      }`}
      data-testid={dashed ? "chip-placeholder" : "chip-platform"}
      title={label}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-4 w-4 object-contain" />
      ) : null}
      <span className="text-xs text-white/85">{label}</span>
    </div>
  );
}

export default function DatusLayeredStackHorizontalOnly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [anchors, setAnchors] = useState<{ hub: { x: number; y: number }; cats: { x: number; y: number; color: string }[] }>({ hub: { x: 0, y: 0 }, cats: [] });

  // Measure positions so curves end exactly at each category's top center
  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const h = hubRef.current;
      if (!c || !h) return;
      
      // Get container bounds
      const crect = c.getBoundingClientRect();
      const hrect = h.getBoundingClientRect();
      
      // Hub position: precise center of the card's bottom edge
      const hub = { 
        x: hrect.left + hrect.width / 2 - crect.left, 
        y: hrect.bottom - crect.top + 2 // Add slight offset to ensure lines start from bottom edge
      };
      
      // Category positions: top center of each category block
      const cats = colRefs.current
        .filter(Boolean)
        .slice(0, GROUPS.length + 1) // Include the "+ Add Category" column
        .map((el, i) => {
          if (!el) return null;
          const r = (el as HTMLDivElement).getBoundingClientRect();
          return {
            // Horizontal center of the category block
            x: r.left + r.width / 2 - crect.left,
            // Top edge of the category block
            y: r.top - crect.top,
            // Color for each group (use default for "+ Add Category")
            color: i < GROUPS.length ? GROUPS[i].color : "rgba(255,255,255,0.45)",
          };
        })
        .filter(Boolean) as { x: number; y: number; color: string }[];
      
      setAnchors({ hub, cats });
      setSize({ w: c.clientWidth, h: c.clientHeight });
    };

    // Initial measurement with a slight delay to ensure DOM is fully rendered
    const timeout = setTimeout(measure, 50);
    
    // Set up observers
    const ro = new ResizeObserver(() => {
      // Debounce resize observations
      clearTimeout(timeout);
      setTimeout(measure, 10);
    });
    
    if (containerRef.current) ro.observe(containerRef.current);
    if (hubRef.current) ro.observe(hubRef.current);
    colRefs.current.forEach((el) => el && ro.observe(el));
    
    // Window resize handler
    const handleResize = () => {
      clearTimeout(timeout);
      setTimeout(measure, 50);
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timeout);
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="px-8 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-50">
        <motion.div
          className="h-full w-full"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const colors = [
            "bg-cyan-400/10",
            "bg-blue-400/10", 
            "bg-purple-400/10",
            "bg-violet-400/10",
          ];
          const sizes = ["w-2 h-2", "w-3 h-3", "w-1 h-1"];
          return (
            <motion.div
              key={i}
              className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full border border-white/20`}
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 25 + 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Diagram card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 80 }}
          viewport={{ once: true }}
          ref={containerRef} 
          className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          {/* Top Hub */}
          <div className="mb-6 flex items-center justify-center">
            <div ref={hubRef} className="relative">
              <div className="absolute -inset-5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-white/5 to-indigo-500/20 blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-[#0B1020]/85 px-6 py-3 text-center">
                <div className="text-sm font-semibold text-white">Datus Client</div>
                <div className="text-xs text-white/70">One client to connect everything · unified management & governance</div>
              </div>
            </div>
          </div>

          {/* Connectors overlay (from hub to top-center of each category) */}
          <svg
            className="pointer-events-none absolute left-0 top-0"
            width={size.w}
            height={size.h}
            style={{ overflow: "visible" }}
            aria-hidden
          >
            <defs>
              <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </radialGradient>
            </defs>
            {anchors.cats.map((cat, i) => {
              // Start point: bottom center of hub
              const x1 = anchors.hub.x;
              const y1 = anchors.hub.y;
              
              // End point: top center of category block
              const x2 = cat.x;
              const y2 = cat.y;
              
              // Create smooth curved path from hub to top center of each category
              const controlY = y1 + (y2 - y1) * 0.4; // Control point for smooth curve
              const d = `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${controlY}, ${x2} ${y2}`;
              
              return (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="2.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 1.8, 
                    ease: "easeInOut", 
                    repeat: Infinity, 
                    repeatType: "mirror", 
                    repeatDelay: 0.8, 
                    delay: i * 0.12 
                  }}
                  strokeLinecap="round"
                  strokeDasharray="0"
                />
              );
            })}
            
            {/* Hub connection origin point */}
            <motion.circle
              cx={anchors.hub.x}
              cy={anchors.hub.y}
              r="4"
              fill="url(#hubGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Add connection points at category tops for visual clarity */}
            {anchors.cats.map((cat, i) => (
              <motion.circle
                key={`point-${i}`}
                cx={cat.x}
                cy={cat.y}
                r="3"
                fill={cat.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1], 
                  opacity: [0, 0.8, 0.6] 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              />
            ))}
          </svg>

          {/* Columns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6" data-testid="columns">
            {GROUPS.map((g, idx) => (
              <div
                key={g.key}
                ref={(el) => (colRefs.current[idx] = el)}
                className="rounded-xl border border-white/10 bg-[#0B1020]/60 p-3"
              >
                <div className="mb-2 text-center text-sm font-semibold" style={{ color: g.color }}>
                  {g.key}
                </div>
                <div className="flex flex-col gap-2">
                  {g.items.map((label) => (
                    <Chip key={label} label={label} />
                  ))}
                  {/* Keep only "… and more" */}
                  <Chip label="… and more" dashed />
                </div>
              </div>
            ))}

            {/* + Add Category column (kept) */}
            <div
              ref={(el) => (colRefs.current[GROUPS.length] = el)}
              className="rounded-xl border border-dashed border-white/25 bg-transparent p-3"
              data-testid="new-category"
            >
              <div className="mb-2 text-center text-sm font-semibold text-white/70">+ Add Category</div>
              <div className="flex flex-col gap-2">
                <Chip label="… and more" dashed />
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
