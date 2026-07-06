import * as Tone from "tone";
import { getSynth, getBassSynth } from "../synth";
import {
  getChordNotes,
  getRootFromChord,
  transposeNote,
  shiftOctave,
} from "./notes";

// Re-export the pure helpers so existing imports keep working
export { getChordNotes, getRootFromChord, shiftOctave } from "./notes";
export type { VoicingType, PatternType } from "./notes";
import type { VoicingType, PatternType } from "./notes";

export async function playChord(
  chord: ChordName,
  timing?: { duration: string | number; time?: number },
  voicingType: VoicingType = "open",
  pattern: PatternType = "strum",
) {
  const notes = getChordNotes(chord, voicingType);
  if (notes.length === 0) return;

  const duration = timing?.duration ?? "1m";
  const startTime = timing?.time ?? Tone.now();

  const synth = getSynth();
  if (!synth) return;

  const beat = Tone.Time("4n").toSeconds();
  const sixteenth = Tone.Time("16n").toSeconds();

  switch (pattern) {
    case "pad":
      synth.triggerAttackRelease(notes, duration, startTime);
      break;

    case "arp-up":
      for (let i = 0; i < 16; i++) {
        const note = notes[i % notes.length];
        if (note)
          synth.triggerAttackRelease(
            note,
            "16n",
            startTime + i * sixteenth,
            0.6,
          );
      }
      break;

    case "arp-down":
      // eslint-disable-next-line no-case-declarations
      const reversed = [...notes].reverse();
      for (let i = 0; i < 16; i++) {
        const note = reversed[i % reversed.length];
        if (note)
          synth.triggerAttackRelease(
            note,
            "16n",
            startTime + i * sixteenth,
            0.6,
          );
      }
      break;

    case "pulse":
      {
        for (let i = 0; i < 4; i++) {
          synth.triggerAttackRelease(notes, "16n", startTime + i * beat, 0.7);
          if (i % 2 === 1) {
            synth.triggerAttackRelease(
              notes,
              "32n",
              startTime + i * beat + beat / 2,
              0.4,
            );
          }
        }
      }
      break;

    case "melody":
      {
        synth.triggerAttackRelease(notes, duration, startTime, 0.3); // Quiet pad

        const highNotes = notes.length >= 3 ? notes.slice(1) : notes;

        // Melody also shifts up +1 octave relative to the ALREADY shifted notes?
        // Or just shift base notes + 2 octaves?
        // notes is already base + 1.
        // Let's shift notes + 1 again for melody -> base + 2.
        const melodyNotes = highNotes.map((n) => shiftOctave(n, 1));

        const motifTimes = [0, 0.75, 1.5, 2.25, 3.0, 3.5];
        const motifIndices = [0, 1, 2, 1, 2, 0];

        motifTimes.forEach((t, i) => {
          const noteIdx = motifIndices[i % motifIndices.length] ?? 0;
          const note = melodyNotes[noteIdx % melodyNotes.length];
          if (note)
            synth.triggerAttackRelease(note, "8n", startTime + t * beat, 0.8);
        });
      }
      break;

    case "strum":
    default:
      notes.forEach((note, idx) => {
        synth.triggerAttackRelease(note, duration, startTime + idx * 0.04, 0.8);
      });
      break;
  }
}

export function playBass(
  chord: ChordName,
  timing?: { duration: string | number; time?: number },
) {
  const bassSynth = getBassSynth();
  if (!bassSynth) return;
  if (!chord) return;

  const match = chord.match(/^([A-G][#b]?)/);
  if (!match) return;
  const note = match[1];

  const startTime = timing?.time ?? Tone.now();
  const beat = Tone.Time("4n").toSeconds();

  const root2 = `${note}2`;
  const root3 = `${note}3`;

  bassSynth.triggerAttackRelease(root2, "4n", startTime);
  bassSynth.triggerAttackRelease(root2, "8n", startTime + 1.5 * beat);
  bassSynth.triggerAttackRelease(root3, "8n", startTime + 3 * beat);
}

const DEGREE_SEMITONES: Record<string, number> = {
  I: 0,
  i: 0,
  II: 2,
  ii: 2,
  III: 4,
  iii: 4,
  IV: 5,
  iv: 5,
  V: 7,
  v: 7,
  VI: 9,
  vi: 9,
  VII: 11,
  vii: 11,
};

export function resolveChordSymbol(
  symbol: string,
  scale: string[],
  root: string,
): string {
  if (!symbol) return root;

  const cleanSym = symbol.trim();
  const match = cleanSym.match(
    /^([b#]?)(I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii)(.*)$/i,
  );

  if (!match?.[2]) return root;

  const modifier = match[1] ?? "";
  const roman = match[2];
  // Ignore match[3] (quality suffix like maj7, 7, 9, etc.) - we only use triads

  const isMinorNum = roman === roman.toLowerCase();
  const upperRoman = roman.toUpperCase();

  let semitones = DEGREE_SEMITONES[upperRoman];
  if (semitones === undefined) return root;

  if (modifier === "b") semitones -= 1;
  if (modifier === "#") semitones += 1;

  const rootNote = getRootFromChord(root);
  const targetRoot = transposeNote(rootNote, semitones);

  // Only output triads: major (no suffix) or minor ('m')
  const finalQuality = isMinorNum ? "m" : "";

  return `${targetRoot}${finalQuality}`;
}
