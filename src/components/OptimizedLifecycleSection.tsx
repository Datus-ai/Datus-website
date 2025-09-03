import React, { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { 
  ArrowRight, 
  Sparkles, 
  Database, 
  Zap, 
  Brain,
  RefreshCw,
  Eye,
  Clock
} from "lucide-react";

// Lazy load the DataLifecycleDiagram for better performance
const DataLifecycleDiagram = lazy(() => 
  import("./DataLifecycleDiagram").then(module => ({
    default: module.DataLifecycleDiagram
  }))
);

// Loading skeleton for the diagram
const DiagramSkeleton = () => (
  <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
    <div className="relative w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] aspect-square">
      {/* Center skeleton */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
      
      {/* Octagonal skeleton cards */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
        const radius = 32;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return (
          <motion.div
            key={i}
            className="absolute z-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Skeleton className="w-28 h-32 md:w-32 md:h-36 lg:w-36 lg:h-40 rounded-lg" />
          </motion.div>
        );
      })}
    </div>
  </div>
);

// Statistics cards for the lifecycle section
const LifecycleStats = () => {
  const stats = [
    {
      icon: <Zap className="h-5 w-5 text-cyan-400" />,
      label: "Efficiency Gain",
      value: "3×",
      description: "Faster than traditional workflows",
      gradient: "from-cyan-500/10 to-blue-500/10"
    },
    {
      icon: <Database className="h-5 w-5 text-blue-400" />,
      label: "Lifecycle Stages",
      value: "8",
      description: "Complete data engineering phases",
      gradient: "from-blue-500/10 to-purple-500/10"
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-400" />,
      label: "Context Management",
      value: "AI",
      description: "Intelligent context evolution",
      gradient: "from-purple-500/10 to-pink-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -2, scale: 1.02 }}
        >
          <Card className={`bg-gradient-to-br ${stat.gradient} border-slate-200/50 p-4 text-center hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="font-medium text-slate-700 text-sm">{stat.label}</div>
              <div className="text-xs text-slate-600">{stat.description}</div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export function OptimizedLifecycleSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleViewDiagram = () => {
    setShowDiagram(true);
  };

  return (
    <motion.section
      id="lifecycle-diagram"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden"
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="h-full w-full"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(248, 250, 252, 0.9) 30%, rgba(59, 130, 246, 0.15) 70%, rgba(139, 92, 246, 0.15) 100%)",
              "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 25%, rgba(248, 250, 252, 0.9) 50%, rgba(139, 92, 246, 0.15) 100%)",
              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 25%, rgba(248, 250, 252, 0.9) 50%, rgba(6, 182, 212, 0.15) 100%)",
              "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(248, 250, 252, 0.9) 30%, rgba(59, 130, 246, 0.15) 70%, rgba(139, 92, 246, 0.15) 100%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles optimized for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isVisible && [...Array(12)].map((_, i) => {
          const colors = [
            "bg-cyan-400/20",
            "bg-blue-400/20", 
            "bg-indigo-400/20",
            "bg-purple-400/20",
            "bg-violet-400/20",
          ];
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${colors[i % colors.length]} rounded-full`}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Sparkles className="h-8 w-8 text-blue-500" />
              </motion.div>
              <Badge 
                variant="outline" 
                className="px-4 py-2 bg-white/80 border-blue-200 text-blue-700 font-medium"
              >
                Complete Data Engineering Lifecycle
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 100%" }}
              >
                8-Stage Development
              </motion.span>{" "}
              Process
            </h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              From SQL development and data quality to monitoring and documentation—experience 
              the complete data engineering workflow with AI-native automation and human-in-the-loop collaboration.
            </motion.p>
          </motion.div>

          {/* Lifecycle Statistics */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <LifecycleStats />
          </motion.div>

          {/* Interactive Diagram Toggle */}
          {!showDiagram && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleViewDiagram}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Interactive Lifecycle Diagram
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Lifecycle Diagram Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
              {/* Loading indicator */}
              <Suspense fallback={<DiagramSkeleton />}>
                {showDiagram || isVisible ? (
                  <DataLifecycleDiagram />
                ) : (
                  <DiagramSkeleton />
                )}
              </Suspense>

              {/* Performance indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-4 right-4 flex items-center space-x-2 bg-green-50/90 border border-green-200 rounded-full px-3 py-1.5 text-sm text-green-700"
              >
                <Clock className="h-3 w-3" />
                <span className="font-medium">Live Diagram</span>
              </motion.div>
            </Card>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: "SQL Development", icon: "🔧" },
                { label: "Data Quality", icon: "✅" },
                { label: "Metric Management", icon: "📊" },
                { label: "Job Deployment", icon: "🚀" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 300 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/80 rounded-lg p-3 border border-slate-200/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm font-medium text-slate-700">{item.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
              className="mt-8 text-slate-600 max-w-2xl mx-auto"
            >
              Each stage in the lifecycle is designed to work seamlessly with AI automation while 
              maintaining full human control and oversight. Click on any stage in the diagram above 
              to explore its specific capabilities and integrations.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}