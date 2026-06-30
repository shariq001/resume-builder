export function MinimalTemplate({ data }: { data: any }) {
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
    <div className="w-full bg-white text-gray-800 p-10 font-sans" style={{ fontSize: "11pt" }}>
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-2">{contact.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
          {contact.jobTitle && <span className="font-medium text-gray-700">{contact.jobTitle}</span>}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_3fr] gap-8">
        <div className="space-y-8">
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
              <ul className="flex flex-col gap-1 text-sm">
                {skills.map((skill: string, i: number) => (
                  <li key={i} className="text-gray-700">{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
              <div className="flex flex-col gap-4">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <div className="font-medium text-gray-900 text-sm">{edu.degree}</div>
                    <div className="text-sm text-gray-600 mt-1">{edu.school}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Certifications</h2>
              <div className="flex flex-col gap-4">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{cert.name}</h3>
                      {cert.link && (
                        <a 
                          href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-1 text-xs text-blue-500 hover:text-blue-600 hover:underline"
                        >
                          (View Certificate)
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{cert.issuer}</div>
                    {cert.description && <p className="mt-1 text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{cert.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {summary && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Profile</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
              <div className="flex flex-col gap-6">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-gray-900">{exp.title}</h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{exp.company}</div>
                    {exp.description && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
              <div className="flex flex-col gap-5">
                {projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{proj.name}</h3>
                      {proj.link && (
                        <a 
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
                        >
                          (Live View)
                        </a>
                      )}
                    </div>
                    {proj.tools && <div className="text-xs font-mono text-gray-500 mb-2">{proj.tools}</div>}
                    {proj.description && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
