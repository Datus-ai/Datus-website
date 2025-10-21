import React, { useMemo } from "react";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Database,
  Zap,
  Shield,
  Brain,
  Network,
  Archive,
  TreePine,
  TrendingUp,
  Code,
  CheckCircle,
  Settings,
  BarChart3,
  Rocket,
  TestTube,
  Monitor,
  FileText,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { DataLifecycleDiagram } from "./components/DataLifecycleDiagram";
import DatusContextTriad from "./components/DatusContextTriad";
import DatusLayeredStack from "./components/DatusLayeredStack";
import DatusLayeredStackHorizontalOnly from "./components/DatusLayeredStackHorizontalOnly";

// Calculate octagonal positions with perfect geometric precision
const calculateOctagonPosition = (
  index: number,
  centerX = 50,
  centerY = 50,
  radius = 32,
) => {
  const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2; // Start from top
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};

const lifecycleStages = [
  {
    id: 1,
    title: "SQL Development",
    icon: Code,
    color: "from-cyan-500 to-blue-500",
    iconColor: "text-cyan-400",
    description:
      "Write, optimize, and version SQL queries with AI assistance",
    position: calculateOctagonPosition(0), // Top
  },
  {
    id: 2,
    title: "Data Quality",
    icon: CheckCircle,
    color: "from-blue-500 to-indigo-500",
    iconColor: "text-blue-400",
    description:
      "Automated quality checks and validation rules",
    position: calculateOctagonPosition(1), // Top-right
  },
  {
    id: 3,
    title: "Metric Management",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-500",
    iconColor: "text-indigo-400",
    description: "Define, track, and version business metrics",
    position: calculateOctagonPosition(2), // Right
  },
  {
    id: 4,
    title: "Modeling Optimization",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    iconColor: "text-purple-400",
    description:
      "Optimize data models for performance and cost",
    position: calculateOctagonPosition(3), // Bottom-right
  },
  {
    id: 5,
    title: "SQL Review",
    icon: TestTube,
    color: "from-pink-500 to-red-500",
    iconColor: "text-pink-400",
    description:
      "Peer review and automated code quality analysis",
    position: calculateOctagonPosition(4), // Bottom
  },
  {
    id: 6,
    title: "Job Deployment",
    icon: Rocket,
    color: "from-red-500 to-orange-500",
    iconColor: "text-red-400",
    description: "Deploy and schedule data processing jobs",
    position: calculateOctagonPosition(5), // Bottom-left
  },
  {
    id: 7,
    title: "Monitoring",
    icon: Monitor,
    color: "from-orange-500 to-yellow-500",
    iconColor: "text-orange-400",
    description: "Real-time monitoring and alerting",
    position: calculateOctagonPosition(6), // Left
  },
  {
    id: 8,
    title: "Documentation",
    icon: FileText,
    color: "from-yellow-500 to-cyan-500",
    iconColor: "text-yellow-400",
    description: "Auto-generated documentation and lineage",
    position: calculateOctagonPosition(7), // Top-left
  },
];

const connections = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
  { from: 8, to: 1 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
];

export default function App() {
  const scrollToLifecycle = () => {
    document
      .getElementById("lifecycle-diagram")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Memoize connection calculations for better performance
  const connectionPaths = useMemo(() => {
    return connections
      .map((connection, index) => {
        const fromStage = lifecycleStages.find(
          (s) => s.id === connection.from,
        );
        const toStage = lifecycleStages.find(
          (s) => s.id === connection.to,
        );
        if (!fromStage || !toStage) return null;

        return {
          key: `${connection.from}-${connection.to}`,
          fromX: fromStage.position.x,
          fromY: fromStage.position.y,
          toX: toStage.position.x,
          toY: toStage.position.y,
          index,
        };
      })
      .filter(Boolean);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => {
          const colors = [
            "bg-cyan-400/20",
            "bg-blue-400/20",
            "bg-indigo-400/20",
            "bg-purple-400/20",
            "bg-violet-400/20",
          ];
          const sizes = ["w-1 h-1", "w-2 h-2", "w-1.5 h-1.5"];
          return (
            <motion.div
              key={i}
              className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full`}
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined"
                    ? window.innerWidth
                    : 1000),
                y:
                  Math.random() *
                  (typeof window !== "undefined"
                    ? window.innerHeight
                    : 1000),
              }}
              animate={{
                x:
                  Math.random() *
                  (typeof window !== "undefined"
                    ? window.innerWidth
                    : 1000),
                y:
                  Math.random() *
                  (typeof window !== "undefined"
                    ? window.innerHeight
                    : 1000),
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Enhanced animated background for hero */}
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
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-between px-8 py-6"
        >
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <img src="/logo_dark.svg" alt="Datus" className="h-8 w-auto" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full ml-2"
            />
          </motion.div>
          
          {/* Open Source Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 15px rgba(34, 211, 238, 0.2)",
                  "0 0 25px rgba(34, 211, 238, 0.4)",
                  "0 0 15px rgba(34, 211, 238, 0.2)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 backdrop-blur-sm border border-cyan-400/30 px-4 py-2 rounded-full cursor-pointer"
            >
              <span className="text-sm font-medium text-cyan-300 flex items-center space-x-2">
                <span>Soon to be Open Source</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🚀
                </motion.span>
              </span>
            </motion.div>
          </motion.div>
        </motion.nav>

        <div className="relative">
          {/* Hero Tagline Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="px-8 py-24 text-center relative z-10"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-2xl md:text-3xl lg:text-4xl text-slate-300 mt-6 mb-4"
              >
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-blue-200 to-purple-200"
                  animate={{
                    backgroundPosition: [
                      "0% 50%",
                      "100% 50%",
                      "0% 50%",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  AI Native SQL Client for Data Engineers
                </motion.span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-white block mt-4"
              >
                The Future of{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                  animate={{
                    backgroundPosition: [
                      "100% 50%",
                      "0% 50%",
                      "100% 50%",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  Data Engineering
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Floating accent elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  i % 3 === 0
                    ? "bg-cyan-400/40"
                    : i % 3 === 1
                      ? "bg-blue-400/40"
                      : "bg-purple-400/40"
                } border border-white/30`}
                style={{
                  top: `${30 + i * 15}%`,
                  left: `${20 + i * 10}%`,
                  transform: `rotate(${i * 60}deg)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                  "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                  "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                ],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="px-8 py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
          >
            {/* Enhanced animated background for features */}
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
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Floating particles similar to context section */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => {
                const colors = [
                  "bg-cyan-400/10",
                  "bg-blue-400/10",
                  "bg-purple-400/10",
                  "bg-violet-400/10",
                ];
                const sizes = ["w-3 h-3", "w-4 h-4", "w-2 h-2"];
                return (
                  <motion.div
                    key={i}
                    className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full border border-white/20`}
                    initial={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
                    }}
                    animate={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 20 + 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                );
              })}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Built for Data Engineering Excellence
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <Zap className="h-8 w-8 text-cyan-400" />
                    ),
                    title: "Lightweight CLI Experience",
                    description:
                      "Up to 3× more efficient than traditional workflows, with seamless human-in-the-loop collaboration",
                    gradient: "from-cyan-500/20 to-blue-500/20",
                  },
                  {
                    icon: (
                      <Database className="h-8 w-8 text-blue-400" />
                    ),
                    title: "Full Data Engineering Lifecycle",
                    description:
                      "From SQL development and data quality to metric management, modeling optimization, SQL review, and job deployment",
                    gradient:
                      "from-blue-500/20 to-purple-500/20",
                  },
                  {
                    icon: (
                      <Brain className="h-8 w-8 text-purple-400" />
                    ),
                    title:
                      "Context Engineering for Data Engineers",
                    description:
                      "Purpose-built mechanisms to manage and continuously evolve data engineering context",
                    gradient:
                      "from-purple-500/20 to-pink-500/20",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Card
                      className={`bg-slate-800 border-slate-700 p-6 relative overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 hover:opacity-100 transition-opacity duration-300`}
                      />
                      <div className="space-y-4 relative z-10">
                        <motion.div
                          className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors duration-300"
                          whileHover={{
                            rotate: 360,
                            scale: 1.1,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300">
                          {feature.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Data Engineering Workflow Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 80,
                }}
                viewport={{ once: true }}
                className="mt-6 relative"
              >
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-4"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Complete Data Engineering Workflow
                  </h3>
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    End-to-end lifecycle management from SQL
                    development to job deployment
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="relative group max-w-5xl mx-auto"
                >
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    animate={{
                      background: [
                        "radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Main container */}
                  <motion.div
                    className="relative bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 shadow-2xl overflow-hidden"
                    animate={{
                      borderColor: [
                        "rgba(71, 85, 105, 0.5)",
                        "rgba(59, 130, 246, 0.4)",
                        "rgba(139, 92, 246, 0.4)",
                        "rgba(6, 182, 212, 0.4)",
                        "rgba(71, 85, 105, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Background pattern */}
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      animate={{
                        background: [
                          "radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 40%)",
                          "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 40%)",
                          "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 40%)",
                          "radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 40%)",
                          "radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 40%)",
                        ],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] aspect-square p-[0px] mx-[10px] my-[0px]">
                      {/* Connection Lines */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {/* Main octagonal connections */}
                        {connectionPaths.map(
                          (path) =>
                            path && (
                              <motion.line
                                key={path.key}
                                initial={{
                                  pathLength: 0,
                                  opacity: 0,
                                }}
                                whileInView={{
                                  pathLength: 1,
                                  opacity: 0.5,
                                }}
                                transition={{
                                  duration: 0.8,
                                  delay: 1.5 + path.index * 0.1,
                                }}
                                viewport={{ once: true }}
                                x1={path.fromX}
                                y1={path.fromY}
                                x2={path.toX}
                                y2={path.toY}
                                stroke="url(#connectionGradient)"
                                strokeWidth="0.4"
                                strokeDasharray="2,2"
                                vectorEffect="non-scaling-stroke"
                              />
                            ),
                        )}

                        {/* Connection nodes/points */}
                        {lifecycleStages.map((stage, index) => (
                          <motion.g key={`node-${stage.id}`}>
                            <motion.circle
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{
                                scale: 1,
                                opacity: 0.4,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: 2.0 + index * 0.1,
                              }}
                              viewport={{ once: true }}
                              cx={stage.position.x}
                              cy={stage.position.y}
                              r="1.0"
                              fill="url(#nodeGradient)"
                              className="drop-shadow-sm"
                            />
                            <motion.circle
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{
                                scale: 1,
                                opacity: 0.8,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: 2.2 + index * 0.1,
                              }}
                              viewport={{ once: true }}
                              cx={stage.position.x}
                              cy={stage.position.y}
                              r="0.5"
                              fill="#ffffff"
                              className="drop-shadow-sm"
                            />
                          </motion.g>
                        ))}

                        <defs>
                          <linearGradient
                            id="connectionGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity="0.8"
                            />
                            <stop
                              offset="50%"
                              stopColor="#8B5CF6"
                              stopOpacity="0.8"
                            />
                            <stop
                              offset="100%"
                              stopColor="#06B6D4"
                              stopOpacity="0.8"
                            />
                          </linearGradient>
                          <radialGradient
                            id="nodeGradient"
                            cx="50%"
                            cy="50%"
                            r="50%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#ffffff"
                              stopOpacity="0.9"
                            />
                            <stop
                              offset="100%"
                              stopColor="#3B82F6"
                              stopOpacity="0.8"
                            />
                          </radialGradient>
                        </defs>
                      </svg>

                      {/* Stage Cards */}
                      {lifecycleStages.map((stage, index) => {
                        const IconComponent = stage.icon;
                        return (
                          <motion.div
                            key={stage.id}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{
                              scale: 1,
                              opacity: 1,
                            }}
                            transition={{
                              duration: 0.6,
                              delay: 0.8 + index * 0.1,
                              type: "spring",
                              stiffness: 300,
                            }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="absolute z-20"
                            style={{
                              left: `${stage.position.x}%`,
                              top: `${stage.position.y}%`,
                              transform:
                                "translate(-50%, -50%)",
                            }}
                          >
                            <Card className="bg-white/95 backdrop-blur border-2 border-slate-200 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 w-28 sm:w-32 md:w-36 lg:w-40 cursor-pointer group relative">
                              {/* Connection node indicator */}
                              <motion.div
                                className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.6, 0.9, 0.6],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: index * 0.2,
                                  ease: "easeInOut",
                                }}
                              />
                              <div className="text-center space-y-2">
                                <motion.div
                                  className={`w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${stage.color} rounded-lg flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                                  whileHover={{
                                    rotate: 360,
                                    scale: 1.1,
                                  }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <IconComponent className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                                </motion.div>
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-slate-800 text-xs leading-tight">
                                    {stage.title}
                                  </h3>
                                  <p className="text-xs text-slate-600 leading-relaxed hidden lg:block">
                                    {stage.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Floating workflow indicators */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${
                          i === 0
                            ? "bg-cyan-400/60 border-cyan-300/40"
                            : i === 1
                              ? "bg-blue-400/60 border-blue-300/40"
                              : i === 2
                                ? "bg-purple-400/60 border-purple-300/40"
                                : "bg-violet-400/60 border-violet-300/40"
                        } border-2`}
                        style={{
                          top: `${15 + i * 20}%`,
                          right: `${-2 + Math.sin(i) * 3}%`,
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                          y: [0, -15, 0],
                          x: [0, Math.cos(i * 45) * 5, 0],
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.8,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-16"
              ></motion.div>
            </div>
          </motion.div>

          {/* Context That Builds Itself Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="px-8 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
          >
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
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Floating context particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => {
                const colors = [
                  "bg-cyan-400/10",
                  "bg-blue-400/10",
                  "bg-purple-400/10",
                  "bg-violet-400/10",
                ];
                const sizes = ["w-3 h-3", "w-4 h-4", "w-2 h-2"];
                return (
                  <motion.div
                    key={i}
                    className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full border border-white/20`}
                    initial={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
                    }}
                    animate={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 20 + 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                );
              })}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-white mb-6"
                >
                  Context That Builds Itself
                </motion.h2>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl text-slate-300 max-w-3xl mx-auto"
                >
                  Intelligent context accumulation that learns
                  and evolves with your data engineering
                  workflows
                </motion.p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <Archive className="h-8 w-8 text-cyan-400" />
                    ),
                    title: "Automatic Context Capture",
                    description:
                      "Store and recall historical SQL, table structures, metrics, and semantic layers on demand",
                    gradient:
                      "from-cyan-500/20 via-blue-500/10 to-cyan-500/5",
                    borderGradient:
                      "from-cyan-500/30 to-blue-500/30",
                    delay: 0,
                  },
                  {
                    icon: (
                      <TreePine className="h-8 w-8 text-blue-400" />
                    ),
                    title: "Enhanced Long-term Memory",
                    description:
                      "Dual recall (Tree + Vector) enables continuous accumulation of reusable knowledge",
                    gradient:
                      "from-blue-500/20 via-indigo-500/10 to-purple-500/5",
                    borderGradient:
                      "from-blue-500/30 to-purple-500/30",
                    delay: 0.2,
                  },
                  {
                    icon: (
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                    ),
                    title: "Evolving Context Engineering",
                    description:
                      "Incrementally builds context by learning from historical data to continuously improve accuracy",
                    gradient:
                      "from-purple-500/20 via-violet-500/10 to-purple-500/5",
                    borderGradient:
                      "from-purple-500/30 to-violet-500/30",
                    delay: 0.4,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      y: 60,
                      opacity: 0,
                      rotateX: -10,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      rotateX: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: feature.delay,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -15,
                      scale: 1.03,
                      rotateX: 5,
                    }}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-slate-800/60 backdrop-blur-sm border-0 p-8 relative overflow-hidden h-full">
                      {/* Animated border gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                        animate={{
                          background: [
                            `linear-gradient(45deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                            `linear-gradient(225deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                            `linear-gradient(45deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />

                      {/* Inner card */}
                      <div className="relative bg-slate-800/90 rounded-lg p-6 h-full backdrop-blur-sm m-0.5">
                        {/* Background gradient overlay */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                        />

                        <div className="space-y-6 relative z-10">
                          {/* Animated icon container */}
                          <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-500 transition-all duration-300"
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              scale: 1.1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.5,
                              }}
                            >
                              {feature.icon}
                            </motion.div>
                          </motion.div>

                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* Connecting lines animation */}
                          <motion.div
                            className="absolute bottom-4 right-4 w-6 h-6 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                            animate={{
                              rotate: [0, 90, 180, 270, 360],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                              delay: index * 1,
                            }}
                          >
                            <Network className="w-full h-full text-cyan-400" />
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Context Triad Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 80,
                }}
                viewport={{ once: true }}
                className="mt-16 relative"
              >
                <DatusContextTriad />
              </motion.div>

              {/* Context flow visualization */}
            </div>
          </motion.div>

          {/* Modern Data Stack Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="px-8 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
          >
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
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
                    }}
                    animate={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1000),
                      y:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 1000),
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
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-white mb-6"
                >
                  Your Entire Modern Data Stack, All in One
                  Place
                </motion.h2>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl text-slate-300 max-w-3xl mx-auto"
                >
                  Unify your entire data infrastructure with
                  intelligent automation and seamless
                  integration across all platforms
                </motion.p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <Network className="h-8 w-8 text-cyan-400" />
                    ),
                    title: "One Client to Connect It All",
                    description:
                      "Catalog services, data warehouses, job schedulers, semantic layers, and BI tools in a single place",
                    gradient:
                      "from-cyan-500/20 via-blue-500/10 to-cyan-500/5",
                    borderGradient:
                      "from-cyan-500/30 to-blue-500/30",
                    delay: 0,
                  },
                  {
                    icon: (
                      <Shield className="h-8 w-8 text-blue-400" />
                    ),
                    title: "Built-in Data Governance",
                    description:
                      "Shift from reactive fixes to proactive, standardized practices baked into data engineering development",
                    gradient:
                      "from-blue-500/20 via-indigo-500/10 to-purple-500/5",
                    borderGradient:
                      "from-blue-500/30 to-purple-500/30",
                    delay: 0.2,
                  },
                  {
                    icon: (
                      <Code className="h-8 w-8 text-purple-400" />
                    ),
                    title: "Dialect Support Across Platforms",
                    description:
                      "Seamlessly handle SQL and metric dialects across different warehouses and semantic layers",
                    gradient:
                      "from-purple-500/20 via-violet-500/10 to-purple-500/5",
                    borderGradient:
                      "from-purple-500/30 to-violet-500/30",
                    delay: 0.4,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      y: 60,
                      opacity: 0,
                      rotateX: -10,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      rotateX: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: feature.delay,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -15,
                      scale: 1.03,
                      rotateX: 5,
                    }}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-slate-800/60 backdrop-blur-sm border-0 p-8 relative overflow-hidden h-full">
                      {/* Animated border gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                        animate={{
                          background: [
                            `linear-gradient(45deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                            `linear-gradient(225deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                            `linear-gradient(45deg, ${feature.borderGradient.split(" ")[1]} 0%, ${feature.borderGradient.split(" ")[3]} 100%)`,
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />

                      {/* Inner card */}
                      <div className="relative bg-slate-800/90 rounded-lg p-6 h-full backdrop-blur-sm m-0.5">
                        {/* Background gradient overlay */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                        />

                        <div className="space-y-6 relative z-10">
                          {/* Animated icon container */}
                          <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-500 transition-all duration-300"
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              scale: 1.1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.5,
                              }}
                            >
                              {feature.icon}
                            </motion.div>
                          </motion.div>

                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* Connecting lines animation */}
                          <motion.div
                            className="absolute bottom-4 right-4 w-6 h-6 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                            animate={{
                              rotate: [0, 90, 180, 270, 360],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                              delay: index * 1,
                            }}
                          >
                            <Sparkles className="w-full h-full text-cyan-400" />
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Data Stack Architecture Diagram */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 80,
                }}
                viewport={{ once: true }}
                className="mt-20 relative"
              >
                <DatusLayeredStack />
              </motion.div>

              {/* Horizontal Extensibility Diagram */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.8,
                  type: "spring",
                  stiffness: 80,
                }}
                viewport={{ once: true }}
                className="mt-16 relative"
              >
                <DatusLayeredStackHorizontalOnly />
              </motion.div>

              {/* Integration visualization */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
              >
                <motion.div
                  className="inline-flex items-center space-x-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {["Connect", "Govern", "Scale"].map(
                    (step, index) => (
                      <React.Fragment key={step}>
                        <motion.div
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 1 + index * 0.2,
                          }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            className={`w-3 h-3 rounded-full ${
                              index === 0
                                ? "bg-cyan-400"
                                : index === 1
                                  ? "bg-blue-400"
                                  : "bg-purple-400"
                            }`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          />
                          <span className="text-slate-300 font-medium">
                            {step}
                          </span>
                        </motion.div>
                        {index < 2 && (
                          <motion.div
                            animate={{
                              x: [0, 10, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          >
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                          </motion.div>
                        )}
                      </React.Fragment>
                    ),
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Us Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="px-8 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      >
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
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => {
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
                  x:
                    Math.random() *
                    (typeof window !== "undefined"
                      ? window.innerWidth
                      : 1000),
                  y:
                    Math.random() *
                    (typeof window !== "undefined"
                      ? window.innerHeight
                      : 1000),
                }}
                animate={{
                  x:
                    Math.random() *
                    (typeof window !== "undefined"
                      ? window.innerWidth
                      : 1000),
                  y:
                    Math.random() *
                    (typeof window !== "undefined"
                      ? window.innerHeight
                      : 1000),
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                animate={{
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ backgroundSize: "200% 100%" }}
              >
                Get in Touch
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Ready to transform your data engineering workflow?
              Let's discuss how Datus can revolutionize your
              data stack.
            </motion.p>

            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Card className="bg-slate-800/60 backdrop-blur-sm border-0 p-8 relative overflow-hidden mx-auto max-w-md">
                {/* Animated border gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)",
                      "linear-gradient(225deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)",
                      "linear-gradient(45deg, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Inner card */}
                <div className="relative bg-slate-800/90 rounded-lg p-6 backdrop-blur-sm m-0.5">
                  <div className="space-y-6 text-center">
                    {/* Animated email icon */}
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto shadow-xl"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <span className="text-2xl">✉️</span>
                      </motion.div>
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">
                        Contact Us
                      </h3>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 400,
                        }}
                      >
                        <a
                          href="mailto:contact@datus.ai"
                          className="inline-flex items-center space-x-2 text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                        >
                          <motion.span
                            animate={{
                              backgroundPosition: [
                                "0% 50%",
                                "100% 50%",
                                "0% 50%",
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{
                              backgroundSize: "200% 100%",
                            }}
                            className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
                          >
                            contact@datus.ai
                          </motion.span>
                        </a>
                      </motion.div>
                    </div>

                    {/* Connecting sparkles animation */}
                    <motion.div
                      className="absolute top-4 right-4 w-6 h-6 opacity-40"
                      animate={{
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-full h-full text-cyan-400" />
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Call to action badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { text: "Enterprise Solutions", icon: "🏢" },
                { text: "Technical Partnerships", icon: "🤝" },
                { text: "Demo Requests", icon: "📊" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1 + index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <Badge className="bg-slate-700/60 text-slate-300 border-slate-600/50 px-4 py-2 text-sm backdrop-blur-sm hover:bg-slate-600/60 hover:border-blue-400/50 transition-all duration-300">
                    <span className="mr-2">{badge.icon}</span>
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Data Lifecycle Diagram */}
      <DataLifecycleDiagram />
    </div>
  );
}