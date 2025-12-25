import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Your career deserves
            <br />
            <span className="font-serif italic">better tools</span>
          </h2>

          {/* Subtext */}
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Stop using outdated resume builders. Start presenting your professional story with the precision it deserves.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl">
              Start Building — Free
            </Button>
            <Button variant="hero-secondary" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-sm text-muted-foreground">
            No credit card required • Export unlimited PDFs • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
