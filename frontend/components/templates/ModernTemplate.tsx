export function ModernTemplate({ data }: { data: any }) {
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
    <div className="w-full bg-white text-gray-900 p-8 font-sans" style={{ fontSize: "11pt" }}>
      <div className="flex justify-between items-end border-b-2 pb-4 mb-6" style={{ borderColor: "#14B8A6" }}>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{contact.fullName || "Your Name"}</h1>
          <p className="text-lg text-[#14B8A6] font-medium mt-1">{contact.jobTitle}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>{contact.location}</p>
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Work Experience</h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{exp.title}</span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="italic text-sm text-gray-600 mb-1">{exp.company}</div>
                {exp.description && <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Education</h2>
          <div className="flex flex-col gap-4">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{edu.degree}</span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="italic text-sm text-gray-600">{edu.school} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Projects</h2>
          <div className="flex flex-col gap-4">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{proj.name}</span>
                </div>
                {(proj.link || proj.tools) && (
                  <div className="italic text-sm text-gray-600 mb-1 flex flex-wrap items-center gap-1">
                    {proj.tools && <span>{proj.tools}</span>}
                    {proj.tools && proj.link && <span>|</span>}
                    {proj.link && (
                      <a 
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#14B8A6] hover:text-teal-700 hover:underline ml-1"
                      >
                        (Live View)
                      </a>
                    )}
                  </div>
                )}
                {proj.description && <p className="text-sm text-gray-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Certifications</h2>
          <div className="flex flex-col gap-3">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="text-sm text-gray-800">
                <div className="flex justify-between">
                  <span>
                    <span className="font-bold">{cert.name}</span>, {cert.issuer}
                    {cert.link && (
                      <a 
                        href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-xs text-[#14B8A6] hover:text-teal-700 hover:underline"
                      >
                        (View Certificate)
                      </a>
                    )}
                  </span>
                  <span className="text-gray-500">{formatDate(cert.date)}</span>
                </div>
                {cert.description && <p className="mt-0.5 text-gray-700 whitespace-pre-wrap">{cert.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color: "#14B8A6" }}>Skills</h2>
          <p className="text-sm text-gray-700">{skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
