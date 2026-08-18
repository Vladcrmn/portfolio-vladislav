const skillGroups = [
  {
    title: "Programming",
    description: "Languages used in coursework and personal projects.",
    skills: ["Python", "Java", "TypeScript", "SQL", "C"],
  },
  {
    title: "Web Development",
    description: "Tools used to build and deploy interactive applications.",
    skills: ["Next.js", "React", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Cryptography & Security",
    description: "Topics explored through independent study and projects.",
    skills: [
      "Quantum Key Distribution",
      "BB84",
      "QBER Analysis",
      "Error Correction",
      "Privacy Amplification",
      "Post-Quantum Cryptography",
    ],
  },
  {
    title: "Computer Science",
    description: "Core concepts developed through university coursework.",
    skills: [
      "Object-Oriented Programming",
      "Data Structures",
      "Functional Programming",
      "Computer Networks",
      "Relational Databases",
    ],
  },
  {
    title: "Tools",
    description: "Development, testing, version-control, and deployment tools.",
    skills: ["Git", "GitHub", "VS Code", "Vercel", "JUnit", "unittest"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-400">
            Skills
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Technologies and concepts
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            Technologies and concepts I currently use through university
            coursework, personal projects, and independent study.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.05]"
            >
              <h3 className="text-lg font-semibold text-white">
                {group.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {group.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs text-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}