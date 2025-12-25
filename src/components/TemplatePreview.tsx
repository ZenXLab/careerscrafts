import { ResumeData, TemplateConfig } from "@/types/resume";

interface TemplatePreviewProps {
  template: TemplateConfig;
  data: ResumeData;
  scale?: number;
}

const TemplatePreview = ({ template, data, scale = 0.35 }: TemplatePreviewProps) => {
  const renderTemplate = () => {
    switch (template.layout) {
      case "sidebar":
        return <SidebarLayout template={template} data={data} />;
      case "two-column":
        return <TwoColumnLayout template={template} data={data} />;
      default:
        return <SingleColumnLayout template={template} data={data} />;
    }
  };

  return (
    <div 
      className="bg-pearl rounded-sm shadow-paper overflow-hidden origin-top-left"
      style={{ 
        width: 210 * (scale / 0.35),
        height: template.pages === 2 ? 594 * (scale / 0.35) : 297 * (scale / 0.35),
        transform: `scale(${scale / 0.35})`,
        transformOrigin: "top left"
      }}
    >
      <div 
        className="w-[210mm] text-carbon"
        style={{ 
          height: template.pages === 2 ? "594mm" : "297mm",
          fontSize: "10pt",
          lineHeight: 1.4
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

const SingleColumnLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="p-8">
    {/* Header */}
    <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: template.accentColor }}>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: template.fontPrimary }}>
        {data.personalInfo.name}
      </h1>
      <p className="text-sm font-medium mb-2" style={{ color: template.accentColor }}>
        {data.personalInfo.title}
      </p>
      <div className="flex justify-center gap-4 text-xs text-carbon/70">
        <span>{data.personalInfo.email}</span>
        <span>•</span>
        <span>{data.personalInfo.phone}</span>
        <span>•</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </div>

    {/* Summary */}
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
        Professional Summary
      </h2>
      <p className="text-xs leading-relaxed text-carbon/80">{data.summary}</p>
    </section>

    {/* Experience */}
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: template.accentColor }}>
        Experience
      </h2>
      {data.experience.slice(0, 2).map((exp) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-sm font-semibold">{exp.position}</h3>
            <span className="text-xs text-carbon/60">{exp.startDate} - {exp.endDate}</span>
          </div>
          <p className="text-xs font-medium text-carbon/70 mb-1">{exp.company} • {exp.location}</p>
          <ul className="text-xs text-carbon/80 space-y-0.5">
            {exp.bullets.slice(0, 3).map((bullet, i) => (
              <li key={i} className="flex">
                <span className="mr-2">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    {/* Education */}
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
        Education
      </h2>
      {data.education.slice(0, 1).map((edu) => (
        <div key={edu.id}>
          <div className="flex justify-between items-baseline">
            <h3 className="text-sm font-semibold">{edu.school}</h3>
            <span className="text-xs text-carbon/60">{edu.endDate}</span>
          </div>
          <p className="text-xs text-carbon/70">{edu.degree} in {edu.field}</p>
        </div>
      ))}
    </section>

    {/* Skills */}
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
        Skills
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {data.skills.flatMap(s => s.items).slice(0, 12).map((skill, i) => (
          <span 
            key={i} 
            className="px-2 py-0.5 text-xs rounded"
            style={{ backgroundColor: `${template.accentColor}15` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  </div>
);

const SidebarLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="flex h-full">
    {/* Sidebar */}
    <div 
      className="w-[70mm] p-5 text-pearl"
      style={{ backgroundColor: template.accentColor }}
    >
      {/* Photo */}
      {template.hasPhoto && data.personalInfo.photo && (
        <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-3 border-pearl/30">
          <img 
            src={data.personalInfo.photo} 
            alt={data.personalInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h1 className="text-lg font-bold text-center mb-1" style={{ fontFamily: template.fontPrimary }}>
        {data.personalInfo.name}
      </h1>
      <p className="text-xs text-center text-pearl/80 mb-4">{data.personalInfo.title}</p>

      {/* Contact */}
      <div className="mb-5">
        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-2 text-pearl/70">Contact</h3>
        <div className="space-y-1 text-[9px] text-pearl/90">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-5">
        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-2 text-pearl/70">Skills</h3>
        <div className="space-y-2">
          {data.skills.slice(0, 2).map((cat, i) => (
            <div key={i}>
              <p className="text-[8px] font-medium text-pearl/60 mb-1">{cat.category}</p>
              <div className="flex flex-wrap gap-1">
                {cat.items.slice(0, 4).map((skill, j) => (
                  <span key={j} className="text-[8px] px-1.5 py-0.5 bg-pearl/10 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      {data.languages && (
        <div>
          <h3 className="text-[9px] font-bold uppercase tracking-widest mb-2 text-pearl/70">Languages</h3>
          <div className="space-y-1 text-[9px]">
            {data.languages.map((lang, i) => (
              <p key={i} className="text-pearl/90">{lang.language} — {lang.proficiency}</p>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Main Content */}
    <div className="flex-1 p-5">
      {/* Summary */}
      <section className="mb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
          About
        </h2>
        <p className="text-[9px] leading-relaxed text-carbon/80">{data.summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
          Experience
        </h2>
        {data.experience.slice(0, 2).map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="text-[10px] font-semibold">{exp.position}</h3>
              <span className="text-[8px] text-carbon/50">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-[9px] text-carbon/60 mb-1">{exp.company}</p>
            <ul className="text-[8px] text-carbon/80 space-y-0.5">
              {exp.bullets.slice(0, 2).map((bullet, i) => (
                <li key={i} className="flex">
                  <span className="mr-1.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
          Education
        </h2>
        {data.education.slice(0, 1).map((edu) => (
          <div key={edu.id}>
            <h3 className="text-[10px] font-semibold">{edu.school}</h3>
            <p className="text-[8px] text-carbon/70">{edu.degree} in {edu.field} • {edu.endDate}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
);

const TwoColumnLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="p-6">
    {/* Header with Photo */}
    <div className="flex items-start gap-5 mb-5 pb-4 border-b-2" style={{ borderColor: template.accentColor }}>
      {template.hasPhoto && data.personalInfo.photo && (
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={data.personalInfo.photo} 
            alt={data.personalInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-0.5" style={{ fontFamily: template.fontPrimary }}>
          {data.personalInfo.name}
        </h1>
        <p className="text-sm font-medium mb-1.5" style={{ color: template.accentColor }}>
          {data.personalInfo.title}
        </p>
        <div className="flex gap-3 text-[9px] text-carbon/70">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
    </div>

    {/* Two Column Content */}
    <div className="flex gap-5">
      {/* Left Column - Main */}
      <div className="flex-1">
        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
            Summary
          </h2>
          <p className="text-[9px] leading-relaxed text-carbon/80">{data.summary}</p>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
            Experience
          </h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[10px] font-semibold">{exp.position}</h3>
                <span className="text-[8px] text-carbon/50">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-[9px] text-carbon/60 mb-1">{exp.company} • {exp.location}</p>
              <ul className="text-[8px] text-carbon/80 space-y-0.5">
                {exp.bullets.slice(0, 2).map((bullet, i) => (
                  <li key={i} className="flex">
                    <span className="mr-1.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {/* Right Column - Secondary */}
      <div className="w-[60mm]">
        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
            Skills
          </h2>
          {data.skills.slice(0, 2).map((cat, i) => (
            <div key={i} className="mb-2">
              <p className="text-[8px] font-medium text-carbon/60 mb-1">{cat.category}</p>
              <div className="flex flex-wrap gap-1">
                {cat.items.slice(0, 4).map((skill, j) => (
                  <span 
                    key={j} 
                    className="text-[8px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${template.accentColor}15` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
            Education
          </h2>
          {data.education.slice(0, 1).map((edu) => (
            <div key={edu.id}>
              <h3 className="text-[9px] font-semibold">{edu.school}</h3>
              <p className="text-[8px] text-carbon/70">{edu.degree}</p>
              <p className="text-[8px] text-carbon/50">{edu.endDate}</p>
            </div>
          ))}
        </section>

        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accentColor }}>
              Certifications
            </h2>
            {data.certifications.slice(0, 2).map((cert) => (
              <div key={cert.id} className="mb-1.5">
                <p className="text-[9px] font-medium">{cert.name}</p>
                <p className="text-[8px] text-carbon/60">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

export default TemplatePreview;
