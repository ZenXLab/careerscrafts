import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const CinematicResumePreview = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const phases = [
      { delay: 1500, phase: 1 },   // Resume appears
      { delay: 3500, phase: 2 },   // Page flip starts
      { delay: 6000, phase: 3 },   // Intelligence reveal
      { delay: 8500, phase: 4 },   // Control & Craft
      { delay: 11000, phase: 5 },  // Timeline ownership
      { delay: 13000, phase: 6 },  // CTA ready
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setCurrentPhase(phase), delay);
    });

    // Trigger page flip
    setTimeout(() => setIsFlipping(true), 3500);
    setTimeout(() => setIsFlipping(false), 5500);
  }, []);

  return (
    <div className="relative w-full max-w-[380px] md:max-w-[420px] mx-auto perspective-1000">
      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentPhase >= 1 ? 0.4 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] -z-10"
      />

      {/* Main Resume Container with 3D */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ 
          opacity: currentPhase >= 1 ? 1 : 0, 
          y: currentPhase >= 1 ? 0 : 40,
          rotateX: currentPhase >= 1 ? 0 : 15
        }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Book Spine Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-carbon/50 to-transparent rounded-l-sm z-10" />

        {/* Resume Pages Container */}
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Back Page (Page 2) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipping ? 1 : 0.3 }}
            className="absolute inset-0 resume-card p-6 md:p-8"
            style={{ transform: "translateZ(-2px)" }}
          >
            <ResumePageTwo />
          </motion.div>

          {/* Front Page (Page 1) with Flip Animation */}
          <motion.div
            animate={{
              rotateY: isFlipping ? -180 : 0,
            }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            className="resume-card p-6 md:p-8 relative"
            style={{ 
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
              backfaceVisibility: "hidden"
            }}
          >
            <ResumePageOne currentPhase={currentPhase} />
            
            {/* Page curl shadow during flip */}
            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-carbon/20 to-transparent pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Paper Shadow */}
        <motion.div
          animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
          className="absolute -bottom-4 left-4 right-4 h-8 bg-carbon/30 blur-xl rounded-full -z-10"
        />
      </motion.div>

      {/* ATS Score Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.9 }}
        animate={{ 
          opacity: currentPhase >= 3 ? 1 : 0,
          x: currentPhase >= 3 ? 0 : 30,
          scale: currentPhase >= 3 ? 1 : 0.9
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -right-4 md:-right-12 top-8"
      >
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elevated">
          <div className="text-[10px] text-muted-foreground mb-1 font-medium tracking-widest uppercase">ATS Score</div>
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-semibold text-foreground"
            >
              92
            </motion.span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-emerald rounded-full mt-2"
          />
        </div>
      </motion.div>

      {/* AI Intelligence Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.9 }}
        animate={{ 
          opacity: currentPhase >= 3 ? 1 : 0,
          x: currentPhase >= 3 ? 0 : -30,
          scale: currentPhase >= 3 ? 1 : 0.9
        }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="absolute -left-4 md:-left-16 top-24"
      >
        <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-xl p-4 shadow-glow max-w-[200px]">
          <div className="text-[10px] text-primary mb-2 font-medium tracking-widest uppercase">AI Insight</div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground leading-relaxed"
          >
            <span className="text-foreground">"Led team"</span> → <span className="text-emerald">"Managed 12-person team, delivering 40% faster"</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Control Panel - Blocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: currentPhase >= 4 ? 1 : 0,
          y: currentPhase >= 4 ? 0 : 20
        }}
        transition={{ duration: 0.6 }}
        className="absolute -left-4 md:-left-20 bottom-32"
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-subtle">
          <div className="text-[9px] text-muted-foreground mb-2 font-medium tracking-widest uppercase">Sections</div>
          <div className="space-y-1.5">
            {["Experience", "Skills", "Education"].map((section, i) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-2 text-xs text-foreground/80"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {section}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline Ownership */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: currentPhase >= 5 ? 1 : 0,
          y: currentPhase >= 5 ? 0 : 20
        }}
        transition={{ duration: 0.6 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[280px]"
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            {["Imported", "Improved", "Finalized"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 * i }}
                className="flex flex-col items-center"
              >
                <div className={`w-2 h-2 rounded-full mb-1 ${
                  i === 2 ? "bg-emerald shadow-[0_0_8px_hsl(var(--emerald-slate))]" : "bg-muted-foreground/30"
                }`} />
                <span className="text-[9px] text-muted-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex mt-2">
            <div className="flex-1 h-0.5 bg-muted-foreground/20" />
            <div className="flex-1 h-0.5 bg-muted-foreground/20" />
          </div>
        </div>
      </motion.div>

      {/* Microcopy Overlays */}
      <AnimatePresence>
        {currentPhase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-sm text-muted-foreground italic">
              Designed like a document.<br />
              <span className="text-foreground/70">Not a template.</span>
            </p>
          </motion.div>
        )}
        {currentPhase === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -right-4 md:-right-24 bottom-48 max-w-[140px]"
          >
            <p className="text-xs text-muted-foreground">
              You stay creative.<br />
              <span className="text-foreground/80">We enforce correctness.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResumePageOne = ({ currentPhase }: { currentPhase: number }) => (
  <>
    {/* Header */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-5"
    >
      <div className="h-4 w-36 bg-carbon/90 rounded-sm mb-2" />
      <div className="h-2.5 w-28 bg-carbon/40 rounded-sm" />
    </motion.div>

    {/* Contact Bar */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="flex gap-4 mb-5 pb-4 border-b border-carbon/10"
    >
      <div className="h-2 w-20 bg-carbon/25 rounded-sm" />
      <div className="h-2 w-24 bg-carbon/25 rounded-sm" />
      <div className="h-2 w-16 bg-carbon/25 rounded-sm" />
    </motion.div>

    {/* Summary */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mb-5"
    >
      <div className="h-2.5 w-24 bg-indigo mb-3 rounded-sm" />
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-carbon/15 rounded-sm" />
        <div className="h-2 w-11/12 bg-carbon/15 rounded-sm" />
        <div className="h-2 w-4/5 bg-carbon/15 rounded-sm" />
      </div>
    </motion.div>

    {/* Experience */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="mb-5"
    >
      <div className="h-2.5 w-28 bg-indigo mb-3 rounded-sm" />
      
      {/* Job 1 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-2.5 w-32 bg-carbon/60 rounded-sm" />
          <div className="h-2 w-20 bg-carbon/25 rounded-sm" />
        </div>
        <div className="h-2 w-24 bg-carbon/35 rounded-sm mb-2" />
        <div className="space-y-1.5 pl-3 border-l-2 border-carbon/10">
          <motion.div
            animate={{
              backgroundColor: currentPhase >= 3 ? "hsl(var(--emerald-slate) / 0.1)" : "transparent"
            }}
            className="h-2 w-full bg-carbon/12 rounded-sm transition-colors duration-500"
          />
          <div className="h-2 w-10/12 bg-carbon/12 rounded-sm" />
        </div>
      </div>

      {/* Job 2 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="h-2.5 w-28 bg-carbon/60 rounded-sm" />
          <div className="h-2 w-18 bg-carbon/25 rounded-sm" />
        </div>
        <div className="h-2 w-20 bg-carbon/35 rounded-sm mb-2" />
        <div className="space-y-1.5 pl-3 border-l-2 border-carbon/10">
          <div className="h-2 w-full bg-carbon/12 rounded-sm" />
          <div className="h-2 w-9/12 bg-carbon/12 rounded-sm" />
        </div>
      </div>
    </motion.div>

    {/* Skills */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
    >
      <div className="h-2.5 w-16 bg-indigo mb-3 rounded-sm" />
      <div className="flex flex-wrap gap-2">
        {[16, 20, 14, 22, 16, 18].map((w, i) => (
          <div key={i} className="h-5 bg-carbon/8 rounded-sm" style={{ width: `${w * 4}px` }} />
        ))}
      </div>
    </motion.div>
  </>
);

const ResumePageTwo = () => (
  <>
    {/* Education Header */}
    <div className="mb-5">
      <div className="h-2.5 w-24 bg-indigo mb-3 rounded-sm" />
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="h-2.5 w-40 bg-carbon/60 rounded-sm" />
          <div className="h-2 w-16 bg-carbon/25 rounded-sm" />
        </div>
        <div className="h-2 w-32 bg-carbon/35 rounded-sm" />
      </div>
    </div>

    {/* Certifications */}
    <div className="mb-5">
      <div className="h-2.5 w-28 bg-indigo mb-3 rounded-sm" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-carbon/30" />
          <div className="h-2 w-40 bg-carbon/20 rounded-sm" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-carbon/30" />
          <div className="h-2 w-36 bg-carbon/20 rounded-sm" />
        </div>
      </div>
    </div>

    {/* Projects */}
    <div className="mb-5">
      <div className="h-2.5 w-20 bg-indigo mb-3 rounded-sm" />
      <div className="space-y-3">
        <div>
          <div className="h-2.5 w-28 bg-carbon/50 rounded-sm mb-1.5" />
          <div className="h-2 w-full bg-carbon/12 rounded-sm" />
          <div className="h-2 w-3/4 bg-carbon/12 rounded-sm mt-1" />
        </div>
      </div>
    </div>

    {/* Languages */}
    <div>
      <div className="h-2.5 w-24 bg-indigo mb-3 rounded-sm" />
      <div className="flex gap-4">
        <div className="h-2 w-20 bg-carbon/20 rounded-sm" />
        <div className="h-2 w-16 bg-carbon/20 rounded-sm" />
      </div>
    </div>
  </>
);

export default CinematicResumePreview;
