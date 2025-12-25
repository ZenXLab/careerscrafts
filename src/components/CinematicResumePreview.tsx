import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { heroResumeData } from "@/types/resume";

const CinematicResumePreview = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const data = heroResumeData;

  useEffect(() => {
    const phases = [
      { delay: 1500, phase: 1 },
      { delay: 3500, phase: 2 },
      { delay: 6000, phase: 3 },
      { delay: 8500, phase: 4 },
      { delay: 11000, phase: 5 },
      { delay: 13000, phase: 6 },
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setCurrentPhase(phase), delay);
    });

    setTimeout(() => setIsFlipping(true), 3500);
    setTimeout(() => setIsFlipping(false), 5500);
  }, []);

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] mx-auto" style={{ perspective: "1200px" }}>
      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentPhase >= 1 ? 0.5 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] -z-10"
      />

      {/* Main Resume Container */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        animate={{ 
          opacity: currentPhase >= 1 ? 1 : 0, 
          y: currentPhase >= 1 ? 0 : 50,
          rotateX: currentPhase >= 1 ? 0 : 20
        }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Resume Pages */}
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Back Page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipping ? 1 : 0.2 }}
            className="absolute inset-0"
            style={{ transform: "translateZ(-3px)" }}
          >
            <div className="bg-white rounded shadow-2xl p-4 sm:p-6 aspect-[210/297] overflow-hidden">
              <ResumePageTwo data={data} />
            </div>
          </motion.div>

          {/* Front Page with Flip */}
          <motion.div
            animate={{ rotateY: isFlipping ? -180 : 0 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
            style={{ 
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="bg-white rounded shadow-2xl p-4 sm:p-6 aspect-[210/297] overflow-hidden">
              <ResumePageOne data={data} currentPhase={currentPhase} />
            </div>

            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/30 to-transparent pointer-events-none rounded"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Paper Shadow */}
        <motion.div
          animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
          className="absolute -bottom-6 left-6 right-6 h-12 bg-black/20 blur-2xl rounded-full -z-10"
        />
      </motion.div>

      {/* ATS Score Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.9 }}
        animate={{ 
          opacity: currentPhase >= 3 ? 1 : 0,
          x: currentPhase >= 3 ? 0 : 40,
          scale: currentPhase >= 3 ? 1 : 0.9
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -right-2 sm:-right-6 md:-right-16 top-6 sm:top-10"
      >
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 sm:p-4 shadow-elevated">
          <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-1 font-semibold tracking-widest uppercase">ATS Score</div>
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              96
            </motion.span>
            <span className="text-xs sm:text-sm text-muted-foreground">/100</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-1.5 bg-emerald rounded-full mt-2"
          />
        </div>
      </motion.div>

      {/* AI Intelligence Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40, scale: 0.9 }}
        animate={{ 
          opacity: currentPhase >= 3 ? 1 : 0,
          x: currentPhase >= 3 ? 0 : -40,
          scale: currentPhase >= 3 ? 1 : 0.9
        }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute -left-2 sm:-left-6 md:-left-20 top-20 sm:top-28"
      >
        <div className="bg-card/95 backdrop-blur-md border border-primary/40 rounded-xl p-3 sm:p-4 shadow-glow max-w-[160px] sm:max-w-[200px]">
          <div className="text-[9px] sm:text-[10px] text-primary mb-2 font-semibold tracking-widest uppercase">AI Insight</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">"Designed architecture"</span> → 
            <span className="text-emerald"> "Architected microservices for 25M+ users"</span>
          </p>
        </div>
      </motion.div>

      {/* Section Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: currentPhase >= 4 ? 1 : 0,
          y: currentPhase >= 4 ? 0 : 20
        }}
        transition={{ duration: 0.6 }}
        className="absolute -left-2 sm:-left-6 md:-left-24 bottom-28 sm:bottom-36"
      >
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-subtle">
          <div className="text-[8px] sm:text-[9px] text-muted-foreground mb-2 font-semibold tracking-widest uppercase">Sections</div>
          <div className="space-y-1.5">
            {["Experience", "Skills", "Certifications"].map((section, i) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex items-center gap-2 text-[10px] sm:text-xs text-foreground/80"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {section}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: currentPhase >= 5 ? 1 : 0,
          y: currentPhase >= 5 ? 0 : 20
        }}
        transition={{ duration: 0.6 }}
        className="absolute -bottom-12 sm:-bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[260px] sm:max-w-[300px]"
      >
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            {["Imported", "Enhanced", "Finalized"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 * i }}
                className="flex flex-col items-center"
              >
                <div className={`w-2.5 h-2.5 rounded-full mb-1 ${
                  i === 2 ? "bg-emerald shadow-[0_0_12px_hsl(var(--emerald-slate))]" : "bg-muted-foreground/30"
                }`} />
                <span className="text-[8px] sm:text-[9px] text-muted-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex mt-2 gap-1">
            <div className="flex-1 h-0.5 bg-emerald/50 rounded" />
            <div className="flex-1 h-0.5 bg-emerald/50 rounded" />
          </div>
        </div>
      </motion.div>

      {/* Microcopy */}
      <AnimatePresence>
        {currentPhase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-24 sm:-bottom-20 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              Designed like a document.<br />
              <span className="text-foreground/70">Not a template.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResumePageOne = ({ data, currentPhase }: { data: typeof heroResumeData; currentPhase: number }) => (
  <div className="text-gray-900 h-full text-[8px] sm:text-[9px] leading-tight">
    {/* Header with Photo */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="flex items-start gap-3 mb-3 pb-2 border-b-2 border-indigo-600"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-indigo-600 flex-shrink-0">
        <img 
          src={data.personalInfo.photo} 
          alt={data.personalInfo.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">{data.personalInfo.name}</h1>
        <p className="text-[9px] sm:text-[10px] font-semibold text-indigo-600 truncate">{data.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[7px] sm:text-[8px] text-gray-500">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
    </motion.div>

    {/* Summary */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mb-2"
    >
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Summary</h2>
      <p className="text-gray-600 leading-relaxed line-clamp-3">{data.summary}</p>
    </motion.div>

    {/* Experience */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mb-2"
    >
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Experience</h2>
      {data.experience.slice(0, 2).map((exp, idx) => (
        <div key={exp.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-gray-900 text-[8px] sm:text-[9px]">{exp.position}</h3>
            <span className="text-[6px] sm:text-[7px] text-gray-400">{exp.startDate} — {exp.endDate}</span>
          </div>
          <p className="text-[7px] sm:text-[8px] text-gray-600 font-medium">{exp.company}</p>
          <ul className="mt-0.5 space-y-0.5">
            {exp.bullets.slice(0, 2).map((bullet, i) => (
              <motion.li
                key={i}
                animate={{
                  backgroundColor: currentPhase >= 3 && idx === 0 && i === 0 ? "rgba(16, 185, 129, 0.1)" : "transparent"
                }}
                className="flex text-gray-600 rounded px-0.5"
              >
                <span className="mr-1 text-gray-400">▸</span>
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
      animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    >
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Skills</h2>
      <div className="flex flex-wrap gap-1">
        {data.skills.flatMap(s => s.items).slice(0, 10).map((skill, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[6px] sm:text-[7px]">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

const ResumePageTwo = ({ data }: { data: typeof heroResumeData }) => (
  <div className="text-gray-900 h-full text-[8px] sm:text-[9px] leading-tight">
    {/* Education */}
    <div className="mb-3">
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Education</h2>
      {data.education.map((edu) => (
        <div key={edu.id} className="mb-2">
          <div className="flex justify-between">
            <h3 className="font-bold text-gray-900">{edu.school}</h3>
            <span className="text-[6px] sm:text-[7px] text-gray-400">{edu.endDate}</span>
          </div>
          <p className="text-gray-600">{edu.degree} in {edu.field}</p>
          {edu.gpa && <p className="text-[6px] sm:text-[7px] text-gray-500">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </div>

    {/* Certifications */}
    <div className="mb-3">
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Certifications</h2>
      <div className="space-y-1.5">
        {data.certifications?.map((cert) => (
          <div key={cert.id}>
            <p className="font-medium text-gray-800">{cert.name}</p>
            <p className="text-[6px] sm:text-[7px] text-gray-500">{cert.issuer} • {cert.date}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Projects */}
    <div className="mb-3">
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Key Projects</h2>
      {data.projects?.slice(0, 1).map((proj) => (
        <div key={proj.id}>
          <h3 className="font-bold text-gray-900">{proj.name}</h3>
          <p className="text-gray-600 line-clamp-2">{proj.description}</p>
        </div>
      ))}
    </div>

    {/* Languages */}
    <div>
      <h2 className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Languages</h2>
      <div className="flex gap-3">
        {data.languages?.map((lang, i) => (
          <span key={i} className="text-gray-600">{lang.language} — {lang.proficiency}</span>
        ))}
      </div>
    </div>
  </div>
);

export default CinematicResumePreview;
