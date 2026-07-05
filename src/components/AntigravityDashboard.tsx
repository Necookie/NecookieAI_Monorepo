import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  Settings, 
  Cpu, 
  Navigation2, 
  Activity, 
  Zap, 
  Sliders, 
  RotateCcw, 
  Gauge, 
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { useAppStore } from "../lib/context";

// Particle animation settings for MagicUI/Aceternity effect
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function AntigravityDashboard() {
  const compactMode = useAppStore((s) => s.compactMode);
  
  // Settings State representing HeroUI settings panels
  const [activeCategory, setActiveCategory] = useState<"propulsion" | "telemetry" | "diagnostics" | "navigation">("propulsion");
  const [thrustPower, setThrustPower] = useState(72);
  const [matrixStability, setMatrixStability] = useState(94);
  const [particleDensity, setParticleDensity] = useState(55);
  const [dampingFactor, setDampingFactor] = useState(38);
  const [safetyLock, setSafetyLock] = useState(true);
  const [propulsionMode, setPropulsionMode] = useState("Quantum Spring");
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);

  // Generate glowing floating particles for propulsion status indicators
  const [particles, setParticles] = useState<Particle[]>(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 50,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }))
  );

  const regenerateParticles = () => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100 + 50,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 1.5,
        duration: Math.random() * 2.5 + 2,
      }))
    );
  };

  const handleRunDiagnostics = () => {
    if (diagnosticsRunning) return;
    setDiagnosticsRunning(true);
    setDiagnosticProgress(0);
    const interval = setInterval(() => {
      setDiagnosticProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDiagnosticsRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Spring physical animation models for primary buttons and cards to simulate weightlessness
  const weightlessSpring = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 0.8,
  };

  return (
    <div 
      className={`flex flex-1 overflow-hidden transition-all duration-300 ${
        compactMode ? "p-3 gap-3" : "p-6 gap-6"
      }`}
      style={{ background: "radial-gradient(circle at 50% 50%, var(--color-surface-soft) 0%, var(--color-canvas) 100%)" }}
    >
      {/* ─── Dashboard Sidebar ─── */}
      <motion.div 
        className="w-64 shrink-0 rounded-2xl flex flex-col justify-between border select-none overflow-hidden backdrop-blur-md"
        style={{ 
          background: "var(--color-surface-card)",
          borderColor: "var(--color-hairline)"
        }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={weightlessSpring}
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-hairline)] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-[var(--color-ink)] font-mono">ANTIGRAVITY</h2>
              <p className="text-xs text-[var(--color-muted)] font-mono">Telemetry Module v1.2</p>
            </div>
          </div>

          {/* Navigation Categories */}
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveCategory("propulsion")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === "propulsion"
                  ? "bg-[var(--color-accent-teal)] text-white shadow-lg shadow-[var(--color-accent-teal)]/20"
                  : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Propulsion Matrix</span>
            </button>

            <button
              onClick={() => setActiveCategory("telemetry")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === "telemetry"
                  ? "bg-[var(--color-accent-teal)] text-white shadow-lg shadow-[var(--color-accent-teal)]/20"
                  : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Real-time Telemetry</span>
            </button>

            <button
              onClick={() => setActiveCategory("diagnostics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === "diagnostics"
                  ? "bg-[var(--color-accent-teal)] text-white shadow-lg shadow-[var(--color-accent-teal)]/20"
                  : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
              }`}
            >
              <Gauge className="h-4 w-4" />
              <span>System Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveCategory("navigation")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === "navigation"
                  ? "bg-[var(--color-accent-teal)] text-white shadow-lg shadow-[var(--color-accent-teal)]/20"
                  : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
              }`}
            >
              <Navigation2 className="h-4 w-4" />
              <span>Stellar Navigation</span>
            </button>
          </div>
        </div>

        {/* Footprint */}
        <div className="p-4 border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)]/50">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--color-muted)]">CORE STATUS</span>
            <span className="text-[var(--color-success)] flex items-center gap-1.5 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)] inline-block animate-ping" />
              ONLINE
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Main Content Workspace ─── */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-ink)] font-mono flex items-center gap-2">
              PROPULSION CONTROL PANEL
            </h1>
            <p className="text-xs text-[var(--color-muted)]">Manage and configure gravity-nullification metrics.</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={weightlessSpring}
            onClick={regenerateParticles}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--color-hairline)] bg-[var(--color-surface-card)] text-[var(--color-ink)] shadow-sm cursor-pointer hover:bg-[var(--color-surface-soft)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Cycle Particles</span>
          </motion.button>
        </div>

        {/* Grid Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Glowing Status Indicator Panel */}
          <motion.div 
            className="lg:col-span-2 rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md min-h-[250px]"
            style={{ 
              background: "var(--color-surface-card)",
              borderColor: "var(--color-hairline)"
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={weightlessSpring}
          >
            {/* Glowing magic particle animation in background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-slate-900/5 dark:bg-slate-900/40">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full bg-[var(--color-accent-teal)]/30 filter blur-[1px]"
                  style={{
                    left: `${p.x}%`,
                    bottom: `${p.y - 40}%`,
                    width: p.size,
                    height: p.size,
                  }}
                  animate={{
                    y: [-20, -180],
                    x: ["0%", `${(Math.random() - 0.5) * 10}%`],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] border border-[var(--color-accent-teal)]/20">
                  SYSTEM CORE: ACTIVATED
                </span>
                <span className="text-xs text-[var(--color-muted)] font-mono">FIELD STRENGTH: {thrustPower * 1.25} GW</span>
              </div>

              {/* Status Thruster Indicators */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]/60 flex flex-col justify-between"
                >
                  <span className="text-xs text-[var(--color-muted)] font-mono">THRUSTER ALPHA</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-[var(--color-ink)]">{thrustPower}%</span>
                    <Flame className="h-5 w-5 text-[var(--color-accent-teal)] fill-[var(--color-accent-teal)] animate-pulse" />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -3.5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]/60 flex flex-col justify-between"
                >
                  <span className="text-xs text-[var(--color-muted)] font-mono">GRAVITY INDUCTOR</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-[var(--color-ink)]">{matrixStability}%</span>
                    <Radio className="h-5 w-5 text-[var(--color-accent-teal)] animate-pulse" />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--color-accent-teal)]" />
                <span className="text-xs text-[var(--color-body)] font-medium">Real-time propulsion feedback</span>
              </div>
              <span className="text-xs font-mono text-[var(--color-accent-teal)]">WAVELENGTH: Stable</span>
            </div>
          </motion.div>

          {/* Quick Stats Panel */}
          <motion.div 
            className="rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-md"
            style={{ 
              background: "var(--color-surface-card)",
              borderColor: "var(--color-hairline)"
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...weightlessSpring, delay: 0.1 }}
          >
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-[var(--color-ink)] font-mono">DYNAMICS INDEX</h3>
              <p className="text-xs text-[var(--color-muted)]">Relative gravity compensation level.</p>

              <div className="mt-6 flex flex-col items-center justify-center relative">
                {/* Floating dynamic status ball */}
                <motion.div
                  className="h-28 w-28 rounded-full flex flex-col items-center justify-center border-2 border-[var(--color-accent-teal)]/30 bg-gradient-to-tr from-[var(--color-accent-teal)]/10 to-transparent shadow-xl relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <span className="text-xs text-[var(--color-muted)] font-mono">NET SCALE</span>
                  <span className="text-2xl font-black text-[var(--color-ink)] font-mono">0.02g</span>
                  <div className="absolute inset-2 border border-dashed border-[var(--color-accent-teal)]/20 rounded-full animate-[spin_20s_linear_infinite]" />
                </motion.div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-mono text-[var(--color-muted)]">Effective weight: 1.8% of normal</span>
            </div>
          </motion.div>
        </div>

        {/* ─── HeroUI Settings Panels ─── */}
        <AnimatePresence mode="wait">
          {activeCategory === "propulsion" && (
            <motion.div
              key="propulsion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={weightlessSpring}
              className="rounded-2xl border p-6 space-y-6"
              style={{ background: "var(--color-surface-card)", borderColor: "var(--color-hairline)" }}
            >
              <div>
                <h3 className="text-base font-bold text-[var(--color-ink)] font-mono">Propulsion Control Panel</h3>
                <p className="text-xs text-[var(--color-muted)]">Modify engine thrust profiles and damping coefficients.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thrust Power Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-body)] font-medium">Core Thrust Power</span>
                    <span className="font-mono font-bold text-[var(--color-ink)]">{thrustPower}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={thrustPower}
                    onChange={(e) => setThrustPower(Number(e.target.value))}
                    className="w-full h-1.5 bg-[var(--color-hairline)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-teal)]"
                  />
                  <div className="flex justify-between text-xxs font-mono text-[var(--color-muted)]">
                    <span>Idle</span>
                    <span>Overdrive</span>
                  </div>
                </div>

                {/* Damping Factor Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-body)] font-medium">Kinetic Damping Factor</span>
                    <span className="font-mono font-bold text-[var(--color-ink)]">{dampingFactor}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dampingFactor}
                    onChange={(e) => setDampingFactor(Number(e.target.value))}
                    className="w-full h-1.5 bg-[var(--color-hairline)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-teal)]"
                  />
                  <div className="flex justify-between text-xxs font-mono text-[var(--color-muted)]">
                    <span>Float</span>
                    <span>Rigid</span>
                  </div>
                </div>

                {/* Particle Density Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-body)] font-medium">Shield Particle Density</span>
                    <span className="font-mono font-bold text-[var(--color-ink)]">{particleDensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={particleDensity}
                    onChange={(e) => setParticleDensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-[var(--color-hairline)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-teal)]"
                  />
                  <div className="flex justify-between text-xxs font-mono text-[var(--color-muted)]">
                    <span>Sparse</span>
                    <span>Saturated</span>
                  </div>
                </div>

                {/* Dropdown Select representing HeroUI select field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-body)] block">Quantum Propulsion Mode</label>
                  <select
                    value={propulsionMode}
                    onChange={(e) => setPropulsionMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-teal)]"
                  >
                    <option value="Quantum Spring">Quantum Spring (Resilient)</option>
                    <option value="Static Nullifier">Static Nullifier (Fixed)</option>
                    <option value="Solar Float">Solar Float (Sustained)</option>
                    <option value="Zero G Wave">Zero G Wave (High Fluctuating)</option>
                  </select>
                </div>
              </div>

              {/* Safety Switch representing HeroUI Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]/40">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-[var(--color-ink)] block">Automatic Matrix Safety Lock</span>
                  <span className="text-xs text-[var(--color-muted)]">Automatically damp power if core fluctuations exceed 8%.</span>
                </div>
                <button
                  onClick={() => setSafetyLock(!safetyLock)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    safetyLock ? "bg-[var(--color-accent-teal)]" : "bg-[var(--color-hairline)]"
                  }`}
                >
                  <motion.div
                    layout
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    transition={weightlessSpring}
                    animate={{ x: safetyLock ? 24 : 0 }}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {activeCategory === "telemetry" && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={weightlessSpring}
              className="rounded-2xl border p-6 space-y-6"
              style={{ background: "var(--color-surface-card)", borderColor: "var(--color-hairline)" }}
            >
              <div>
                <h3 className="text-base font-bold text-[var(--color-ink)] font-mono">Real-time Telemetry Metrics</h3>
                <p className="text-xs text-[var(--color-muted)]">Live feeds from spatial-deviation monitors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                  <span className="text-xs font-mono text-[var(--color-muted)]">GRAVITY VECTOR</span>
                  <p className="text-lg font-bold font-mono text-[var(--color-ink)] mt-1">x: 0.001, y: 0.012, z: 0.003</p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                  <span className="text-xs font-mono text-[var(--color-muted)]">ATTITUDE CORRECTION</span>
                  <p className="text-lg font-bold font-mono text-[var(--color-ink)] mt-1">Pitch: +0.2°, Roll: -0.1°</p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                  <span className="text-xs font-mono text-[var(--color-muted)]">THERMAL MARGIN</span>
                  <span className="text-lg font-bold font-mono text-[var(--color-success)] mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)] inline-block" />
                    +42.6° C
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeCategory === "diagnostics" && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={weightlessSpring}
              className="rounded-2xl border p-6 space-y-6"
              style={{ background: "var(--color-surface-card)", borderColor: "var(--color-hairline)" }}
            >
              <div>
                <h3 className="text-base font-bold text-[var(--color-ink)] font-mono">System Core Diagnostics</h3>
                <p className="text-xs text-[var(--color-muted)]">Evaluate the health of particle capacitors and coil alignments.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-body)] font-medium">Diagnostic Check Status</span>
                  <span className="font-mono font-bold text-[var(--color-ink)]">{diagnosticProgress}%</span>
                </div>
                <div className="w-full bg-[var(--color-hairline)] h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[var(--color-accent-teal)] h-full"
                    animate={{ width: `${diagnosticProgress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[var(--color-success)]" />
                    <span className="text-xs text-[var(--color-muted)] font-mono">Coils properly aligned, zero leakage detected.</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRunDiagnostics}
                    disabled={diagnosticsRunning}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                      diagnosticsRunning 
                        ? "bg-[var(--color-accent-teal)]/50 cursor-not-allowed" 
                        : "bg-[var(--color-accent-teal)] hover:bg-[var(--color-accent-teal)]/90"
                    }`}
                  >
                    <span>{diagnosticsRunning ? "Checking..." : "Initiate Test Sequence"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeCategory === "navigation" && (
            <motion.div
              key="navigation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={weightlessSpring}
              className="rounded-2xl border p-6 space-y-6"
              style={{ background: "var(--color-surface-card)", borderColor: "var(--color-hairline)" }}
            >
              <div>
                <h3 className="text-base font-bold text-[var(--color-ink)] font-mono">Stellar Navigation Reference</h3>
                <p className="text-xs text-[var(--color-muted)]">Reference alignment coordinates for zero-gravity transit.</p>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)]/20 text-center space-y-2">
                <p className="text-xs text-[var(--color-body)]">Current Sector: **Sector-814-F** (Orion Arm)</p>
                <div className="font-mono text-xs text-[var(--color-muted)]">
                  RA: 05h 35m 17.3s | Dec: -05° 23′ 28″
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
