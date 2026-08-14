const areas = [
  {
    symbol: "∑",
    title: "Mathematics",
    description:
      "Mathematical foundations developed through my university studies.",
    topics: [
      "Linear Algebra",
      "Probability",
      "Discrete Mathematics",
      "Geometry",
      "Mathematical Reasoning",
      "Numerical Analysis"
    ],
  },

  {
    symbol: "</>",
    title: "Computer Science",
    description:
      "Core concepts of programming and computer science explored through coursework and practice.",
    topics: [
      "Java",
      "Object-Oriented Programming",
      "Functional Programming",
      "Data Structures",
      "Databases",
      "Algorithms",
      "Calculability & Complexity"
    ],
  },

  {
    symbol: "◎",
    title: "Computer Networks",
    description:
      "Understanding how computer systems communicate and exchange information.",
    topics: [
      "TCP/IP",
      "Network Protocols",
      "Routing & Subnetting",
      "DNS & ARP",
      "Error Detection",
    ],
  },

  {
    symbol: "ψ",
    title: "Quantum Information",
    description:
      "Developing an understanding of the foundations of quantum information and quantum cryptography.",
    topics: [
      "Qubits",
      "Quantum Measurement",
      "Superposition",
      "Entanglement",
      "Quantum Key Distribution",
    ],
  },
];

export default function AcademicJourney() {
  return (
    <section
      id="journey"
      className="mx-auto max-w-7xl px-8 py-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        05 — Journey
      </p>

      <h2 className="text-4xl font-bold">
        Academic & Technical Journey
      </h2>

      <p className="mt-4 max-w-2xl leading-7 text-gray-400">
        A snapshot of the mathematical and computer science foundations
        I have developed through my studies and personal exploration.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">

        {areas.map((area) => (
          <article
            key={area.title}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.05]"
          >

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/5 text-xl text-blue-300">
                {area.symbol}
              </div>

              <h3 className="text-xl font-semibold">
                {area.title}
              </h3>
            </div>

            <p className="mt-5 leading-7 text-gray-400">
              {area.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {area.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-300"
                >
                  {topic}
                </span>
              ))}
            </div>

          </article>
        ))}

      </div>
    </section>
  );
}