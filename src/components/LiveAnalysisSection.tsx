import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, AlertTriangle, Sparkles, Target, Zap } from "lucide-react";

const LiveAnalysisSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView) {
      const phases = [
        { delay: 500, phase: 1 },
        { delay: 1500, phase: 2 },
        { delay: 2500, phase: 3 },
        { delay: 3500, phase: 4 },
        { delay: 4500, phase: 5 },
      ];
      phases.forEach(({ delay, phase: p }) => {
        setTimeout(() => setPhase(p), delay);
      });
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="section-spacing relative bg-card/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.3 : 0 }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6">
              This is how we{" "}
              <span className="font-serif italic">analyze</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              We don't guess. We analyze. Watch as our AI scans your resume in real-time, 
              highlighting issues and automatically improving your content.
            </p>

            {/* Analysis Steps */}
            <div className="space-y-4">
              {[
                { icon: Target, label: "Keyword Detection", desc: "Matching industry-specific terms", phase: 1 },
                { icon: AlertTriangle, label: "ATS Warning Scan", desc: "Identifying parsing issues", phase: 2 },
                { icon: Check, label: "Spelling & Grammar", desc: "Auto-fixing common errors", phase: 3 },
                { icon: Sparkles, label: "Impact Rewrite", desc: "Transforming duties into achievements", phase: 4 },
                { icon: Zap, label: "Score Optimization", desc: "Maximizing recruiter match rate", phase: 5 },
              ].map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: phase >= step.phase ? 1 : 0.3,
                    x: phase >= step.phase ? 0 : -20
                  }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    phase >= step.phase ? "bg-secondary/50 border border-primary/20" : "bg-secondary/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                    phase >= step.phase ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.label}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                  {phase >= step.phase && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-emerald/20 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-emerald" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Live Resume Analysis Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-xl shadow-paper p-6 max-w-md mx-auto">
              {/* Resume Content Being Analyzed */}
              <div className="text-gray-900 text-sm space-y-4">
                {/* Header */}
                <div className="border-b pb-3">
                  <h3 className="font-bold text-lg">John Smith</h3>
                  <p className="text-indigo-600 font-medium">Software Developer</p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-bold text-indigo-600 text-xs uppercase tracking-wider mb-2">Experience</h4>
                  
                  {/* Line being analyzed */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase >= 1 ? 1 : 0 }}
                      className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/30 rounded"
                    />
                    <p className="text-gray-700 leading-relaxed">
                      <span className="font-medium">Senior Developer</span> at TechCorp
                    </p>
                    
                    {/* Original text with strikethrough */}
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: phase >= 4 ? 0 : 1 }}
                      className="mt-1"
                    >
                      <p className={`text-gray-600 text-sm ${phase >= 3 ? "line-through text-gray-400" : ""}`}>
                        • Responsible for managing the development team
                      </p>
                    </motion.div>

                    {/* Improved text */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: phase >= 4 ? 1 : 0,
                        height: phase >= 4 ? "auto" : 0
                      }}
                      className="mt-1 overflow-hidden"
                    >
                      <p className="text-gray-800 text-sm bg-emerald/10 px-2 py-1 rounded border-l-2 border-emerald">
                        • Led team of 12 engineers, delivering 3 products that generated $5M ARR
                      </p>
                    </motion.div>
                  </div>

                  {/* Keyword highlights */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    className="mt-3 flex flex-wrap gap-1"
                  >
                    {["React", "TypeScript", "AWS", "Node.js"].map((keyword, i) => (
                      <motion.span
                        key={keyword}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Spelling fix demo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-medium mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    Spelling Fixed
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="line-through text-red-400">recieved</span>
                    <span className="mx-2">→</span>
                    <span className="text-emerald font-medium">received</span>
                  </p>
                </motion.div>

                {/* ATS Warning fading out */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: phase >= 5 ? 0 : phase >= 2 ? 1 : 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 text-red-600 text-xs font-medium mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    ATS Warning
                  </div>
                  <p className="text-sm text-gray-700">
                    Missing keyword: "Agile methodology"
                  </p>
                </motion.div>

                {/* Success state */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: phase >= 5 ? 1 : 0,
                    scale: phase >= 5 ? 1 : 0.95
                  }}
                  className="bg-emerald/10 border border-emerald/30 rounded-lg p-4 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 text-emerald" />
                  </div>
                  <p className="font-medium text-emerald">Analysis Complete</p>
                  <p className="text-sm text-gray-600 mt-1">Score improved: 72 → 96</p>
                </motion.div>
              </div>
            </div>

            {/* Floating Micro-copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
            >
              <p className="text-sm text-muted-foreground italic text-center">
                Real-time analysis. No waiting.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveAnalysisSection;
