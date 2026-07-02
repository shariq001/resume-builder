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
    <div className="w-full bg-white text-gray-800 p-8 font-serif" style={{ fontFamily: "Georgia, serif", fontSize: "11pt" }}>
      {/* Contact Info */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-0.5 text-gray-900">{contact.fullName || "Your Name"}</h1>
        {contact.jobTitle && <p className="text-md italic mb-1 text-gray-700">{contact.jobTitle}</p>}
        <p className="text-sm text-gray-600">
          {[contact.location, contact.phone, contact.email, contact.linkedin, contact.github].filter(Boolean).join("  •  ")}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Professional Summary</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Work Experience</h2>
          <div className="flex flex-col gap-2.5">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{exp.title}</span>
                  <span className="text-sm font-normal text-gray-600">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="italic text-sm text-gray-700 mb-0.5">{exp.company}</div>
                {exp.description && <p className="text-sm whitespace-pre-wrap text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Education</h2>
          <div className="flex flex-col gap-2.5">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{edu.degree}</span>
                  <span className="text-sm font-normal text-gray-600">
                    {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="italic text-sm text-gray-700">{edu.school} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Projects</h2>
          <div className="flex flex-col gap-2.5">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{proj.name}</span>
                </div>
                {(proj.link || proj.tools) && (
                  <div className="italic text-sm mb-0.5 flex flex-wrap items-center gap-1 text-gray-600">
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
                {proj.description && <p className="text-sm whitespace-pre-wrap text-gray-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Certifications</h2>
          <div className="flex flex-col gap-2">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-800">
                    <span className="font-bold text-gray-900">{cert.name}</span>, {cert.issuer}
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
                  <span className="text-gray-600">{formatDate(cert.date)}</span>
                </div>
                {cert.description && <p className="mt-0.5 whitespace-pre-wrap text-gray-700">{cert.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase border-b border-gray-400 text-gray-900 mb-1.5 pb-0.5 tracking-wide">Skills</h2>
          <p className="text-sm text-gray-700">{skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
