import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { heroResumeData } from "@/types/resume";

const HeroSection = () => {
  const [atsScore, setAtsScore] = useState(72);
  const [phase, setPhase] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Phase timeline
    const phases = [
      { delay: 500, phase: 1 },
      { delay: 2000, phase: 2 },
      { delay: 4000, phase: 3 },
      { delay: 6000, phase: 4 },
      { delay: 8000, phase: 5 },
    ];

    phases.forEach(({ delay, phase: p }) => {
      setTimeout(() => setPhase(p), delay);
    });

    // Page flip animation
    setTimeout(() => setIsFlipping(true), 3000);
    setTimeout(() => setIsFlipping(false), 5000);

    // ATS score increment
    setTimeout(() => {
      const interval = setInterval(() => {
        setAtsScore(prev => {
          if (prev >= 96) {
            clearInterval(interval);
            return 96;
          }
          return prev + 1;
        });
      }, 50);
    }, 4000);
  }, []);

  const data = heroResumeData;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 3 }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[120px]" 
        />
        
        {/* Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--pearl-white)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="trust-badge">
                <div className="w-2 h-2 rounded-full bg-emerald animate-pulse-subtle" />
                <span>Trusted by 50,000+ professionals</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-headline mb-6"
            >
              <span className="font-serif italic">Craft</span> your career.
              <br />
              <span className="text-muted-foreground">Intelligently.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-subheadline mb-10"
            >
              The premium career operating system that transforms how recruiters see your professional story. 
              ATS-optimized. AI-enhanced. Beautifully crafted.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/editor">
                <Button variant="hero" size="xl">
                  Edit This Resume
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button variant="hero-secondary" size="xl">
                  Upload Yours
                </Button>
              </Link>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald" />
                </div>
                <span>ATS-Safe Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>AI-Powered Writing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <span>Version History</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Cinematic Resume Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
            style={{ perspective: "1500px" }}
          >
            <div className="relative w-full max-w-[380px] md:max-w-[420px] mx-auto">
              {/* Ambient Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-primary/8 rounded-full blur-[100px] -z-10 scale-150"
              />

              {/* Resume Container */}
              <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 25, rotateY: -5 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotateX: phase >= 1 ? 5 : 25,
                  rotateY: phase >= 1 ? 0 : -5
                }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back Page (Page 2) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFlipping ? 0.9 : 0.15 }}
                  className="absolute inset-0 bg-white rounded-lg shadow-2xl"
                  style={{ transform: "translateZ(-4px)" }}
                >
                  <div className="p-5 aspect-[210/297] overflow-hidden">
                    <ResumePageTwo data={data} />
                  </div>
                </motion.div>

                {/* Front Page with Flip */}
                <motion.div
                  animate={{ rotateY: isFlipping ? -180 : 0 }}
                  transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
                  className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ 
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <div className="p-5 aspect-[210/297] overflow-hidden">
                    <ResumePageOne data={data} phase={phase} />
                  </div>
                  
                  {/* Page flip shine effect */}
                  <AnimatePresence>
                    {isFlipping && (
                      <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 0.5, x: "100%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Paper Shadow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="absolute -bottom-8 left-8 right-8 h-16 bg-black/15 blur-2xl rounded-full -z-10"
                />
              </motion.div>

              {/* ATS Score Panel */}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ 
                  opacity: phase >= 3 ? 1 : 0,
                  x: phase >= 3 ? 0 : 50,
                  scale: phase >= 3 ? 1 : 0.9
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute -right-4 sm:-right-8 md:-right-20 top-8 sm:top-12"
              >
                <div className="bg-card/95 backdrop-blur-lg border border-border rounded-xl p-4 shadow-elevated">
                  <div className="text-[10px] text-muted-foreground mb-1.5 font-semibold tracking-widest uppercase">ATS Score</div>
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      key={atsScore}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-3xl font-bold text-foreground tabular-nums"
                    >
                      {atsScore}
                    </motion.span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: "72%" }}
                      animate={{ width: `${atsScore}%` }}
                      className="h-full bg-emerald rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* AI Insight Panel */}
              <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ 
                  opacity: phase >= 3 ? 1 : 0,
                  x: phase >= 3 ? 0 : -50,
                  scale: phase >= 3 ? 1 : 0.9
                }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute -left-4 sm:-left-8 md:-left-24 top-24 sm:top-32"
              >
                <div className="bg-card/95 backdrop-blur-lg border border-primary/30 rounded-xl p-4 shadow-glow max-w-[200px]">
                  <div className="text-[10px] text-primary mb-2 font-semibold tracking-widest uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    AI Insight
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground/70 line-through">"Managed team"</span>
                    <br />
                    <span className="text-emerald font-medium">"Led team of 45 engineers, reducing time-to-market by 60%"</span>
                  </p>
                </div>
              </motion.div>

              {/* Spelling Auto-Fix */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: phase >= 4 ? 1 : 0,
                  y: phase >= 4 ? 0 : 20
                }}
                transition={{ duration: 0.5 }}
                className="absolute -left-4 sm:-left-8 md:-left-20 bottom-32 sm:bottom-40"
              >
                <div className="bg-card/90 backdrop-blur-md border border-emerald/30 rounded-lg p-3 shadow-subtle">
                  <div className="text-[9px] text-emerald mb-1 font-semibold tracking-widest uppercase">Auto-Fix</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="line-through text-destructive/60">recieved</span>
                    <span className="mx-1">→</span>
                    <span className="text-foreground">received</span>
                  </p>
                </div>
              </motion.div>

              {/* Resume State Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: phase >= 5 ? 1 : 0,
                  y: phase >= 5 ? 0 : 20
                }}
                transition={{ duration: 0.6 }}
                className="absolute -bottom-16 sm:-bottom-14 left-1/2 -translate-x-1/2 w-full max-w-[300px]"
              >
                <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-4 shadow-subtle">
                  <div className="flex items-center justify-between">
                    {["Imported", "Enhanced", "Finalized"].map((step, i) => (
                      <div key={step} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.15 * i }}
                          className={`w-3 h-3 rounded-full mb-1.5 ${
                            i === 2 
                              ? "bg-emerald shadow-[0_0_15px_hsl(var(--emerald-slate))]" 
                              : "bg-muted-foreground/40"
                          }`} 
                        />
                        <span className="text-[9px] text-muted-foreground font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-3 gap-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="flex-1 h-0.5 bg-emerald/60 rounded" 
                    />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="flex-1 h-0.5 bg-emerald/60 rounded" 
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Resume Page One Component
const ResumePageOne = ({ data, phase }: { data: typeof heroResumeData; phase: number }) => (
  <div className="text-gray-900 h-full text-[9px] leading-tight">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex items-start gap-3 mb-3 pb-2 border-b-2 border-indigo-600"
    >
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-600 flex-shrink-0">
        <img 
          src={data.personalInfo.photo} 
          alt={data.personalInfo.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-gray-900 truncate">{data.personalInfo.name}</h1>
        <p className="text-[10px] font-semibold text-indigo-600 truncate">{data.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[7px] text-gray-500">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
    </motion.div>

    {/* Summary */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-2"
    >
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Summary</h2>
      <p className="text-gray-600 leading-relaxed line-clamp-3">{data.summary}</p>
    </motion.div>

    {/* Experience */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mb-2"
    >
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Experience</h2>
      {data.experience.slice(0, 2).map((exp, idx) => (
        <div key={exp.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-gray-900 text-[9px]">{exp.position}</h3>
            <span className="text-[7px] text-gray-400">{exp.startDate} — {exp.endDate}</span>
          </div>
          <p className="text-[8px] text-gray-600 font-medium">{exp.company}</p>
          <ul className="mt-0.5 space-y-0.5">
            {exp.bullets.slice(0, 2).map((bullet, i) => (
              <motion.li
                key={i}
                animate={{
                  backgroundColor: phase >= 3 && idx === 0 && i === 0 ? "rgba(16, 185, 129, 0.08)" : "transparent"
                }}
                className="flex text-gray-600 rounded px-0.5"
              >
                <span className="mr-1 text-indigo-400">▸</span>
                <span className="line-clamp-1">{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>

    {/* Skills */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Skills</h2>
      <div className="flex flex-wrap gap-1">
        {data.skills.flatMap(s => s.items).slice(0, 10).map((skill, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[7px]">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

// Resume Page Two Component
const ResumePageTwo = ({ data }: { data: typeof heroResumeData }) => (
  <div className="text-gray-900 h-full text-[9px] leading-tight">
    {/* Education */}
    <div className="mb-3">
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Education</h2>
      {data.education.map((edu) => (
        <div key={edu.id} className="mb-2">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-900">{edu.school}</h3>
            <span className="text-[7px] text-gray-400">{edu.endDate}</span>
          </div>
          <p className="text-gray-600">{edu.degree} in {edu.field}</p>
          {edu.gpa && <p className="text-[7px] text-gray-500">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </div>

    {/* Certifications */}
    <div className="mb-3">
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Certifications</h2>
      <div className="space-y-1.5">
        {data.certifications?.map((cert) => (
          <div key={cert.id}>
            <p className="font-medium text-gray-800">{cert.name}</p>
            <p className="text-[7px] text-gray-500">{cert.issuer} • {cert.date}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Projects */}
    <div className="mb-3">
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Key Projects</h2>
      {data.projects?.slice(0, 1).map((proj) => (
        <div key={proj.id}>
          <h3 className="font-bold text-gray-900">{proj.name}</h3>
          <p className="text-gray-600 line-clamp-2">{proj.description}</p>
        </div>
      ))}
    </div>

    {/* Languages */}
    <div>
      <h2 className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Languages</h2>
      <div className="flex gap-3">
        {data.languages?.map((lang, i) => (
          <span key={i} className="text-gray-600">{lang.language} — {lang.proficiency}</span>
        ))}
      </div>
    </div>
  </div>
);

export default HeroSection;
