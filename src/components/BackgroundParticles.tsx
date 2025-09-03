import { motion } from "motion/react";

export function BackgroundParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(25)].map((_, i) => {
        const colors = [
          "bg-cyan-400/15",
          "bg-blue-400/15", 
          "bg-indigo-400/15",
          "bg-purple-400/15",
          "bg-violet-400/15",
        ];
        const sizes = ["w-1 h-1", "w-2 h-2", "w-1.5 h-1.5"];
        return (
          <motion.div
            key={i}
            className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full`}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
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
  );
}