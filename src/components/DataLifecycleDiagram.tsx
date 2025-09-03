import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useMemo, memo, useCallback } from "react";
import {
  Database,
  Code,
  CheckCircle,
  Settings,
  BarChart3,
  Rocket,
  RefreshCw,
  GitBranch,
  TestTube,
  Monitor,
  FileText,
  Zap,
} from "lucide-react";

interface DataLifecycleDiagramProps {
  id?: string;
}

// Calculate octagonal positions with perfect geometric precision
// Center at (50, 50), radius adjusted for optimal spacing in smaller container
const calculateOctagonPosition = (index: number, centerX = 50, centerY = 50, radius = 32) => {
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
    description: "Write, optimize, and version SQL queries with AI assistance",
    position: calculateOctagonPosition(0), // Top
  },
  {
    id: 2,
    title: "Data Quality",
    icon: CheckCircle,
    color: "from-blue-500 to-indigo-500",
    iconColor: "text-blue-400",
    description: "Automated quality checks and validation rules",
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
    description: "Optimize data models for performance and cost",
    position: calculateOctagonPosition(3), // Bottom-right
  },
  {
    id: 5,
    title: "SQL Review",
    icon: TestTube,
    color: "from-pink-500 to-red-500",
    iconColor: "text-pink-400",
    description: "Peer review and automated code quality analysis",
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

export const DataLifecycleDiagram = memo(function DataLifecycleDiagram({ id = "lifecycle-diagram" }: DataLifecycleDiagramProps) {
  // Memoize connection calculations for better performance
  const connectionPaths = useMemo(() => {
    return connections.map((connection, index) => {
      const fromStage = lifecycleStages.find(s => s.id === connection.from);
      const toStage = lifecycleStages.find(s => s.id === connection.to);
      if (!fromStage || !toStage) return null;
      
      return {
        key: `${connection.from}-${connection.to}`,
        fromX: fromStage.position.x,
        fromY: fromStage.position.y,
        toX: toStage.position.x,
        toY: toStage.position.y,
        index,
      };
    }).filter(Boolean);
  }, []);

  // Memoize particle animations - reduced for better performance
  const particles = useMemo(() => {
    const colors = [
      "bg-cyan-400/10",
      "bg-blue-400/10", 
      "bg-indigo-400/10",
      "bg-purple-400/10"
    ];
    
    return [...Array(4)].map((_, i) => {
      const initialX = 20 + Math.random() * 60; // Keep particles more centered
      const initialY = 20 + Math.random() * 60;
      return {
        id: i,
        color: colors[i % colors.length],
        initialX,
        initialY,
        endX: (initialX + 15) % 80 + 10, // Smaller range for less distraction
        endY: (initialY + 10) % 80 + 10,
        duration: 25 + Math.random() * 10, // Slower, more subtle movement
        delay: i * 3,
      };
    });
  }, []);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-16 relative overflow-hidden"
    >
      {/* Animated background */}



    </motion.div>
  );
});