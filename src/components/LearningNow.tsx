export default function LearningNow() {
  const topics = [
    {
      title: "Quantum Cryptography",
      description:
        "Deepening my understanding of quantum key distribution, BB84 security, eavesdropping detection and QBER.",
      status: "Currently studying",
    },
    {
      title: "Post-Quantum Cryptography",
      description:
        "Exploring cryptographic systems designed to remain secure against quantum attacks.",
      status: "Exploring",
    },
    {
      title: "Java",
      description:
        "Working with map, filter, reduce, flatMap, Optional and functional programming concepts.",
      status: "In progress",
    },
    {
      title: "Computer Networks",
      description:
        "Strengthening my understanding of network protocols and secure communications.",
      status: "In progress",
    },
  ];

  return (
    <section
      id="learning"
      className="mx-auto max-w-7xl px-8 py-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        03 — Learning
      </p>

      <h2 className="text-4xl font-bold">
        What I&apos;m learning now
      </h2>

      <p className="mt-4 max-w-2xl text-gray-400">
        Topics I am currently studying and exploring as part of my academic
        work and personal development.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <span className="text-sm text-blue-400">
              {topic.status}
            </span>

            <h3 className="mt-3 text-xl font-semibold">
              {topic.title}
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              {topic.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}