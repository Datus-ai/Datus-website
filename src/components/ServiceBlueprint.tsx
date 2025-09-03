import React, { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Sparkles, Cpu } from "lucide-react";
import { phases, actors } from "../constants/data";

interface ServiceBlueprintProps {
  id?: string;
}

export function ServiceBlueprint({ id = "service-blueprint" }: ServiceBlueprintProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    actor: number;
    phase: string;
  } | null>(null);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-16 relative"
    >
      {/* Unified animated background */}
      <div className="absolute inset-0 opacity-50">
        <motion.div
          className="h-full w-full"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, transparent 30%, rgba(59, 130, 246, 0.15) 70%, rgba(139, 92, 246, 0.15) 100%)",
              "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 25%, transparent 50%, rgba(139, 92, 246, 0.15) 100%)",
              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 25%, transparent 50%, rgba(6, 182, 212, 0.15) 100%)",
              "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, transparent 30%, rgba(139, 92, 246, 0.15) 70%, rgba(59, 130, 246, 0.15) 100%)",
              "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, transparent 30%, rgba(59, 130, 246, 0.15) 70%, rgba(139, 92, 246, 0.15) 100%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Service Blueprint
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive view of how AI automation integrates into traditional data engineering workflows
          </p>
        </motion.div>

        {/* Blueprint Table */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="border border-slate-200 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[1200px]"
                style={{
                  gridTemplateColumns: "200px repeat(8, 1fr)",
                }}
              >
                {/* Phase Headers */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="h-16 bg-gradient-to-r from-slate-100 to-slate-50 border-r border-slate-200 border-b border-slate-200 flex items-center justify-center"
                >
                  <span className="text-sm font-medium text-slate-600">
                    Actors / Phases
                  </span>
                </motion.div>
                
                {phases.map((phase, index) => (
                  <motion.div
                    key={phase.name}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className={`h-16 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 flex items-center justify-center ${phase.color} ${
                      index < phases.length - 1
                        ? "border-r border-slate-200"
                        : ""
                    } transition-all duration-200 cursor-pointer hover:from-white hover:to-slate-50`}
                  >
                    <motion.span
                      className="font-semibold text-center text-sm px-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {phase.name}
                    </motion.span>
                  </motion.div>
                ))}

                {/* Actor Rows */}
                {actors.map((actor, actorIndex) => (
                  <React.Fragment key={`actor-row-${actorIndex}`}>
                    {/* Actor Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: actorIndex * 0.2,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`h-28 ${actor.color} border-r border-slate-200 flex items-center justify-center p-4 ${
                        actorIndex < actors.length - 1
                          ? "border-b border-slate-200"
                          : ""
                      } ${
                        actor.isEmphasis
                          ? "shadow-md border-l-4 border-l-blue-500 relative overflow-hidden"
                          : ""
                      } transition-all duration-300 cursor-pointer hover:shadow-sm`}
                    >
                      {actor.isEmphasis && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                        />
                      )}
                      <div className="text-center relative z-10">
                        <motion.span
                          className={`font-semibold text-sm block ${
                            actor.isEmphasis
                              ? "text-blue-800"
                              : "text-slate-800"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {actor.name}
                        </motion.span>
                        {actor.isEmphasis && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.5,
                              delay: 0.8,
                            }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center mt-1"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="h-3 w-3 text-blue-600 mr-1" />
                            </motion.div>
                            <span className="text-xs text-blue-600 font-medium">
                              AI Agent
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Activities */}
                    {phases.map((phase, phaseIndex) => (
                      <motion.div
                        key={`${actorIndex}-${phase.name}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: actorIndex * 0.1 + phaseIndex * 0.05,
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.02,
                          y: -2,
                          boxShadow: actor.isEmphasis
                            ? "0 8px 25px rgba(59, 130, 246, 0.2)"
                            : "0 4px 15px rgba(0, 0, 0, 0.1)",
                        }}
                        className={`h-28 p-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                          phaseIndex < phases.length - 1
                            ? "border-r border-slate-200"
                            : ""
                        } ${
                          actorIndex < actors.length - 1
                            ? "border-b border-slate-200"
                            : ""
                        } ${
                          hoveredCell?.actor === actorIndex &&
                          hoveredCell?.phase === phase.name
                            ? "bg-gradient-to-br from-blue-100 to-purple-100 ring-2 ring-blue-300 ring-inset shadow-md"
                            : actor.isEmphasis
                              ? "bg-gradient-to-r from-blue-50/40 to-purple-50/40 hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                              : "bg-white/60 hover:bg-slate-50 hover:shadow-sm"
                        }`}
                        onMouseEnter={() =>
                          setHoveredCell({
                            actor: actorIndex,
                            phase: phase.name,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {actor.isEmphasis &&
                          hoveredCell?.actor === actorIndex &&
                          hoveredCell?.phase === phase.name && (
                            <motion.div
                              initial={{
                                scale: 0,
                                opacity: 0,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 0.2,
                              }}
                              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400"
                            />
                          )}

                        <motion.div
                          className={`text-xs leading-relaxed relative z-10 ${
                            actor.isEmphasis
                              ? "text-blue-900 font-medium"
                              : "text-slate-700"
                          }`}
                          initial={{ y: 10, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1,
                          }}
                          viewport={{ once: true }}
                        >
                          {actor.activities[phase.name]}
                        </motion.div>

                        {actor.isEmphasis && (
                          <motion.div
                            className="absolute bottom-1 right-1"
                            animate={{
                              opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          >
                            <Cpu className="h-3 w-3 text-blue-500" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Interactive Footer */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.div
            animate={{
              background: [
                "linear-gradient(45deg, #3B82F6, #8B5CF6, #06B6D4, #3B82F6)",
                "linear-gradient(45deg, #8B5CF6, #06B6D4, #3B82F6, #8B5CF6)",
                "linear-gradient(45deg, #06B6D4, #3B82F6, #8B5CF6, #06B6D4)",
                "linear-gradient(45deg, #3B82F6, #8B5CF6, #06B6D4, #3B82F6)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block p-4 rounded-xl shadow-lg"
          >
            <p className="text-white font-medium">
              🚀 Ready to transform your data engineering workflow with AI?
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}