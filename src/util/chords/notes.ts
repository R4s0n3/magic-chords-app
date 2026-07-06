import { chordVoicings } from "../voicings";

/**
 * Pure note/chord math shared by live playback (Tone.js) and MIDI export.
 * Keep this module free of Tone imports so it stays usable outside the browser.
 */

export type VoicingType = "root" | "first" | "second" | "open" | "extended";
export type PatternType =
  | "strum"
  | "pad"
  | "arp-up"
  | "arp-down"
  | "pulse"
  | "melody";

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const FLAT_NORMALIZATION: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
  Fb: "E",
};

export function normalizeNote(note: string): string {
  if (!note) return "C";
  const pitch = note.replace(/[0-9]/g, "");
  if (FLAT_NORMALIZATION[pitch]) return FLAT_NORMALIZATION[pitch];
  return pitch;
}

export function getRootFromChord(chord: string): string {
  if (!chord) return "C";
  const match = chord.match(/^([A-G][#b]?)/);
  return match?.[1] ? normalizeNote(match[1]) : "C";
}

export function transposeNote(note: string, semitones: number): string {
  const root = normalizeNote(note);
  const idx = NOTE_NAMES.indexOf(root);
  if (idx === -1) return root;

  let newIdx = (idx + semitones) % 12;
  if (newIdx < 0) newIdx += 12;

  return NOTE_NAMES[newIdx] ?? root;
}

/**
 * Fast helper to shift octave of a note string.
 * e.g., "C3" + 1 -> "C4". "F#2" + 2 -> "F#4".
 */
export function shiftOctave(note: string, shift: number): string {
  const match = note.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match?.[1] || !match[2]) return note; // fallback if no octave found (should not happen with voicings)

  const pitch = match[1];
  const oct = parseInt(match[2], 10);
  return `${pitch}${oct + shift}`;
}

/**
 * Resolve the actual pitches played for a chord (voicing lookup with root
 * fallback, shifted up one octave like live playback). Shared by the
 * sequencer and the MIDI export so stems match what you hear.
 */
export function getChordNotes(
  chord: string,
  voicingType: VoicingType = "open",
): string[] {
  if (!chord) return [];

  let voicing = chordVoicings[chord];

  if (!voicing) {
    const root = getRootFromChord(chord);
    const baseKey = Object.keys(chordVoicings).find(
      (k) => k === root || normalizeNote(k) === root,
    );
    if (baseKey) voicing = chordVoicings[baseKey];
  }

  if (!voicing) return [];

  const baseNotes = voicing[voicingType] || voicing.open || voicing.root;
  if (!baseNotes) return [];

  // FAST OCTAVE SHIFT (String based)
  return baseNotes.map((n) => shiftOctave(n, 1));
}
