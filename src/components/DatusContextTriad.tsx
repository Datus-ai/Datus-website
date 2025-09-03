import React from "react";
import { motion } from "motion/react";

export default function DatusContextTriad() {
  return (
      <div className="relative w-full max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">

        {/* Diagram */}
        <div className="relative mx-auto aspect-[16/10] w-full max-w-[960px]">
          <svg viewBox="0 0 960 600" className="h-full w-full">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                <stop offset="60%" stopColor="rgba(34,211,238,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Center circle */}
            <circle cx="480" cy="300" r="130" fill="url(#centerGlow)" />
            <motion.circle
              cx={480}
              cy={300}
              r={86}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.6}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", repeatDelay: 0.6 }}
            />
            <text x="480" y="300" textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="#fff" fontWeight="600">
              AI Context
            </text>

            {/* Nodes */}
            {/* A: Capture (top) */}
            <g transform="translate(480, 70)">
              <circle r="70" fill="rgba(34,211,238,0.14)" stroke="rgba(34,211,238,0.5)" strokeWidth="1.6" />
              <text textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600">
                <tspan x="0" y="-2">Automatic</tspan>
                <tspan x="0" y="12">Context</tspan>
                <tspan x="0" y="26">Capture</tspan>
              </text>
            </g>
            {/* B: Memory (bottom-left) */}
            <g transform="translate(210, 460)">
              <circle r="70" fill="rgba(217,70,239,0.14)" stroke="rgba(217,70,239,0.5)" strokeWidth="1.6" />
              <text textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600">
                <tspan x="0" y="-5">Enhanced</tspan>
                <tspan x="0" y="9">Long‑term</tspan>
                <tspan x="0" y="23">Memory</tspan>
              </text>
            </g>
            {/* C: Evolve (bottom-right) */}
            <g transform="translate(750, 460)">
              <circle r="70" fill="rgba(99,102,241,0.14)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.6" />
              <text textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600">
                <tspan x="0" y="-5">Evolving</tspan>
                <tspan x="0" y="9">Context</tspan>
                <tspan x="0" y="23">Engineering</tspan>
              </text>
            </g>

            {/* Simple straight arrows forming a loop (A -> B -> C -> A) */}
            <defs>
              <marker id="arrowhead-cyan" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(34,211,238,0.75)" />
              </marker>
              <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(217,70,239,0.75)" />
              </marker>
              <marker id="arrowhead-indigo" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(99,102,241,0.8)" />
              </marker>
            </defs>
            
            {/* Capture -> Memory */}
            <line
              x1="430" y1="130"
              x2="260" y2="400"
              stroke="rgba(34,211,238,0.75)"
              strokeWidth="2.4"
              markerEnd="url(#arrowhead-cyan)"
            />
            
            {/* Memory -> Evolve */}
            <line
              x1="280" y1="460"
              x2="680" y2="460"
              stroke="rgba(217,70,239,0.75)"
              strokeWidth="2.4"
              markerEnd="url(#arrowhead-purple)"
            />
            
            {/* Evolve -> Capture */}
            <line
              x1="700" y1="410"
              x2="530" y2="140"
              stroke="rgba(99,102,241,0.8)"
              strokeWidth="2.4"
              markerEnd="url(#arrowhead-indigo)"
            />
          </svg>
        </div>

        {/* Enhanced Caption */}
        <div className="mt-6 text-center text-sm text-white/70 space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 font-medium">Capture</span>
            </div>
            <span className="text-white/40">→</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 font-medium">Memory</span>
            </div>
            <span className="text-white/40">→</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-indigo-300 font-medium">Evolve</span>
            </div>
          </div>
          <p className="text-xs max-w-2xl mx-auto leading-relaxed">
            Intelligent context accumulation cycle where data insights flow continuously through capture, storage, and refinement phases, 
            powering the central <span className="text-cyan-200 font-semibold">AI Context</span> engine that drives Datus.
          </p>
        </div>

      </div>
  );
}