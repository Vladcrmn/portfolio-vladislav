import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
});

const quotes = [
  {
    text: "Let's change the world-starting with ourselves.",
    author: "Senku Ishigami",
  },
  {
    text: "The important thing is not to stop questioning.",
    author: "Albert Einstein",
  },
  {
  text: "What a joy it is to have a high moral ideal and a strong passion for science, keeping you from many temptations — or rather, helping you resist them.",
  author: "Théodore Monod",
  },
  {
  text: "It is impossible to be a mathematician without being a poet in soul.",
  author: "Sofia Kovalevskaya",
  },
  {
  text: "Scientists do not seek the truth; it is the truth that pursues them.",
  author: "Karl Schlechta",
  },
  {
  text: "Every great advance in science has issued from a new audacity of imagination.",
  author: "John Dewey",
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
  },
];

export default function QuoteOfTheDay() {

  const today = new Date();

  const startOfYear = new Date(
    today.getFullYear(),
    0,
    0
  );

  const difference =
    today.getTime() - startOfYear.getTime();

  const dayOfYear = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const quoteIndex = dayOfYear % quotes.length;

  const quote = quotes[quoteIndex];

  return (
    <section className="mx-auto max-w-5xl px-8 py-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-8 text-center">
        <p className="text-sm uppercase tracking-widest text-blue-400">
          Scientific thought of the day
        </p>

        <blockquote
        className={`${playfair.className} mt-6 text-3xl italic leading-relaxed text-gray-100`}
        >
        “{quote.text}”
        </blockquote>

        <p className="mt-4 text-sm tracking-wide text-gray-500">
        — {quote.author}
        </p>

        <span
        className={`${playfair.className} absolute left-6 top-0 text-8xl text-blue-400/10`}
        >
        “
        </span>

      </div>
    </section>
  );
}