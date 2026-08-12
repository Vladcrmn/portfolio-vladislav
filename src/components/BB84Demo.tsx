"use client";

import { useState } from "react";

type Bit = 0 | 1;
type Basis = "Z" | "X";
type QuantumState = "H" | "V" | "+" | "-";

type SimulationResult = {
  bitsAlice: Bit[];
  basesAlice: Basis[];
  statesAlice: QuantumState[];
  basesBob: Basis[];
  bitsBob: Bit[];
  kept: boolean[];
  aliceKey: Bit[];
  bobKey: Bit[];
};


// Génère un bit aléatoire
function randomBit(): Bit {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);

  return (values[0] % 2) as Bit;
}


// Génère n bits aléatoires
function generateBits(n: number): Bit[] {
  return Array.from({ length: n }, () => randomBit());
}


// Génère n bases aléatoires Z ou X
function generateBases(n: number): Basis[] {
  return Array.from(
    { length: n },
    () => (randomBit() === 0 ? "Z" : "X")
  );
}


// Correspondance bit + base -> état quantique
function prepareStates(
  bits: Bit[],
  bases: Basis[]
): QuantumState[] {
  return bits.map((bit, i) => {
    if (bases[i] === "Z") {
      return bit === 0 ? "H" : "V";
    }

    return bit === 0 ? "+" : "-";
  });
}


// Mesures de Bob
function measure(
  states: QuantumState[],
  basesBob: Basis[]
): Bit[] {
  return states.map((state, i) => {
    const base = basesBob[i];

    // Bonne base Z
    if (base === "Z" && state === "H") {
      return 0;
    }

    if (base === "Z" && state === "V") {
      return 1;
    }

    // Bonne base X
    if (base === "X" && state === "+") {
      return 0;
    }

    if (base === "X" && state === "-") {
      return 1;
    }

    // Mauvaise base -> résultat aléatoire
    return randomBit();
  });
}


// Sifting
function siftKey(
  bits: Bit[],
  basesAlice: Basis[],
  basesBob: Basis[]
): Bit[] {
  return bits.filter(
    (_, i) => basesAlice[i] === basesBob[i]
  );
}


// Petite ligne graphique réutilisable
function DataRow({
  label,
  values,
}: {
  label: string;
  values: (string | number)[];
}) {
  return (
    <div className="flex items-center gap-4">
      <p className="w-20 shrink-0 text-sm text-gray-500">
        {label}
      </p>

      <div className="flex gap-2">
        {values.map((value, i) => (
          <div
            key={i}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}


export default function BB84Demo() {
  const [numberOfBits, setNumberOfBits] = useState(8);

  const [result, setResult] =
    useState<SimulationResult | null>(null);


  function runSimulation() {
    // Alice
    const bitsAlice = generateBits(numberOfBits);
    const basesAlice = generateBases(numberOfBits);

    const statesAlice = prepareStates(
      bitsAlice,
      basesAlice
    );

    // Bob
    const basesBob = generateBases(numberOfBits);

    const bitsBob = measure(
      statesAlice,
      basesBob
    );

    // Sifting
    const kept = basesAlice.map(
      (base, i) => base === basesBob[i]
    );

    const aliceKey = siftKey(
      bitsAlice,
      basesAlice,
      basesBob
    );

    const bobKey = siftKey(
      bitsBob,
      basesAlice,
      basesBob
    );

    setResult({
      bitsAlice,
      basesAlice,
      statesAlice,
      basesBob,
      bitsBob,
      kept,
      aliceKey,
      bobKey,
    });
  }


  const keysMatch =
    result !== null &&
    result.aliceKey.join("") === result.bobKey.join("");


  return (
    <div className="mt-10 rounded-2xl border border-blue-400/20 bg-[#081522] p-6">

      {/* Header */}

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
            Interactive Demo
          </p>

          <h4 className="mt-2 text-xl font-semibold">
            Run BB84
          </h4>

          <p className="mt-2 text-sm text-gray-500">
            Ideal channel · No eavesdropper
          </p>
        </div>


        {/* Nombre de bits */}

        <div className="w-full max-w-xs">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-400">
              Number of bits
            </span>

            <span className="text-blue-400">
              {numberOfBits}
            </span>
          </div>

          <input
            type="range"
            min="4"
            max="32"
            value={numberOfBits}
            onChange={(e) =>
              setNumberOfBits(Number(e.target.value))
            }
            className="w-full"
          />
        </div>


        <button
          onClick={runSimulation}
          className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400"
        >
          Run simulation
        </button>
      </div>


      {/* Résultats */}

      {result && (
        <div className="mt-10">

          {/* Alice */}

          <div>
            <p className="mb-4 font-medium text-blue-400">
              Alice
            </p>

            <div className="overflow-x-auto pb-3">
              <div className="min-w-max space-y-3">

                <DataRow
                  label="Bits"
                  values={result.bitsAlice}
                />

                <DataRow
                  label="Bases"
                  values={result.basesAlice}
                />

                <DataRow
                  label="States"
                  values={result.statesAlice}
                />

              </div>
            </div>
          </div>


          {/* Transmission */}

          <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-widest text-gray-600">
            <div className="h-px flex-1 bg-white/10" />

            Quantum channel →

            <div className="h-px flex-1 bg-white/10" />
          </div>


          {/* Bob */}

          <div>
            <p className="mb-4 font-medium text-purple-400">
              Bob
            </p>

            <div className="overflow-x-auto pb-3">
              <div className="min-w-max space-y-3">

                <DataRow
                  label="Bases"
                  values={result.basesBob}
                />

                <DataRow
                  label="Results"
                  values={result.bitsBob}
                />

              </div>
            </div>
          </div>


          {/* Sifting */}

          <div className="mt-8 border-t border-white/10 pt-6">

            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
              Sifting
            </p>

            <div className="overflow-x-auto pb-3">
              <DataRow
                label="Keep"
                values={result.kept.map((keep) =>
                  keep ? "✓" : "×"
                )}
              />
            </div>

          </div>


          {/* Clé */}

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-sm uppercase tracking-widest text-gray-500">
              Shared key
            </p>

            {result.aliceKey.length > 0 ? (
              <>
                <div className="mt-4 space-y-2 font-mono">

                  <p>
                    <span className="text-gray-500">
                      Alice:
                    </span>{" "}
                    {result.aliceKey.join("")}
                  </p>

                  <p>
                    <span className="text-gray-500">
                      Bob:
                    </span>{" "}
                    {result.bobKey.join("")}
                  </p>

                </div>

                <p
                  className={`mt-4 text-sm ${
                    keysMatch
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {keysMatch
                    ? "✓ Keys match"
                    : "✕ Keys do not match"}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                No matching bases in this run. Try again.
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}