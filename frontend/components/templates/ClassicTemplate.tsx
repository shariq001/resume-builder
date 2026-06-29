export function ClassicTemplate({ data }: { data: any }) {
  const contact = data?.contact || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const certifications = data?.certifications || [];
  const projects = data?.projects || [];
  const skills = data?.skills || [];
  const summary = data?.summary || "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full bg-white text-black p-8 font-serif" style={{ fontFamily: "Georgia, serif", fontSize: "11pt" }}>
      {/* Contact Info */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">{contact.fullName || "Your Name"}</h1>
        {contact.jobTitle && <p className="text-md italic mb-2">{contact.jobTitle}</p>}
        <p className="text-sm">
          {[contact.location, contact.phone, contact.email].filter(Boolean).join(" | ")}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Professional Summary</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Work Experience</h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold">
                  <span>{exp.title}</span>
                  <span>
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="italic text-sm mb-1">{exp.company}</div>
                {exp.description && <p className="text-sm whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Education</h2>
          <div className="flex flex-col gap-4">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold">
                  <span>{edu.degree}</span>
                  <span>
                    {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="italic text-sm">{edu.school} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Projects</h2>
          <div className="flex flex-col gap-4">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold">
                  <span>{proj.name}</span>
                </div>
                {(proj.link || proj.tools) && (
                  <div className="italic text-sm mb-1 flex flex-wrap items-center gap-1">
                    {proj.tools && <span>{proj.tools}</span>}
                    {proj.tools && proj.link && <span>|</span>}
                    {proj.link && (
                      <a 
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline ml-1"
                      >
                        (Live View)
                      </a>
                    )}
                  </div>
                )}
                {proj.description && <p className="text-sm whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Certifications</h2>
          <div className="flex flex-col gap-3">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="text-sm">
                <div className="flex justify-between">
                  <span>
                    <span className="font-bold">{cert.name}</span>, {cert.issuer}
                    {cert.link && (
                      <a 
                        href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-xs italic text-blue-600 hover:underline"
                      >
                        (View Certificate)
                      </a>
                    )}
                  </span>
                  <span>{formatDate(cert.date)}</span>
                </div>
                {cert.description && <p className="mt-0.5 whitespace-pre-wrap">{cert.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Skills</h2>
          <p className="text-sm">{skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
