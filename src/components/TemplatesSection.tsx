import { motion } from "framer-motion";

const templates = [
  {
    name: "Executive",
    style: "Traditional serif, maximum whitespace",
    color: "hsl(var(--emerald-slate))",
  },
  {
    name: "Modern",
    style: "Clean sans-serif, subtle accents",
    color: "hsl(var(--royal-indigo))",
  },
  {
    name: "Technical",
    style: "Monospace touches, structured layout",
    color: "hsl(var(--soft-gray))",
  },
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="section-spacing relative">
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
            Templates that <span className="font-serif italic">pass</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every template tested against real ATS systems. No parsing errors. No formatting issues. Just clean, professional documents.
          </p>
        </motion.div>

        {/* Template Previews */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group cursor-pointer"
            >
              {/* Template Card */}
              <div className="relative mb-4">
                <div className="aspect-[210/297] bg-pearl rounded-sm shadow-paper overflow-hidden group-hover:shadow-elevated transition-shadow duration-500">
                  {/* Mini Resume Preview */}
                  <div className="p-4 h-full">
                    {/* Header */}
                    <div className="mb-3">
                      <div className="h-2.5 w-20 bg-carbon/80 rounded-sm mb-1.5" />
                      <div className="h-1.5 w-14 bg-carbon/30 rounded-sm" />
                    </div>
                    
                    {/* Accent Line */}
                    <div 
                      className="h-0.5 w-full mb-3 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    
                    {/* Content Blocks */}
                    <div className="space-y-2.5">
                      <div>
                        <div className="h-1.5 w-12 mb-1.5 rounded-sm" style={{ backgroundColor: template.color }} />
                        <div className="h-1 w-full bg-carbon/10 rounded-sm mb-0.5" />
                        <div className="h-1 w-11/12 bg-carbon/10 rounded-sm mb-0.5" />
                        <div className="h-1 w-4/5 bg-carbon/10 rounded-sm" />
                      </div>
                      
                      <div>
                        <div className="h-1.5 w-14 mb-1.5 rounded-sm" style={{ backgroundColor: template.color }} />
                        <div className="flex justify-between mb-1">
                          <div className="h-1.5 w-16 bg-carbon/50 rounded-sm" />
                          <div className="h-1 w-10 bg-carbon/20 rounded-sm" />
                        </div>
                        <div className="h-1 w-full bg-carbon/10 rounded-sm mb-0.5" />
                        <div className="h-1 w-10/12 bg-carbon/10 rounded-sm" />
                      </div>
                      
                      <div>
                        <div className="h-1.5 w-10 mb-1.5 rounded-sm" style={{ backgroundColor: template.color }} />
                        <div className="flex gap-1 flex-wrap">
                          <div className="h-2.5 w-8 bg-carbon/5 rounded-sm" />
                          <div className="h-2.5 w-10 bg-carbon/5 rounded-sm" />
                          <div className="h-2.5 w-6 bg-carbon/5 rounded-sm" />
                          <div className="h-2.5 w-9 bg-carbon/5 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-sm font-medium text-primary">Preview Template</span>
                </div>
              </div>

              {/* Template Info */}
              <div className="text-center">
                <h3 className="font-medium mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.style}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Templates CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <span className="text-muted-foreground">
            12+ premium templates included • 
            <span className="text-foreground ml-1 link-underline cursor-pointer">View all templates</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default TemplatesSection;
