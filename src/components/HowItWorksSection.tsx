import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Import or Start Fresh",
    description: "Upload your existing resume or start with a blank canvas. Our OCR technology extracts and structures your content automatically.",
  },
  {
    number: "02",
    title: "AI Analyzes & Enhances",
    description: "Instant ATS scan reveals your score. AI suggests improvements with clear reasoning — what's weak, how to fix it, and why it matters.",
  },
  {
    number: "03",
    title: "Craft & Refine",
    description: "Use the block editor to reorder sections, adjust spacing, and polish every detail. True document-grade precision.",
  },
  {
    number: "04",
    title: "Export & Apply",
    description: "Download ATS-safe PDF, share via link, or connect to job boards. Track versions and iterate with confidence.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-spacing relative bg-card/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
            From upload to <span className="font-serif italic">offer-ready</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A streamlined workflow that respects your time while maximizing your impact.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex gap-8 pb-12 last:pb-0"
            >
              {/* Timeline Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[27px] top-16 w-px h-[calc(100%-4rem)] bg-gradient-to-b from-border to-transparent" />
              )}

              {/* Number */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
