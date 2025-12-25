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
      className="bg-white rounded shadow-lg overflow-hidden flex-shrink-0"
      style={{ 
        width: `${210 * scale * 2.5}px`,
        height: template.pages === 2 ? `${297 * scale * 2.5 * 1.5}px` : `${297 * scale * 2.5}px`,
      }}
    >
      <div 
        className="origin-top-left text-gray-900"
        style={{ 
          width: "210mm",
          minHeight: template.pages === 2 ? "420mm" : "297mm",
          transform: `scale(${scale * 0.95})`,
          transformOrigin: "top left",
          fontSize: "11pt",
          lineHeight: 1.45
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

const SingleColumnLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="p-10 bg-white min-h-full">
    {/* Header */}
    <div className="text-center mb-6 pb-5 border-b-2" style={{ borderColor: template.accentColor }}>
      {template.hasPhoto && data.personalInfo.photo && (
        <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 shadow-md" style={{ borderColor: template.accentColor }}>
          <img 
            src={data.personalInfo.photo} 
            alt={data.personalInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: template.fontPrimary }}>
        {data.personalInfo.name}
      </h1>
      <p className="text-base font-semibold mb-3" style={{ color: template.accentColor }}>
        {data.personalInfo.title}
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span>✉</span> {data.personalInfo.email}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span>☎</span> {data.personalInfo.phone}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span>📍</span> {data.personalInfo.location}
        </span>
        {data.personalInfo.linkedin && (
          <>
            <span>•</span>
            <span>{data.personalInfo.linkedin}</span>
          </>
        )}
      </div>
    </div>

    {/* Summary */}
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
        Professional Summary
      </h2>
      <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
    </section>

    {/* Experience */}
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
        Professional Experience
      </h2>
      {data.experience.map((exp) => (
        <div key={exp.id} className="mb-5">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
            <span className="text-xs text-gray-500 font-medium">{exp.startDate} — {exp.endDate}</span>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">{exp.company} | {exp.location}</p>
          <ul className="text-sm text-gray-700 space-y-1.5">
            {exp.bullets.map((bullet, i) => (
              <li key={i} className="flex leading-relaxed">
                <span className="mr-2 text-gray-400">▸</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    {/* Education */}
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
        Education
      </h2>
      {data.education.map((edu) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
            <span className="text-xs text-gray-500">{edu.startDate} — {edu.endDate}</span>
          </div>
          <p className="text-sm text-gray-600">{edu.degree} in {edu.field}</p>
          {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </section>

    {/* Skills */}
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
        Skills
      </h2>
      <div className="space-y-2">
        {data.skills.map((cat, i) => (
          <div key={i} className="flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold text-gray-700 mr-2">{cat.category}:</span>
            {cat.items.map((skill, j) => (
              <span 
                key={j} 
                className="px-2 py-0.5 text-xs rounded text-gray-700"
                style={{ backgroundColor: `${template.accentColor}15` }}
              >
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
          Certifications
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="text-sm">
              <p className="font-medium text-gray-800">{cert.name}</p>
              <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

const SidebarLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="flex min-h-full">
    {/* Sidebar */}
    <div 
      className="w-[75mm] p-6 text-white min-h-full"
      style={{ backgroundColor: template.accentColor }}
    >
      {/* Photo */}
      {template.hasPhoto && data.personalInfo.photo && (
        <div className="w-24 h-24 rounded-full mx-auto mb-5 overflow-hidden border-4 border-white/30 shadow-lg">
          <img 
            src={data.personalInfo.photo} 
            alt={data.personalInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h1 className="text-xl font-bold text-center mb-1" style={{ fontFamily: template.fontPrimary }}>
        {data.personalInfo.name}
      </h1>
      <p className="text-xs text-center text-white/80 mb-6">{data.personalInfo.title}</p>

      {/* Contact */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70 border-b border-white/20 pb-1">Contact</h3>
        <div className="space-y-2 text-xs text-white/90">
          <p className="flex items-start gap-2"><span>✉</span> {data.personalInfo.email}</p>
          <p className="flex items-start gap-2"><span>☎</span> {data.personalInfo.phone}</p>
          <p className="flex items-start gap-2"><span>📍</span> {data.personalInfo.location}</p>
          {data.personalInfo.linkedin && (
            <p className="flex items-start gap-2"><span>🔗</span> {data.personalInfo.linkedin}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70 border-b border-white/20 pb-1">Skills</h3>
        <div className="space-y-3">
          {data.skills.map((cat, i) => (
            <div key={i}>
              <p className="text-[10px] font-semibold text-white/60 mb-1.5">{cat.category}</p>
              <div className="flex flex-wrap gap-1">
                {cat.items.map((skill, j) => (
                  <span key={j} className="text-[10px] px-2 py-0.5 bg-white/15 rounded text-white/90">
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
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70 border-b border-white/20 pb-1">Languages</h3>
          <div className="space-y-1.5 text-xs">
            {data.languages.map((lang, i) => (
              <p key={i} className="text-white/90 flex justify-between">
                <span>{lang.language}</span>
                <span className="text-white/60">{lang.proficiency}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70 border-b border-white/20 pb-1">Certifications</h3>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-xs">
                <p className="font-medium text-white/90">{cert.name}</p>
                <p className="text-white/50 text-[10px]">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Main Content */}
    <div className="flex-1 p-6 bg-white">
      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: template.accentColor, borderColor: template.accentColor }}>
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: template.accentColor, borderColor: template.accentColor }}>
          Experience
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
              <span className="text-[10px] text-gray-500">{exp.startDate} — {exp.endDate}</span>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-1.5">{exp.company} | {exp.location}</p>
            <ul className="text-xs text-gray-700 space-y-1">
              {exp.bullets.slice(0, 3).map((bullet, i) => (
                <li key={i} className="flex leading-relaxed">
                  <span className="mr-1.5 text-gray-400">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: template.accentColor, borderColor: template.accentColor }}>
          Education
        </h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <h3 className="text-sm font-bold text-gray-900">{edu.school}</h3>
            <p className="text-xs text-gray-600">{edu.degree} in {edu.field}</p>
            <p className="text-[10px] text-gray-500">{edu.startDate} — {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
);

const TwoColumnLayout = ({ template, data }: { template: TemplateConfig; data: ResumeData }) => (
  <div className="p-8 bg-white min-h-full">
    {/* Header with Photo */}
    <div className="flex items-start gap-6 mb-6 pb-5 border-b-2" style={{ borderColor: template.accentColor }}>
      {template.hasPhoto && data.personalInfo.photo && (
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
          <img 
            src={data.personalInfo.photo} 
            alt={data.personalInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: template.fontPrimary }}>
          {data.personalInfo.name}
        </h1>
        <p className="text-base font-semibold mb-2" style={{ color: template.accentColor }}>
          {data.personalInfo.title}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
    </div>

    {/* Two Column Content */}
    <div className="flex gap-6">
      {/* Left Column - Main */}
      <div className="flex-1">
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                <span className="text-[10px] text-gray-500">{exp.startDate} — {exp.endDate}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">{exp.company} | {exp.location}</p>
              <ul className="text-xs text-gray-700 space-y-0.5">
                {exp.bullets.slice(0, 3).map((bullet, i) => (
                  <li key={i} className="flex">
                    <span className="mr-1.5 text-gray-400">▸</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {/* Right Column */}
      <div className="w-[65mm]">
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
            Skills
          </h2>
          {data.skills.map((cat, i) => (
            <div key={i} className="mb-3">
              <p className="text-[10px] font-semibold text-gray-600 mb-1">{cat.category}</p>
              <div className="flex flex-wrap gap-1">
                {cat.items.map((skill, j) => (
                  <span 
                    key={j} 
                    className="text-[10px] px-2 py-0.5 rounded text-gray-700"
                    style={{ backgroundColor: `${template.accentColor}18` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <h3 className="text-xs font-bold text-gray-900">{edu.school}</h3>
              <p className="text-[10px] text-gray-600">{edu.degree}</p>
              <p className="text-[10px] text-gray-500">{edu.endDate}</p>
            </div>
          ))}
        </section>

        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: template.accentColor, borderColor: template.accentColor }}>
              Certifications
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-xs font-medium text-gray-800">{cert.name}</p>
                <p className="text-[10px] text-gray-500">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

export default TemplatePreview;
