import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Sparkles,
  Database,
  Zap,
  Shield,
  Brain,
  Network,
} from "lucide-react";
import { sqlCode, featuresData } from "../constants/data";

interface HeroSectionProps {
  scrollToBlueprint: () => void;
}

export function HeroSection({ scrollToBlueprint }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 via-purple-900 to-slate-900">
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
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="h-8 w-8 text-blue-400" />
          </motion.div>
          <span className="text-xl font-semibold text-white">Datus</span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full ml-2"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={scrollToBlueprint}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            View Service Blueprint
          </Button>
        </motion.div>
      </motion.nav>

      <div className="relative">
        {/* Hero Content */}
        <div className="px-8 pt-16 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl font-bold text-white leading-tight"
                  >
                    AI Agent for End-to-End
                    <br />
                    <motion.span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600"
                      animate={{
                        backgroundPosition: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ backgroundSize: "200% 100%" }}
                    >
                      Data Engineering
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl text-slate-300 leading-relaxed"
                  >
                    Datus understands your metadata, plans solutions, generates
                    and optimizes SQL, models data, defines metrics,
                    orchestrates tasks, monitors data quality, and learns from
                    feedback—so you can ship faster with confidence.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg"
                    >
                      Get started in 10 minutes
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={scrollToBlueprint}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      See how it works
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Code Preview */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative"
              >
                <motion.div
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-4">
                      {[
                        { color: "bg-red-500", delay: 0 },
                        { color: "bg-yellow-500", delay: 0.3 },
                        { color: "bg-green-500", delay: 0.6 },
                      ].map((dot, index) => (
                        <motion.div
                          key={index}
                          className={`w-3 h-3 rounded-full ${dot.color}`}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: dot.delay,
                          }}
                        />
                      ))}
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="h-4 w-4 text-blue-400" />
                        </motion.div>
                        <span className="text-sm text-slate-400">
                          SQL with metadata-aware reasoning
                        </span>
                      </div>
                    </div>

                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: 0.8,
                      }}
                      className="text-sm text-slate-300 leading-relaxed overflow-x-auto"
                    >
                      <code>{sqlCode}</code>
                    </motion.pre>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                      className="mt-6 flex flex-wrap gap-2 relative z-10"
                    >
                      {[
                        "Schema linking",
                        "Join/metric intent",
                        "SQL optimization",
                        "Validation & retry",
                      ].map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1.2 + index * 0.1,
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="px-3 py-1 bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 transition-all duration-200"
                          >
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.2, rotate: 180 }}
                >
                  <Database className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-3 shadow-lg"
                  animate={{
                    y: [0, 10, 0],
                    rotateX: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  whileHover={{ scale: 1.2, rotate: -180 }}
                >
                  <Zap className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2,
                  }}
                >
                  <Network className="h-32 w-32 text-blue-400/20" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="px-8 py-16 bg-slate-800/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-15">
            <div className="grid grid-cols-12 gap-4 h-full">
              {[...Array(48)].map((_, i) => {
                const colors = [
                  "bg-cyan-400/30",
                  "bg-blue-400/30",
                  "bg-indigo-400/30", 
                  "bg-purple-400/30",
                  "bg-violet-400/30",
                ];
                return (
                  <motion.div
                    key={i}
                    className={`${colors[i % colors.length]} rounded`}
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                );
              })}
            </div>
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
                End-to-End Data Engineering Automation
              </h2>
              <p className="text-xl text-slate-300">
                From intake to delivery, Datus handles every phase of your data
                workflow
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuresData.map((feature, index) => {
                const IconComponent = {
                  Brain,
                  Database,
                  Shield,
                }[feature.icon as keyof typeof { Brain: any; Database: any; Shield: any }];
                
                return (
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
                          <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300">{feature.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={scrollToBlueprint}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Explore Service Blueprint
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}