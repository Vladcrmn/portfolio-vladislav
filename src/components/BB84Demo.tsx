"use client";

import { useState } from "react";

type Bit = 0 | 1;
type Basis = "Z" | "X";
type QuantumState = "H" | "V" | "+" | "-";

type SimulationResult = {
  bitsAlice: Bit[];
  basesAlice: Basis[];
  statesAlice: QuantumState[];

  eveActive: boolean;
  basesEve?: Basis[];
  bitsEve?: Bit[];
  statesEve?: QuantumState[];

  basesBob: Basis[];
  bitsBob: Bit[];

  kept: boolean[];

  aliceSiftedKey: Bit[];
  bobSiftedKey: Bit[];

  sampleAlice: Bit[];
  sampleBob: Bit[];

  aliceRemainingKey: Bit[];
  bobRemainingKey: Bit[];

  qber: number;
  protocolAccepted: boolean;

  bobCorrectedKey: Bit[];
  errorCorrectionSuccessful: boolean;

  finalAliceKey: Bit[];
  finalBobKey: Bit[];
  finalKeysIdentical: boolean;
};


// --------------------------------------------------
// Random generation
// --------------------------------------------------

function randomBit(): Bit {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);

  return (values[0] % 2) as Bit;
}


function generateBits(n: number): Bit[] {
  return Array.from({ length: n }, () => randomBit());
}


function generateBases(n: number): Basis[] {
  return Array.from(
    { length: n },
    () => (randomBit() === 0 ? "Z" : "X")
  );
}


// --------------------------------------------------
// Quantum states
// --------------------------------------------------

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


// --------------------------------------------------
// Measurement
// --------------------------------------------------

function measure(
  states: QuantumState[],
  measurementBases: Basis[]
): Bit[] {
  return states.map((state, i) => {
    const base = measurementBases[i];

    // Same Z basis
    if (base === "Z" && state === "H") {
      return 0;
    }

    if (base === "Z" && state === "V") {
      return 1;
    }

    // Same X basis
    if (base === "X" && state === "+") {
      return 0;
    }

    if (base === "X" && state === "-") {
      return 1;
    }

    // Different basis -> random result
    return randomBit();
  });
}


// --------------------------------------------------
// Sifting
// --------------------------------------------------

function siftKey(
  bits: Bit[],
  basesAlice: Basis[],
  basesBob: Basis[]
): Bit[] {
  return bits.filter(
    (_, i) => basesAlice[i] === basesBob[i]
  );
}


// --------------------------------------------------
// QBER
// --------------------------------------------------

function calculateQber(
  aliceKey: Bit[],
  bobKey: Bit[]
): number {
  if (aliceKey.length === 0) {
    return 0;
  }

  let errors = 0;

  for (let i = 0; i < aliceKey.length; i++) {
    if (aliceKey[i] !== bobKey[i]) {
      errors++;
    }
  }

  return errors / aliceKey.length;
}


// Random sample without replacement
function randomSampleIndices(
  length: number,
  sampleSize: number
): number[] {
  const indices = Array.from(
    { length },
    (_, i) => i
  );

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);

    const j = values[0] % (i + 1);

    [indices[i], indices[j]] = [
      indices[j],
      indices[i],
    ];
  }

  return indices.slice(0, sampleSize);
}


function estimateQber(
  aliceKey: Bit[],
  bobKey: Bit[],
  proportion = 0.2
) {
  if (aliceKey.length === 0) {
    return {
      qber: 0,
      sampleAlice: [] as Bit[],
      sampleBob: [] as Bit[],
      aliceRemainingKey: [] as Bit[],
      bobRemainingKey: [] as Bit[],
    };
  }

  const sampleSize = Math.max(
    1,
    Math.floor(aliceKey.length * proportion)
  );

  const sampleIndices = randomSampleIndices(
    aliceKey.length,
    sampleSize
  );

  const sampleSet = new Set(sampleIndices);

  const sampleAlice = sampleIndices.map(
    (i) => aliceKey[i]
  );

  const sampleBob = sampleIndices.map(
    (i) => bobKey[i]
  );

  const qber = calculateQber(
    sampleAlice,
    sampleBob
  );

  const aliceRemainingKey = aliceKey.filter(
    (_, i) => !sampleSet.has(i)
  );

  const bobRemainingKey = bobKey.filter(
    (_, i) => !sampleSet.has(i)
  );

  return {
    qber,
    sampleAlice,
    sampleBob,
    aliceRemainingKey,
    bobRemainingKey,
  };
}


// --------------------------------------------------
// QBER threshold
// --------------------------------------------------

function verifyQber(
  qber: number,
  threshold = 0.11
): boolean {
  return qber <= threshold;
}


// --------------------------------------------------
// V4 — Error correction
// --------------------------------------------------

function calculateParity(block: Bit[]): Bit {
  const sum = block.reduce<number>(
    (total, bit) => total + bit,
    0
  );

  return (sum % 2) as Bit;
}


function splitIntoBlocks(
  key: Bit[],
  blockSize: number
): Bit[][] {
  const blocks: Bit[][] = [];

  for (let i = 0; i < key.length; i += blockSize) {
    blocks.push(key.slice(i, i + blockSize));
  }

  return blocks;
}


function findDifferentBlocks(
  aliceKey: Bit[],
  bobKey: Bit[],
  blockSize: number
): number[] {
  const aliceBlocks = splitIntoBlocks(aliceKey, blockSize);
  const bobBlocks = splitIntoBlocks(bobKey, blockSize);
  const differentBlocks: number[] = [];

  for (let i = 0; i < aliceBlocks.length; i++) {
    if (
      calculateParity(aliceBlocks[i]) !==
      calculateParity(bobBlocks[i])
    ) {
      differentBlocks.push(i);
    }
  }

  return differentBlocks;
}


function locateError(
  aliceBlock: Bit[],
  bobBlock: Bit[]
): number {
  let alicePart = [...aliceBlock];
  let bobPart = [...bobBlock];
  let position = 0;

  while (alicePart.length > 1) {
    const middle = Math.floor(alicePart.length / 2);
    const aliceLeft = alicePart.slice(0, middle);
    const bobLeft = bobPart.slice(0, middle);

    if (calculateParity(aliceLeft) !== calculateParity(bobLeft)) {
      alicePart = aliceLeft;
      bobPart = bobLeft;
    } else {
      alicePart = alicePart.slice(middle);
      bobPart = bobPart.slice(middle);
      position += middle;
    }
  }

  return position;
}


function correctErrors(
  aliceKey: Bit[],
  bobKey: Bit[],
  blockSize: number
): Bit[] {
  const correctedBobKey = [...bobKey];
  const aliceBlocks = splitIntoBlocks(aliceKey, blockSize);
  const bobBlocks = splitIntoBlocks(correctedBobKey, blockSize);

  const differentBlocks = findDifferentBlocks(
    aliceKey,
    correctedBobKey,
    blockSize
  );

  for (const blockIndex of differentBlocks) {
    const localPosition = locateError(
      aliceBlocks[blockIndex],
      bobBlocks[blockIndex]
    );

    const globalPosition =
      blockIndex * blockSize + localPosition;

    correctedBobKey[globalPosition] =
      correctedBobKey[globalPosition] === 0 ? 1 : 0;
  }

  return correctedBobKey;
}


function keysAreEqual(
  aliceKey: Bit[],
  bobKey: Bit[]
): boolean {
  return (
    aliceKey.length === bobKey.length &&
    aliceKey.every((bit, i) => bit === bobKey[i])
  );
}


// --------------------------------------------------
// V4 — Privacy amplification
// --------------------------------------------------

function keyToText(key: Bit[]): string {
  return key.join("");
}


async function hashKey(key: Bit[]): Promise<Bit[]> {
  const encodedKey = new TextEncoder().encode(keyToText(key));
  const digest = await crypto.subtle.digest("SHA-256", encodedKey);

  return Array.from(new Uint8Array(digest)).flatMap((byte) =>
    Array.from(
      { length: 8 },
      (_, i) => ((byte >> (7 - i)) & 1) as Bit
    )
  );
}


async function privacyAmplification(key: Bit[]): Promise<Bit[]> {
  const hashBits = await hashKey(key);
  const finalLength = Math.min(
    256,
    Math.floor(key.length / 2)
  );

  return hashBits.slice(0, finalLength);
}


// --------------------------------------------------
// UI row
// --------------------------------------------------

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


// --------------------------------------------------
// Component
// --------------------------------------------------

export default function BB84Demo() {
  const [numberOfBits, setNumberOfBits] =
    useState(128);

  const [eveActive, setEveActive] =
    useState(false);

  const [result, setResult] =
    useState<SimulationResult | null>(null);


  async function runSimulation() {

    // -------------------------
    // Alice
    // -------------------------

    const bitsAlice =
      generateBits(numberOfBits);

    const basesAlice =
      generateBases(numberOfBits);

    const statesAlice =
      prepareStates(
        bitsAlice,
        basesAlice
      );


    // States actually transmitted to Bob
    let transmittedStates = statesAlice;

    let basesEve: Basis[] | undefined;
    let bitsEve: Bit[] | undefined;
    let statesEve: QuantumState[] | undefined;


    // -------------------------
    // Eve
    // -------------------------

    if (eveActive) {
      basesEve =
        generateBases(numberOfBits);

      bitsEve =
        measure(
          statesAlice,
          basesEve
        );

      statesEve =
        prepareStates(
          bitsEve,
          basesEve
        );

      transmittedStates = statesEve;
    }


    // -------------------------
    // Bob
    // -------------------------

    const basesBob =
      generateBases(numberOfBits);

    const bitsBob =
      measure(
        transmittedStates,
        basesBob
      );


    // -------------------------
    // Sifting
    // -------------------------

    const kept = basesAlice.map(
      (base, i) =>
        base === basesBob[i]
    );

    const aliceSiftedKey =
      siftKey(
        bitsAlice,
        basesAlice,
        basesBob
      );

    const bobSiftedKey =
      siftKey(
        bitsBob,
        basesAlice,
        basesBob
      );


    // -------------------------
    // QBER estimation
    // -------------------------

    const {
      qber,
      sampleAlice,
      sampleBob,
      aliceRemainingKey,
      bobRemainingKey,
    } = estimateQber(
      aliceSiftedKey,
      bobSiftedKey,
      0.2
    );


    const protocolAccepted =
      verifyQber(qber);


    // -------------------------
    // V4 post-processing
    // -------------------------

    let bobCorrectedKey: Bit[] = [];
    let errorCorrectionSuccessful = false;
    let finalAliceKey: Bit[] = [];
    let finalBobKey: Bit[] = [];
    let finalKeysIdentical = false;

    if (protocolAccepted) {
      bobCorrectedKey = correctErrors(
        aliceRemainingKey,
        bobRemainingKey,
        8
      );

      errorCorrectionSuccessful = keysAreEqual(
        aliceRemainingKey,
        bobCorrectedKey
      );

      if (errorCorrectionSuccessful) {
        [finalAliceKey, finalBobKey] = await Promise.all([
          privacyAmplification(aliceRemainingKey),
          privacyAmplification(bobCorrectedKey),
        ]);

        finalKeysIdentical = keysAreEqual(
          finalAliceKey,
          finalBobKey
        );
      }
    }


    setResult({
      bitsAlice,
      basesAlice,
      statesAlice,

      eveActive,
      basesEve,
      bitsEve,
      statesEve,

      basesBob,
      bitsBob,

      kept,

      aliceSiftedKey,
      bobSiftedKey,

      sampleAlice,
      sampleBob,

      aliceRemainingKey,
      bobRemainingKey,

      qber,
      protocolAccepted,

      bobCorrectedKey,
      errorCorrectionSuccessful,

      finalAliceKey,
      finalBobKey,
      finalKeysIdentical,
    });
  }


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
            {eveActive
              ? "Intercept-resend attack enabled"
              : "Ideal channel · No eavesdropper"}
          </p>
        </div>


        {/* Eve toggle */}

        <label className="flex cursor-pointer items-center gap-3">

          <input
            type="checkbox"
            checked={eveActive}
            onChange={(e) =>
              setEveActive(e.target.checked)
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-300">
            Enable Eve
          </span>

        </label>


        {/* Number of bits */}

        <div className="w-full max-w-xs">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-400">
            Number of photons
          </span>

          <span className="text-blue-400">
            {numberOfBits}
          </span>
        </div>

        <input
          type="range"
          min="8"
          max="128"
          step="8"
          value={numberOfBits}
          onChange={(e) =>
            setNumberOfBits(Number(e.target.value))
          }
          className="w-full"
        />

        {eveActive && numberOfBits < 64 && (
          <p className="mt-2 text-xs leading-relaxed text-amber-400">
            Small sample: Eve may remain undetected because of statistical fluctuations.
          </p>
        )}
      </div>


        <button
          onClick={runSimulation}
          className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400"
        >
          Run simulation
        </button>

      </div>


      {/* Results */}

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


          {/* Eve */}

          {result.eveActive &&
            result.basesEve &&
            result.bitsEve &&
            result.statesEve && (

            <div>

              <div className="mb-4 flex items-center gap-3">

                <p className="font-medium text-red-400">
                  Eve
                </p>

                <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-1 text-xs text-red-300">
                  Intercept · Measure · Resend
                </span>

              </div>

              <div className="overflow-x-auto pb-3">

                <div className="min-w-max space-y-3">

                  <DataRow
                    label="Bases"
                    values={result.basesEve}
                  />

                  <DataRow
                    label="Results"
                    values={result.bitsEve}
                  />

                  <DataRow
                    label="Resent"
                    values={result.statesEve}
                  />

                </div>

              </div>

              <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-widest text-red-400/60">

                <div className="h-px flex-1 bg-red-400/10" />

                Resent states →

                <div className="h-px flex-1 bg-red-400/10" />

              </div>

            </div>

          )}


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
                values={result.kept.map(
                  (keep) =>
                    keep ? "✓" : "×"
                )}
              />

            </div>


            <div className="mt-5 space-y-2 font-mono text-sm">

              <p>
                <span className="text-gray-500">
                  Alice:
                </span>{" "}
                {result.aliceSiftedKey.join("")}
              </p>

              <p>
                <span className="text-gray-500">
                  Bob:
                </span>{" "}
                {result.bobSiftedKey.join("")}
              </p>

            </div>

          </div>


          {/* QBER */}

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-sm uppercase tracking-widest text-gray-500">
              QBER estimation
            </p>


            {result.aliceSiftedKey.length > 0 ? (
              <>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">

                  <div>
                    <p className="text-xs text-gray-500">
                      Public sample
                    </p>

                    <p className="mt-1 font-mono">
                      {result.sampleAlice.length} bits
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Estimated QBER
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {(result.qber * 100).toFixed(2)}%
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Security threshold
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      11%
                    </p>
                  </div>

                </div>


                {/* Public sample */}

                <div className="mt-6 border-t border-white/10 pt-5">

                  <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
                    Publicly revealed sample
                  </p>

                  <div className="space-y-2 font-mono text-sm">

                    <p>
                      <span className="text-gray-500">
                        Alice:
                      </span>{" "}
                      {result.sampleAlice.join("")}
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Bob:
                      </span>{" "}
                      {result.sampleBob.join("")}
                    </p>

                  </div>

                </div>


                {/* Decision */}

                <div
                  className={`mt-6 rounded-xl border p-4 ${
                    result.protocolAccepted
                      ? "border-green-400/20 bg-green-400/5"
                      : "border-red-400/20 bg-red-400/5"
                  }`}
                >

                  <p
                    className={`font-medium ${
                      result.protocolAccepted
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.protocolAccepted
                      ? "✓ QBER acceptable — protocol continues"
                      : "✕ QBER too high — protocol aborted"}
                  </p>

                </div>


                {/* Remaining candidate key */}

                {result.protocolAccepted ? (

                  <div className="mt-6 border-t border-white/10 pt-5">

                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Remaining candidate key
                    </p>

                    <div className="mt-3 space-y-2 font-mono text-sm">

                      <p>
                        <span className="text-gray-500">
                          Alice:
                        </span>{" "}
                        {result.aliceRemainingKey.join("") || "—"}
                      </p>

                      <p>
                        <span className="text-gray-500">
                          Bob:
                        </span>{" "}
                        {result.bobRemainingKey.join("") || "—"}
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="mt-6 border-t border-white/10 pt-5">

                    <p className="text-sm text-red-400">
                      Remaining key discarded because the protocol was aborted.
                    </p>

                  </div>

                )}

              </>
            ) : (

              <p className="mt-4 text-sm text-gray-400">
                No matching bases in this run. Try again.
              </p>

            )}

          </div>


          {/* V4 — Error correction */}

          {result.protocolAccepted &&
            result.aliceRemainingKey.length > 0 && (

            <div className="mt-8 rounded-xl border border-blue-400/20 bg-blue-400/[0.04] p-5">

              <p className="text-sm uppercase tracking-widest text-blue-400">
                V4 · Error correction
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-gray-500">
                    Method
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    Block parity + binary search
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Block size
                  </p>

                  <p className="mt-1 font-mono text-gray-200">
                    8 bits
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Reconciliation
                  </p>

                  <p
                    className={`mt-1 font-medium ${
                      result.errorCorrectionSuccessful
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.errorCorrectionSuccessful
                      ? "✓ Successful"
                      : "✕ Failed"}
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 font-mono text-sm">

                <p>
                  <span className="text-gray-500">
                    Alice:
                  </span>{" "}
                  {result.aliceRemainingKey.join("") || "—"}
                </p>

                <p>
                  <span className="text-gray-500">
                    Bob before:
                  </span>{" "}
                  {result.bobRemainingKey.join("") || "—"}
                </p>

                <p>
                  <span className="text-gray-500">
                    Bob corrected:
                  </span>{" "}
                  {result.bobCorrectedKey.join("") || "—"}
                </p>

              </div>

              {!result.errorCorrectionSuccessful && (
                <p className="mt-5 text-sm text-red-400">
                  Reconciliation failed — the remaining key is discarded.
                </p>
              )}

            </div>

          )}


          {/* V4 — Privacy amplification */}

          {result.protocolAccepted &&
            result.errorCorrectionSuccessful && (

            <div className="mt-8 rounded-xl border border-green-400/20 bg-green-400/[0.04] p-5">

              <p className="text-sm uppercase tracking-widest text-green-400">
                V4 · Privacy amplification
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-gray-500">
                    Hash function
                  </p>

                  <p className="mt-1 font-medium text-gray-200">
                    SHA-256
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Before
                  </p>

                  <p className="mt-1 font-mono text-gray-200">
                    {result.aliceRemainingKey.length} bits
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Final key
                  </p>

                  <p className="mt-1 font-mono text-gray-200">
                    {result.finalAliceKey.length} bits
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 font-mono text-sm">

                <p>
                  <span className="text-gray-500">
                    Alice:
                  </span>{" "}
                  {result.finalAliceKey.join("") || "—"}
                </p>

                <p>
                  <span className="text-gray-500">
                    Bob:
                  </span>{" "}
                  {result.finalBobKey.join("") || "—"}
                </p>

              </div>

              <p
                className={`mt-5 font-medium ${
                  result.finalKeysIdentical
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {result.finalKeysIdentical
                  ? "✓ Final shared keys are identical"
                  : "✕ Final keys do not match"}
              </p>

            </div>

          )}




          {/* Statistical note */}

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Small simulations may show strong statistical
            fluctuations. With a full intercept-resend attack,
            the QBER approaches approximately 25% as the number
            of transmitted photons increases.
          </p>

        </div>
      )}

    </div>
  );
}