export default function Education() {
  return (
    <section
      id="education"
      className="mx-auto max-w-7xl px-8 py-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        02 — Education
      </p>

      <h2 className="text-4xl font-bold">
        Education
      </h2>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-2xl font-semibold">
              University of Geneva
            </h3>

            <p className="mt-2 text-gray-300">
              Mathematics, Computer Science & Digital Sciences
            </p>
          </div>

          <p className="text-gray-500">
            Geneva, Switzerland
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            "Mathematics",
            "Algorithms",
            "Java",
            "Python",
            "C",
            "Databases",
            "Computer Networks",
            "Cryptography",
          ].map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-300"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}