import { motion } from "framer-motion";

const ResumePreview = () => {
  return (
    <div className="relative w-full max-w-[320px] md:max-w-[380px] mx-auto">
      {/* Resume Document */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
        style={{ perspective: "1000px" }}
      >
        {/* Paper Shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-sm blur-3xl transform translate-y-8 scale-95" />
        
        {/* Main Resume Card */}
        <div className="resume-card relative p-6 md:p-8 overflow-hidden">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-6"
          >
            <div className="h-3 w-32 bg-carbon/90 rounded-sm mb-2" />
            <div className="h-2 w-24 bg-carbon/40 rounded-sm" />
          </motion.div>

          {/* Contact Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex gap-3 mb-6 pb-4 border-b border-carbon/10"
          >
            <div className="h-1.5 w-16 bg-carbon/30 rounded-sm" />
            <div className="h-1.5 w-20 bg-carbon/30 rounded-sm" />
            <div className="h-1.5 w-14 bg-carbon/30 rounded-sm" />
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="mb-6"
          >
            <div className="h-2 w-20 bg-indigo mb-3 rounded-sm" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-carbon/20 rounded-sm" />
              <div className="h-1.5 w-11/12 bg-carbon/20 rounded-sm" />
              <div className="h-1.5 w-4/5 bg-carbon/20 rounded-sm" />
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="mb-6"
          >
            <div className="h-2 w-24 bg-indigo mb-3 rounded-sm" />
            
            {/* Job 1 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-2 w-28 bg-carbon/60 rounded-sm" />
                <div className="h-1.5 w-16 bg-carbon/30 rounded-sm" />
              </div>
              <div className="h-1.5 w-20 bg-carbon/40 rounded-sm mb-2" />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-carbon/15 rounded-sm" />
                <div className="h-1.5 w-10/12 bg-carbon/15 rounded-sm" />
              </div>
            </div>

            {/* Job 2 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="h-2 w-24 bg-carbon/60 rounded-sm" />
                <div className="h-1.5 w-14 bg-carbon/30 rounded-sm" />
              </div>
              <div className="h-1.5 w-18 bg-carbon/40 rounded-sm mb-2" />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-carbon/15 rounded-sm" />
                <div className="h-1.5 w-9/12 bg-carbon/15 rounded-sm" />
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.7 }}
          >
            <div className="h-2 w-16 bg-indigo mb-3 rounded-sm" />
            <div className="flex flex-wrap gap-2">
              <div className="h-4 w-14 bg-carbon/10 rounded-sm" />
              <div className="h-4 w-16 bg-carbon/10 rounded-sm" />
              <div className="h-4 w-12 bg-carbon/10 rounded-sm" />
              <div className="h-4 w-18 bg-carbon/10 rounded-sm" />
              <div className="h-4 w-14 bg-carbon/10 rounded-sm" />
            </div>
          </motion.div>

          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--carbon-black)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--carbon-black)) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* ATS Score Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="absolute -right-4 top-8 md:-right-8"
        >
          <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
            <div className="text-[10px] text-muted-foreground mb-1 font-medium tracking-wide uppercase">ATS Score</div>
            <div className="text-2xl font-semibold text-foreground">92<span className="text-sm text-muted-foreground">/100</span></div>
          </div>
        </motion.div>

        {/* Intelligence Hint */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="absolute -left-4 bottom-16 md:-left-8"
        >
          <div className="bg-card border border-primary/30 rounded-lg p-3 shadow-glow max-w-[180px]">
            <div className="text-[10px] text-primary mb-1 font-medium tracking-wide uppercase">AI Suggestion</div>
            <div className="text-xs text-muted-foreground leading-relaxed">Quantify achievements with metrics</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResumePreview;
