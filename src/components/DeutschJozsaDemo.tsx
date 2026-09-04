"use client";

import { useMemo, useState } from "react";

type OracleFamily = "constant" | "balanced";
type ConstantValue = 0 | 1;
type BalancedRule = "parity" | "half";

type SimulationResult = {
  phases: number[];
  probabilities: number[];
  measuredState: number;
  conclusion: OracleFamily;
};

function toBinary(value: number, width: number) {
  return value.toString(2).padStart(width, "0");
}

function popcount(value: number) {
  let count = 0;
  while (value > 0) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

function oracleValue(
  x: number,
  numberOfQubits: number,
  family: OracleFamily,
  constantValue: ConstantValue,
  balancedRule: BalancedRule
) {
  if (family === "constant") return constantValue;
  if (balancedRule === "parity") return (x % 2) as ConstantValue;
  return (x < 2 ** (numberOfQubits - 1) ? 0 : 1) as ConstantValue;
}

function runDeutschJozsa(
  numberOfQubits: number,
  family: OracleFamily,
  constantValue: ConstantValue,
  balancedRule: BalancedRule
): SimulationResult {
  const stateCount = 2 ** numberOfQubits;
  const phases = Array.from({ length: stateCount }, (_, x) =>
    oracleValue(x, numberOfQubits, family, constantValue, balancedRule) === 0 ? 1 : -1
  );

  const probabilities = Array.from({ length: stateCount }, (_, z) => {
    let sum = 0;
    for (let x = 0; x < stateCount; x++) {
      const hadamardSign = popcount(x & z) % 2 === 0 ? 1 : -1;
      sum += phases[x] * hadamardSign;
    }
    return (sum / stateCount) ** 2;
  });

  const measuredState = probabilities.reduce(
    (best, probability, index) => probability > probabilities[best] ? index : best,
    0
  );

  return {
    phases,
    probabilities,
    measuredState,
    conclusion: probabilities[0] > 1 - 1e-10 ? "constant" : "balanced",
  };
}

export default function DeutschJozsaDemo() {
  const [numberOfQubits, setNumberOfQubits] = useState(3);
  const [family, setFamily] = useState<OracleFamily>("balanced");
  const [constantValue, setConstantValue] = useState<ConstantValue>(0);
  const [balancedRule, setBalancedRule] = useState<BalancedRule>("parity");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const inputs = useMemo(
    () => Array.from({ length: 2 ** numberOfQubits }, (_, x) => x),
    [numberOfQubits]
  );

  function selectFamily(nextFamily: OracleFamily) {
    setFamily(nextFamily);
    setResult(null);
  }

  function handleQubitChange(value: number) {
    setNumberOfQubits(value);
    setResult(null);
  }

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-violet-400/20 bg-[#081522]">
      <div className="grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
            Interactive demo
          </p>
          <h4 className="mt-2 text-2xl font-semibold">Run Deutsch–Jozsa</h4>
          <p className="mt-3 max-w-xl leading-7 text-gray-400">
            Hide a promised function inside the oracle. The algorithm must decide
            whether it is constant or balanced with one oracle query.
          </p>

          <fieldset className="mt-8">
            <legend className="text-sm font-medium text-gray-300">Oracle promise</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(["constant", "balanced"] as OracleFamily[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={family === option}
                  onClick={() => selectFamily(option)}
                  className={`rounded-xl border px-4 py-3 text-left capitalize transition ${
                    family === option
                      ? "border-violet-400 bg-violet-400/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <label htmlFor="dj-qubits" className="font-medium text-gray-300">
                Input qubits
              </label>
              <span className="font-mono text-violet-300">n = {numberOfQubits}</span>
            </div>
            <input
              id="dj-qubits"
              type="range"
              min="1"
              max="5"
              value={numberOfQubits}
              onChange={(event) => handleQubitChange(Number(event.target.value))}
              className="w-full accent-violet-400"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-gray-300">Hidden function</legend>
            {family === "constant" ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {([0, 1] as ConstantValue[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={constantValue === value}
                    onClick={() => {
                      setConstantValue(value);
                      setResult(null);
                    }}
                    className={`rounded-xl border px-4 py-3 font-mono transition ${
                      constantValue === value
                        ? "border-violet-400 bg-violet-400/10 text-white"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    f(x) = {value}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={balancedRule === "parity"}
                  onClick={() => {
                    setBalancedRule("parity");
                    setResult(null);
                  }}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    balancedRule === "parity"
                      ? "border-violet-400 bg-violet-400/10 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <span className="block font-mono">f(x) = x mod 2</span>
                  <span className="mt-1 block text-xs text-gray-500">Parity</span>
                </button>
                <button
                  type="button"
                  aria-pressed={balancedRule === "half"}
                  onClick={() => {
                    setBalancedRule("half");
                    setResult(null);
                  }}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    balancedRule === "half"
                      ? "border-violet-400 bg-violet-400/10 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <span className="block font-mono">f(x) = MSB(x)</span>
                  <span className="mt-1 block text-xs text-gray-500">First half / second half</span>
                </button>
              </div>
            )}
          </fieldset>

          <button
            type="button"
            onClick={() => setResult(runDeutschJozsa(numberOfQubits, family, constantValue, balancedRule))}
            className="mt-8 w-full rounded-xl bg-violet-500 px-5 py-3 font-medium text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-[#081522]"
          >
            Query the oracle once
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 lg:p-6">
          {!result ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-violet-400/30 bg-violet-400/10 font-mono text-2xl text-violet-300">
                H<sup className="text-xs">⊗n</sup>
              </div>
              <p className="mt-6 font-medium text-gray-200">The oracle is ready</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Choose a promised function, then run the algorithm to reveal its interference pattern.
              </p>
            </div>
          ) : (
            <div aria-live="polite">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Measurement</p>
                  <p className="mt-2 font-mono text-4xl font-semibold text-white">
                    |{toBinary(result.measuredState, numberOfQubits)}⟩
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  result.conclusion === "constant"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                    : "border-violet-400/30 bg-violet-400/10 text-violet-300"
                }`}>
                  {result.conclusion === "constant" ? "Constant" : "Balanced"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="block text-blue-300">H⊗(n+1)</span>
                  <span className="mt-1 block text-gray-600">Superposition</span>
                </div>
                <div className="rounded-xl border border-violet-400/30 bg-violet-400/[0.06] p-3">
                  <span className="block text-violet-300">U<sub>f</sub> × 1</span>
                  <span className="mt-1 block text-gray-600">Phase oracle</span>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="block text-blue-300">H⊗n</span>
                  <span className="mt-1 block text-gray-600">Interference</span>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-300">Measurement probabilities</p>
                  <p className="text-xs text-gray-600">First register</p>
                </div>
                <div className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-2">
                  {result.probabilities.map((probability, state) => (
                    <div key={state} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-xs">
                      <span className="font-mono text-gray-400">|{toBinary(state, numberOfQubits)}⟩</span>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all duration-500"
                          style={{ width: `${probability * 100}%` }}
                        />
                      </div>
                      <span className="text-right font-mono text-gray-500">{(probability * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <details className="mt-7 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-300">Inspect the oracle table</summary>
                <div className="mt-4 max-h-44 overflow-y-auto">
                  <div className="grid grid-cols-3 border-b border-white/10 pb-2 text-xs uppercase tracking-wider text-gray-600">
                    <span>x</span><span>f(x)</span><span>Phase</span>
                  </div>
                  {inputs.map((x) => {
                    const value = oracleValue(x, numberOfQubits, family, constantValue, balancedRule);
                    return (
                      <div key={x} className="grid grid-cols-3 border-b border-white/[0.05] py-2 font-mono text-sm text-gray-400 last:border-0">
                        <span>{toBinary(x, numberOfQubits)}</span>
                        <span>{value}</span>
                        <span className={result.phases[x] === 1 ? "text-cyan-300" : "text-violet-300"}>
                          {result.phases[x] === 1 ? "+1" : "−1"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </details>

              <p className="mt-5 text-sm leading-6 text-gray-400">
                {result.conclusion === "constant"
                  ? "All phase contributions interfere constructively at |00…0⟩, so the function is constant."
                  : "The positive and negative contributions cancel at |00…0⟩, so the function is balanced."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
